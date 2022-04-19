"use strict";

import * as Three from './three.mjs';

const WIDTH = 10;
const HEIGHT = 3;
const DEPTH = 1;
const PILLARRADIUS = DEPTH * 1.2;
const mat = new Three.MeshBasicMaterial({color: 0x1F285F})

export default class Gate{
    constructor(x, z, xAxis)
    {
        this.x = x;
        this.z = z;
        this.xAxis = xAxis;
    }

    render(scene)
    {
        this.addPillars(scene);
        this.addGatePost(scene);
    }

    addPillars(scene)
    {
        if(this.xAxis)
        {
            var pillarShape = new Three.CylinderGeometry(PILLARRADIUS, PILLARRADIUS, HEIGHT);
    
            var firstPillar = new Three.Mesh(pillarShape, mat);
            firstPillar.position.x = this.x - (WIDTH / 2);
            firstPillar.position.z = this.z;
            
            var secondPillar = new Three.Mesh(pillarShape, mat);
            secondPillar.position.x = this.x + (WIDTH / 2);
            secondPillar.position.z = this.z;
    
            scene.add(firstPillar);
            scene.add(secondPillar);
            var pillarShape = new Three.CylinderGeometry(PILLARRADIUS, PILLARRADIUS, HEIGHT);
    
            var firstPillar = new Three.Mesh(pillarShape, mat);
            firstPillar.position.x = this.x - (WIDTH / 2);
            firstPillar.position.z = this.z;
            
            var secondPillar = new Three.Mesh(pillarShape, mat);
            secondPillar.position.x = this.x + (WIDTH / 2);
            secondPillar.position.z = this.z;
    
            scene.add(firstPillar);
            scene.add(secondPillar);
        }

        else
        {
            var pillarShape = new Three.CylinderGeometry(PILLARRADIUS, PILLARRADIUS, HEIGHT);
    
            var firstPillar = new Three.Mesh(pillarShape, mat);
            firstPillar.position.x = this.x;
            firstPillar.position.z = this.z - (WIDTH / 2);
            
            var secondPillar = new Three.Mesh(pillarShape, mat);
            secondPillar.position.x = this.x;
            secondPillar.position.z = this.z + (WIDTH / 2);
    
            scene.add(firstPillar);
            scene.add(secondPillar);
        }
    }

    addGatePost(scene)
    {
        if(this.xAxis)
        {
            var gap = 0.1 * HEIGHT;
            var postHeight = 0.35 * HEIGHT;

            var geo = new Three.BoxGeometry(WIDTH, postHeight, DEPTH);

            var bottomPost = new Three.Mesh(geo, mat);
            bottomPost.position.x  = this.x;
            bottomPost.position.z = this.z;
            bottomPost.position.y = gap + 0.5 * postHeight;
            scene.add(bottomPost);

            var topPost = new Three.Mesh(geo, mat);
            topPost.position.x = this.x;
            topPost.position.z = this.z;
            topPost.position.y = 2 * gap + 1.5 * postHeight;
            scene.add(topPost);
        }
        else
        {
            var gap = 0.1 * HEIGHT;
            var postHeight = 0.35 * HEIGHT;

            var geo = new Three.BoxGeometry(DEPTH, postHeight, WIDTH);

            var bottomPost = new Three.Mesh(geo, mat);
            bottomPost.position.x  = this.x;
            bottomPost.position.z = this.z;
            bottomPost.position.y = gap + 0.5 * postHeight;
            scene.add(bottomPost);

            var topPost = new Three.Mesh(geo, mat);
            topPost.position.x = this.x;
            topPost.position.z = this.z;
            topPost.position.y = 2 * gap + 1.5 * postHeight;
            scene.add(topPost);
        }
    }
}
