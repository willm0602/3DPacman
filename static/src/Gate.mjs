"use strict";

import * as THREE from "./three.mjs";

const HEIGHT = 0.4;
const DEPTH = 0.01;
const mat = new THREE.MeshBasicMaterial({ color: 0x1f285f });
const glowMat = new THREE.MeshBasicMaterial({color: 0x4050C0, transparent: true, opacity: 0.2});
const GLOWGAP = 0.06

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

		var centerX = (this.x1 + this.x2) / 2;
		var centerZ = (this.z1 + this.z2) / 2;

		var width = Math.abs(this.x2 - this.x1) + 1;
		var depth = Math.abs(this.z2 - this.z1) + 1;

		var shape = new THREE.BoxGeometry(
			width, HEIGHT, depth
		);
		
		var glowShape = new THREE.BoxGeometry(
			width + GLOWGAP, HEIGHT + GLOWGAP, depth + GLOWGAP
		)

		var mesh = new THREE.Mesh(shape, mat);
		mesh.position.x = centerX;
		mesh.position.z = centerZ;
		scene.add(mesh);

		var glowMesh = new THREE.Mesh(glowShape, glowMat);
		glowMesh.position.x = centerX;
		glowMesh.position.z = centerZ;
		scene.add(glowMesh);
	}
}
