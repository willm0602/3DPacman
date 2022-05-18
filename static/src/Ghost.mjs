import * as THREE from "./three.mjs";
import { RandomMovement } from "./GhostMovements.mjs";

const RADIUS = 0.5;
const SIDES = 32;
const LEGRADIUS = 0.05;
const BLUELIFE = 30;
const BLUE = 0x0003ff;
export default class Ghost {
  constructor(color, x = 0, z = 0, moveChoice = RandomMovement) {
    this.color = color;
    this.x = x;
    this.z = z;
    this.mat = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: 0.6,
    });
    this.moveChoice = moveChoice;
    this.blueLife = 0;
    this.origin = [x, z]
  }
  addBody(scene) {
    var bodyShape = new THREE.SphereGeometry(
      RADIUS,
      SIDES,
      SIDES,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );
    this.body = new THREE.Mesh(bodyShape, this.mat);
    this.body.position.x = this.x;
    this.body.position.z = this.z;
    this.body.position.y = 0.2;
    scene.add(this.body);
  }

  addLeg(x, z) {
    var footShape = new THREE.SphereGeometry(
      LEGRADIUS,
      64,
      64,
      0,
      Math.PI * 2,
      Math.PI / 2,
      Math.PI
    );
    var foot = new THREE.Mesh(footShape, this.mat);
    foot.position.x = x;
    foot.position.z = z;
    foot.position.y = LEGRADIUS;
    var footHeight = LEGRADIUS;

    var legHeight = RADIUS - footHeight;
    var legShape = new THREE.CylinderGeometry(
      LEGRADIUS,
      LEGRADIUS,
      legHeight,
      25
    );
    var leg = new THREE.Mesh(legShape, this.mat);
    leg.position.x = x;
    leg.position.z = z;
    leg.position.y = footHeight + legHeight / 4;

    return {
      foot: foot,
      leg: leg,
    };
  }

  addLegs(scene) {
    var legGap = (RADIUS - 3 * LEGRADIUS) / 2;
    this.legs = [];

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        var lx = this.x + i * (2 * LEGRADIUS + legGap);
        var lz = this.z + j * (2 * LEGRADIUS + legGap);
        var leg = this.addLeg(lx, lz);
        this.legs.push(leg);
      }
    }

    this.legs.forEach((leg) => {
      let legMesh = leg.leg;
      let footMesh = leg.foot;
      scene.add(legMesh);
      scene.add(footMesh);
    });
  }

  render(scene) {
    this.addBody(scene);
    this.addLegs(scene);
  }

  move(ghosts, player, gates) {
    let choice = this.moveChoice(this, ghosts, player, gates);

    let [x, z] = choice;

    let dx = x - this.x;
    let dz = z - this.z;

    this.x = x;
    this.z = z;

    for (let leg of this.legs) {
      leg.foot.position.x += dx;
      leg.leg.position.x += dx;
      leg.foot.position.z += dz;
      leg.leg.position.z += dz;
    }

    this.body.position.x += dx;
    this.body.position.z += dz;
  }

  isBlue() {
    return this.blueLife > 0;
  }

  turnBlue() {
    this.mat.setValues({ color: BLUE });
    this.blueLife = BLUELIFE;
  }

  lowerBlue() {
    var wasBlue = this.blueLife > 0;
    this.blueLife -= 1;
    if (this.blueLife <= 0 && wasBlue) {
      this.mat.setValues({ color: this.color });
    }
  }

  kill(){
    let [x, z] = this.origin;
    this.body.position.x = x;
    this.body.position.z = z;
    for(let leg of this.legs)
    {
      let legMesh = leg.leg;
      let footMesh = leg.foot;
      let dx = legMesh.position.x - this.x;
      let dz = legMesh.position.z - this.z;
      legMesh.position.x = x + dx;
      legMesh.position.z = z + dz;
      footMesh.position.x = x + dx;
      footMesh.position.z = z + dz;
    }
    [this.x, this.z] = [x, z];
    this.blueLife = 0;
  }
}
