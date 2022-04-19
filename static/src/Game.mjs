import * as THREE from './three.mjs';
import Player from './Player.mjs';
import * as C from './C.mjs';
import Gates from './Gates.mjs';
import Gate from './Gate.mjs';

export default class Game{
    constructor()
    {
        //sets up scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(C.FOV, window.innerWidth / window.innerHeight, C.NEAR, C.FAR);
        this.camera.position.x = C.CAMPOS[0];
        this.camera.position.y = C.CAMPOS[1];
        this.camera.position.z = C.CAMPOS[2];
        
        this.camera.rotateX(C.CAMANGLE[0])
        this.camera.rotateY(C.CAMANGLE[1])
        this.camera.rotateZ(C.CAMANGLE[2])

        this.scene = new THREE.Scene();
        console.log(this.camera);
        
        //loads in game objects
        this.loadObjects();
    }
    loadObjects()
    {
        //adds player
        this.player = new Player();
        this.player.addToScene(this.scene);

        //adds gates
        Gates.forEach((gate) => {
            console.log(gate);
            var gateMesh = new Gate(...gate);
            gateMesh.render(this.scene);
            console.log(gateMesh);
        })
    }

    render()
    {
        console.log(this);
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild(this.renderer.domElement);
        this.animationLoop();
    }

    animationLoop(game)
    {
        if(!game)
        {
            game = this;
        }
        game.player.moveMouth();
        requestAnimationFrame(() => {game.animationLoop(game);});
        game.renderer.render(game.scene, game.camera)
    }
}