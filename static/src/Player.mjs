"use strict";

import Gate from './Gate.mjs';
import * as THREE from './three.mjs';

const PACMANRADIUS = 0.5;
const MINMOUTH = 0;
const MAXMOUTH = Math.PI * 3/8;
const MOUTHDELTA = 0.1;
const SIDES = 256;
const MOVETIME = 100;
const MOVESTEPS = 100;
const DT = MOVETIME / MOVESTEPS;


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

        //geometries for top and bottom halves of pacman
        var topShape = new THREE.SphereGeometry(
            PACMANRADIUS,
            SIDES,
            SIDES,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        );

        var botShape = new THREE.SphereGeometry(
            PACMANRADIUS,
            SIDES,
            SIDES,
            0,
            Math.PI * 2,
            Math.PI / 2,
            Math.PI
        );
        
        //glow for pacman
        var glowShape = new THREE.SphereGeometry(
            C.PACMANRADIUS + C.GLOWGAP,
            C.SIDES,
            C.SIDES
        )

        //material for Pacman
        var mat = new THREE.MeshBasicMaterial({color: 0xF6FF00});
        var glow = new THREE.MeshBasicMaterial({color: 0xC3FF00, transparent: true, opacity: 0.5})


        //object properties
        this.topMesh = new THREE.Mesh(topShape, mat);
        this.botMesh = new THREE.Mesh(botShape, mat);
        this.glowMesh = new THREE.Mesh(glowShape, glow);
        this.moving = false;
        this.opening = true;
    }

    render(scene)
    {
        scene.add(this.topMesh);
        scene.add(this.botMesh);
        scene.add(this.glowMesh);
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
            this.topMesh.rotation.x = 0;
            this.topMesh.rotation.z = 0;
            this.opening = true;
    }

    moveHead()
    {
        var dmx = this.facing[0] * MOUTHDELTA * (this.opening ? 1 : -1);
        var dmz = this.facing[1] * MOUTHDELTA * (this.opening ? 1 : -1);
        console.log(dmx, dmz);
        this.topMesh.rotation.z+=dmx;
        this.topMesh.rotation.x+=dmz;

        if(this.topMesh.rotation.x + this.topMesh.rotation.z > MAXMOUTH)
        {
            this.opening = true;
        }
        if(this.topMesh.rotation.x + this.topMesh.rotation.z < MINMOUTH)
        {
            this.opening = false;
        }

    }

    graphicsMove(dx, dz, remainingSteps, dt, camera)
    {
        this.topMesh.position.x+=dx;
        this.topMesh.position.z+=dz;
        this.botMesh.position.x+=dx;
        this.botMesh.position.z+=dz;
        camera.position.x+=dx;
        camera.position.z+=dz;
        this.moveHead();
        if(remainingSteps > 1)
        {
            setTimeout(() => {
                this.graphicsMove(dx, dz, remainingSteps-1, dt, camera);
            }, dt);
        }
        else
        {
            this.topMesh.position.x = this.x;
            this.topMesh.position.z = this.z;
            this.botMesh.position.x = this.x;
            this.botMesh.position.z = this.z;
            camera.position.x = this.x;
            camera.position.z = this.z + 1;
        }
    }

    //moves the player (normally handled in each game tick)
    move(camera, gates)
    {
        if(!(this.moving || this.wouldRunIntoGates(gates)))
        {
            this.moving = true;
            this.x+=this.facing[0];
            this.z+=this.facing[1];
            this.graphicsMove(
                this.facing[0] / MOVESTEPS,
                this.facing[1] / MOVESTEPS,
                MOVESTEPS,
                DT,
                camera
            )
            this.moving = false;
        }
    }
}