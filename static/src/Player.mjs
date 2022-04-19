"use strict";

import * as THREE from './three.mjs';

const C = {
    PACMANRADIUS: 5,
    MINMOUTH: 0,
    MAXMOUTH: Math.PI * 2/3,
    MOUTHDELTA: .1,
    SIDES:256
}

export default class Player{
    
    constructor(x=0, z=0, angle=0)
    {
        //number properties of pacman
        this.x = x;
        this.z = z;
        this.angle = angle;

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

        this.mouthAngle = 0;
        this.opening = true;
    }

    addToScene(scene)
    {
        scene.add(this.topMesh);
        scene.add(this.botMesh);
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