import * as THREE from "./three.mjs";
import Player from "./Player.mjs";
import * as C from "./C.mjs";
import Gates from "./Gates.mjs";
import Gate from "./Gate.mjs";
import GHOSTS from "./Ghosts.mjs";

const TICKDELAY = 0.3;

export default class Game {
  constructor() {
    //sets up scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      C.FOV,
      window.innerWidth / window.innerHeight,
      C.NEAR,
      C.FAR
    );
    this.camera.position.x = C.CAMPOS[0];
    this.camera.position.y = C.CAMPOS[1];
    this.camera.position.z = C.CAMPOS[2];

    this.camera.rotateX(C.CAMANGLE[0]);
    this.camera.rotateY(C.CAMANGLE[1]);
    this.camera.rotateZ(C.CAMANGLE[2]);

    this.scene = new THREE.Scene();
    this.ghosts = GHOSTS;
    //loads in game objects
    this.loadObjects();
  }
  loadObjects() {
    //adds player
    this.player = new Player();
    this.player.render(this.scene);

    this.gates = [];
    //adds gates
    Gates.forEach((gate) => {
      var gateMesh = new Gate(...gate);
      this.gates.push(gateMesh);
      gateMesh.render(this.scene);
    });

    this.ghosts.forEach((ghost) => {
      ghost.render(this.scene);
    })

    document.addEventListener("keypress", (e) => {
      this.player.turn(e.key, this.gates, this.camera);
    });
  }

  render() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.lastGameLoop = new Date();
    this.animationLoop();
  }
  

  gameloop(){
    this.player.move(this.camera, this.gates);
    this.lastGameLoop = new Date();
  }

  animationLoop(game) {
    if (!game) {
      game = this;
    }

    //handles one "game tick" every 1000ms (1 second)
    var now = new Date();
    var dt = (now - game.lastGameLoop) / (1000);
    if(dt >TICKDELAY)
      game.gameloop();

    requestAnimationFrame(() => {
      game.animationLoop(game);
    });
    game.renderer.render(game.scene, game.camera);
  }
}
