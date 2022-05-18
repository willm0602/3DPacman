"use strict";

import Ghost from "./Ghost.mjs";
import Pellet from "./Pellet.mjs";
import * as THREE from "./three.mjs";

const PACMANRADIUS = 0.5;
const MINMOUTH = 0;
const MAXMOUTH = Math.PI;
const MOUTHDELTA = 0.3;
const SIDES = 256;
const MOVETIME = 100;
const MOVESTEPS = 15;
const DT = MOVETIME / MOVESTEPS;

function getFacing(key, dir) {
  if (key == "w") return [0, -1];
  if (key == "a") return [-1, 0];
  if (key == "s") return [0, 1];
  if (key == "d") return [1, 0];
}

export default class Player {
  constructor(x = 0, z = 0, angle = 0) {
    //number properties of pacman
    this.x = x;
    this.z = z;
    this.angle = angle;
    this.facing = [0, -1];

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

    //material for Pacman
    var mat = new THREE.MeshBasicMaterial({
      color: 0xf6ff00,
      transparent: true,
      opacity: 0.8,
    });

    //object properties
    this.topMesh = new THREE.Mesh(topShape, mat);
    this.botMesh = new THREE.Mesh(botShape, mat);
    this.moving = false;
    this.opening = true;
  }

  render(scene) {
    scene.add(this.topMesh);
    scene.add(this.botMesh);
  }

  //checks if player would run into a specified gate
  wouldRunIntoGate(gate) {
    var testX = this.x + this.facing[0];
    var testZ = this.z + this.facing[1];

    var gateLeft = Math.min(gate.x1, gate.x2);
    var gateRight = Math.max(gate.x1, gate.x2);

    var gateForward = Math.min(gate.z1, gate.z2);
    var gateBack = Math.max(gate.z1, gate.z2);

    if (
      gateLeft - 0.5 <= testX &&
      testX <= gateRight + 0.5 &&
      gateForward - 0.5 <= testZ &&
      testZ <= gateBack + 0.5
    ) {
      return true;
    }
    return false;
  }

  //checks if player can move in the direction it is currently in without running into a gate
  wouldRunIntoGates(gates = []) {
    for (var gate of gates) {
      if (this.wouldRunIntoGate(gate)) {
        return true;
      }
    }
    return false;
  }

  //turns the player to the direction it should be pointing
  turn(key) {
    if ("wasd".indexOf(key) > -1) this.facing = getFacing(key, this.facing);
    this.topMesh.rotation.x = 0;
    this.topMesh.rotation.z = 0;
    this.opening = true;
  }

  moveHead() {
    var dmx = this.facing[0] * MOUTHDELTA * (this.opening ? 1 : -1);
    var dmz = this.facing[1] * MOUTHDELTA * (this.opening ? 1 : -1);
    dmx = dmx / MOVESTEPS;
    dmz = dmz / MOVESTEPS;
    console.log(this.topMesh.rotation.x, this.topMesh.rotation.z);
    
    this.topMesh.rotation.x += dmx;
    this.topMesh.rotation.z += dmz;

    if (
      Math.abs(this.topMesh.rotation.x + this.topMesh.rotation.z) > MAXMOUTH
    ) {
      this.opening = false;
    }
    if (
      Math.abs(this.topMesh.rotation.x + this.topMesh.rotation.z) < MINMOUTH
    ) {
      this.opening = true;
    }
  }

  graphicsMove(dx, dz, remainingSteps, dt, camera) {
    this.topMesh.position.x += dx;
    this.topMesh.position.z += dz;
    this.botMesh.position.x += dx;
    this.botMesh.position.z += dz;
    camera.position.x += dx;
    camera.position.z += dz;
    if (remainingSteps > 0) {
      setTimeout(() => {
        this.graphicsMove(dx, dz, remainingSteps - 1, dt, camera);
        this.moveHead();

      }, dt);
    } else {
      this.topMesh.position.x = this.x;
      this.topMesh.position.z = this.z;
      this.botMesh.position.x = this.x;
      this.botMesh.position.z = this.z;
      camera.position.x = this.x;
      camera.position.z = this.z + 1;
    }
  }

  //moves the player (normally handled in each game tick)
  move(camera, gates) {
    if (!(this.moving || this.wouldRunIntoGates(gates))) {
      this.moving = true;
      this.x += this.facing[0];
      this.z += this.facing[1];
      this.graphicsMove(
        this.facing[0] / MOVESTEPS,
        this.facing[1] / MOVESTEPS,
        MOVESTEPS,
        DT,
        camera
      );
      this.moving = false;
    }
  }

  intersectsGhost(ghosts = [new Ghost()]) {
    for (var ghost of ghosts) {
      if (ghost.x == this.x && ghost.z == this.z) return ghost;
    }
    return false;
  }

  intersectsPellet(pellets = [new Pellet()]) {
    for (let pellet of pellets) {
      if (pellet.x == this.x && pellet.z == this.z) return pellet.large ? 2 : 1;
    }
    return false;
  }
}
