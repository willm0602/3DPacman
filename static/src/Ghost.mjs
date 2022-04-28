import * as THREE from './three.mjs';

const RADIUS = 0.5;
const SIDES = 32;
const LEGRADIUS = 0.05;

export default class Ghost{
    constructor(color, x=0,z=0)
    {
        this.color = color;
        this.x = x;
        this.z =z;
        this.mat = new THREE.MeshBasicMaterial({color: this.color, transparent: true, opacity: 0.6});
    }
    addBody(scene)
    {
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
        this.body.position.y = 0.2
        scene.add(this.body); 
    }

    addLeg(x, z)
    {
        var footShape = new THREE.SphereGeometry(LEGRADIUS, 64, 64, 0, Math.PI * 2, Math.PI / 2, Math.PI);
        var foot = new THREE.Mesh(footShape, this.mat);
        foot.position.x = x;
        foot.position.z = z;
        foot.position.y = LEGRADIUS;
        var footHeight = LEGRADIUS;

        var legHeight = RADIUS - footHeight
        var legShape = new THREE.CylinderGeometry(LEGRADIUS, LEGRADIUS, legHeight, 25);
        var leg = new THREE.Mesh(legShape, this.mat);
        leg.position.x = x;
        leg.position.z = z;
        leg.position.y = footHeight + legHeight / 4;

        return {
            foot: foot,
            leg: leg
        }

    }

    addLegs(scene)
    {
        var legGap = (RADIUS - 3 * LEGRADIUS) / 2;
        var legs = [];
        
        for(let i = -1; i<2; i++)
        {
            for(let j = -1; j < 2; j++)
            {
                var lx = this.x + i * (2 * LEGRADIUS + legGap);
                var lz = this.z + j * (2 * LEGRADIUS + legGap);
                var leg = this.addLeg(lx, lz);
                legs.push(leg);
            }
        }

        legs.forEach((leg) => {
            let legMesh = leg.leg;
            let footMesh = leg.foot;
            scene.add(legMesh);
            scene.add(footMesh);
        })
    }

    render(scene)
    {
        this.addBody(scene);
        this.addLegs(scene);
    }
}