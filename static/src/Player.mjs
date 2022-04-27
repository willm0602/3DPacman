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

        //player shapes
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
        

        //material for Pacman
        var mat = new THREE.MeshBasicMaterial({color: 0xE6FF00});

        //object properties
        this.topMesh = new THREE.Mesh(topShape, mat);
        this.botMesh = new THREE.Mesh(botShape, mat);
        this.moving = false;
    }

    render(scene)
    {
        scene.add(this.topMesh);
        scene.add(this.botMesh);
    }

    //checks if player would run into a specified gate
    wouldRunIntoGate(gate)
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

    //checks if player can move in the direction it is currently in without running into a gate
    wouldRunIntoGates(gates=[])
    {
        for(var gate of gates)
        {
            if(this.wouldRunIntoGate(gate))
            {
                return true;
            }
        }
        return false;
    }

    //turns the player to the direction it should be pointing
    turn(key)
    {
        if('wasd'.indexOf(key) > -1)
            this.facing = getFacing(key, this.facing);
    }

    //moves the player (normally handled in each game tick)
    move(camera, gates)
    {
        if(!(this.moving || this.wouldRunIntoGates(gates)))
        {
            this.moving = true;
            this.x+=this.facing[0];
            this.z+=this.facing[1];
            camera.position.x+=this.facing[0];
            camera.position.z+=this.facing[1];
            this.botMesh.position.x = this.x;
            this.botMesh.position.z = this.z;  
            this.topMesh.position.x = this.x;
            this.topMesh.position.z = this.z;          
            this.moving = false;
        }
    }
}