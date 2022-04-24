"use strict";

import Gate from './Gate.mjs';
import * as THREE from './three.mjs';

const C = {
    PACMANRADIUS: 0.5,
    MINMOUTH: 0,
    MAXMOUTH: Math.PI * 3 / 8,
    MOUTHDELTA: .1,
    SIDES:256
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
        mat.opacity = 0.2;

        this.topMesh = new THREE.Mesh(topShape, mat);
        this.botMesh = new THREE.Mesh(botShape, mat);

        this.mouthAngle = 0;
        this.opening = true;
    }

    addToScene(scene)
    {
        scene.add(this.topMesh);
        scene.add(this.botMesh);
    }

    wouldIntersectGate(gate = new Gate(0,0,0,0))
    {
        console.log(this, gate);
        var testX = this.x + this.facing[0];
        var testZ = this.z + this.facing[1];

        var gateLeft = Math.min(gate.x1, gate.x2);
        var gateRight = Math.max(gate.x1, gate.x2);

        var gateForward = Math.min(gate.z1, gate.z2);
        var gateBack = Math.max(gate.z1, gate.z2);

        if(gateLeft <= testX && testX <= gateRight && gateForward <= testZ && testZ <= gateBack)
        {
            console.log("in gate");
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
                console.log(gate);
                return true;
            }
        }
        return false;
    }

    move(key, camera, gates)
    {

        if(key == 'w')
            this.topMesh.rotation.y = 0;
        if(key == 'a')
            this.topMesh.rotation.y = Math.PI / 2;
        if(key == 's')
            this.topMesh.rotation.y = Math.PI;
        if(key == 'd')
            this.topMesh.rotation.y = 3 * Math.PI / 2;

        this.facing = getFacing(key, this.facing);

        if('wasd'.indexOf(key) > -1 && !this.wouldRunIntoGates(gates))
        {
            this.botMesh.position.x+=this.facing[0];
            this.botMesh.position.z+=this.facing[1];
            this.topMesh.position.x+=this.facing[0];
            this.topMesh.position.z+=this.facing[1];
            this.x+=this.facing[0];
            this.z+=this.facing[1];
            camera.position.x+=this.facing[0];
            camera.position.z+=this.facing[1];
        }
        console.log(this.x, this.z);
    }

    moveMouth()
    {
        if(this.opening)
        {
            this.mouthAngle+=C.MOUTHDELTA;
            this.topMesh.rotateX(C.MOUTHDELTA)
            if(this.mouthAngle >= C.MAXMOUTH)
            {
                this.opening = false;
            }
        }
        else
        {
            this.mouthAngle-=C.MOUTHDELTA;
            this.topMesh.rotateX(-C.MOUTHDELTA)
            if(this.mouthAngle <= C.MINMOUTH)
            {
                this.opening = true;
            }
        }
    }
}