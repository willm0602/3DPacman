"use strict";

import * as THREE from "./three.mjs";

const HEIGHT = 0.4;
const DEPTH = 0.01;
const mat = new THREE.MeshBasicMaterial({ color: 0x1f285f });

const ORIENTATIONS = {
	VERTICAL: 0,
	HORIZONTAL: 1
}

export default class Gate {
	constructor(x1, z1, x2, z2) {
		this.x1 = x1;
		this.z1 = z1;
		this.x2 = x2;
		this.z2 = z2;
	}

	getOrientation()
	{
		if(Math.abs(this.x1-this.x2))
		{
			return ORIENTATIONS.HORIZONTAL
		}
		return ORIENTATIONS.VERTICAL
	}

	render(scene) {
		var orientation = this.getOrientation();
		console.log(orientation);
		if(orientation == ORIENTATIONS.HORIZONTAL)
		{
			var cubeShape = new THREE.BoxGeometry(Math.abs(this.x1 - this.x2), HEIGHT, DEPTH);
			this.mesh = new THREE.Mesh(cubeShape, mat);
			this.mesh.position.x = (this.x1 + this.x2) / 2;
			this.mesh.position.z = (this.z1 + this.z2) / 2;
			console.log(this.mesh);
			scene.add(this.mesh);
		}
		else
		{
			var cubeShape = new THREE.BoxGeometry(DEPTH, HEIGHT, Math.abs(this.z2 - this.z1));
			this.mesh = new THREE.Mesh(cubeShape, mat);
			this.mesh.position.x = (this.x1 + this.x2) / 2;
			this.mesh.position.z = (this.z1 + this.z2) / 2;
			console.log(this.mesh);
			scene.add(this.mesh);
		}

	}
}
