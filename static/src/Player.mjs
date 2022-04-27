"use strict";

import Gate from './Gate.mjs';
import * as THREE from './three.mjs';

const C = {
    PACMANRADIUS: 0.5,
    MINMOUTH: 0,
    MAXMOUTH: Math.PI * 3 / 8,
    MOUTHDELTA: .1,
    SIDES:256,
    MOVETIME: 100,
    MOVESTEPS: 100
}

function getFacing(key, dir)
{
    if(key == 'w')
        return [0, -1]
    if(key == 'a')
        return [-1, 0]
    if(key == 's')
        return [0, 1]
    if(key == 'd')
        return [1, 0]
}

export default class Player{
    
    constructor(x=0, z=0, angle=0)
    {
        //number properties of pacman
        this.x = x;
        this.z = z;
        this.angle = angle;
        this.facing = [0, -1]

        //graphics properties
        var topShape = new THREE.SphereGeometry(
            C.PACMANRADIUS,
            C.SIDES,
            C.SIDES,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        );

        var botShape = new THREE.SphereGeometry(
            C.PACMANRADIUS,
            C.SIDES,
            C.SIDES,
            0,
            Math.PI * 2,
            Math.PI / 2,
            Math.PI
        );

        var mat = new THREE.MeshBasicMaterial({color: 0xE6FF00});

        this.topMesh = new THREE.Mesh(topShape, mat);
        this.botMesh = new THREE.Mesh(botShape, mat);
        this.moving = false;
    }

    render(scene)
    {
        scene.add(this.topMesh);
        scene.add(this.botMesh);
    }

    wouldIntersectGate(gate = new Gate(0,0,0,0))
    {
        var testX = this.x + this.facing[0];
        var testZ = this.z + this.facing[1];

        var gateLeft = Math.min(gate.x1, gate.x2);
        var gateRight = Math.max(gate.x1, gate.x2);

        var gateForward = Math.min(gate.z1, gate.z2);
        var gateBack = Math.max(gate.z1, gate.z2);

        if(gateLeft <= testX && testX <= gateRight && gateForward <= testZ && testZ <= gateBack)
        {
            return true;
        }
        return false;
    }

    wouldRunIntoGates(gates=[new Gate(0, 0, 1, 2)])
    {
        console.clear();
        for(var gate of gates)
        {
            if(this.wouldIntersectGate(gate))
            {
                return true;
            }
        }
        return false;
    }

    move(key, camera, gates)
    {
        this.facing = getFacing(key, this.facing);

        if('wasd'.indexOf(key) > -1 && !this.wouldRunIntoGates(gates) && !this.moving)
        {
            this.moving = true;
            for(let i = 0; i <= C.MOVESTEPS; i++)
            {
                let j = i;
                setTimeout((e) =>{
                    this.botMesh.position.z+=this.facing[1] * (1 / C.MOVESTEPS);
                    this.topMesh.position.x+=this.facing[0] * (1 / C.MOVESTEPS);
                    this.botMesh.position.x+=this.facing[0] * (1 / C.MOVESTEPS);
                    this.topMesh.position.z+=this.facing[1] * (1 / C.MOVESTEPS);
                    camera.position.x+=this.facing[0] * (1 / C.MOVESTEPS);
                    camera.position.z+=this.facing[1] * (1 / C.MOVESTEPS);
                }, (j / C.MOVESTEPS * C.MOVETIME))
            }
            this.x+=this.facing[0];
            this.z+=this.facing[1];
            
            setTimeout(() => {
                this.topMesh.x = this.x;
                this.topMesh.z = this.z;
                this.moving=false;
            }, C.MOVETIME);

        }
    }

}