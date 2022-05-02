import * as THREE from './three.mjs';

const LARGE_RADIUS = 0.4;
const SMALL_RADIUS = 0.2;

const MAT = new THREE.MeshBasicMaterial(
    {
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
    }
)

export default class Pellet{
    constructor(x, z, large = false)
    {
        this.x = x;
        this.z = z;
        this.large = large;
        if(large)
        {
            let shape = new THREE.SphereGeometry(
                LARGE_RADIUS,
                64,
                64
            );
            this.mesh = new THREE.Mesh(shape, MAT);
        }
        else
        {
            let shape = new THREE.SphereGeometry(
                SMALL_RADIUS,
                64,
                64
            );
            this.mesh = new THREE.Mesh(shape, MAT);
        }

        this.mesh.position.x = this.x;
        this.mesh.position.z = this.z;
    }

    render(scene)
    {
        scene.add(this.mesh);
    }
}