import * as BABYLON from "babylonjs";
import { SimulationDisplay } from "./SimulationDisplay";

export class Simulation2D extends SimulationDisplay {
    constructor(mountElement: HTMLCanvasElement) {
        super();
        this.element = mountElement;
        this.engine = new BABYLON.Engine(this.element, true);
        this.scene = new BABYLON.Scene(this.engine);

        this.mainCam = new BABYLON.FreeCamera("MainCamera", new BABYLON.Vector3(0, 0, -20), this.scene);
        this.followCam = new BABYLON.FollowCamera("FollowCam", BABYLON.Vector3.Zero(), this.scene);
        this.mainCam.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this.mainCam.orthoBottom = -8;
        this.mainCam.orthoTop = 8;
        this.mainCam.orthoLeft = -8;
        this.mainCam.orthoRight = 8;
        this.scene.activeCamera = this.mainCam;
        // this.mainCam.attachControl(this.element, false);

        this.light = new BABYLON.DirectionalLight("DirLight", new BABYLON.Vector3(0, 0, 1), this.scene); 
        this.light.intensity = 0.4;

        window.addEventListener("resize", () => this.engine.resize());
        console.log(this.scene);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    public addModel(model: any): void {
        this.addAtomTypes(model);

        const atoms: any[] = model["#box"][0]["#leafList"];
        atoms.forEach((atom, i, arr) => {
            const atomMesh: BABYLON.Mesh = this.atomTypes[atom["#type"].index].baseMesh;
            const atomInstance = atomMesh.createInstance(`atom${i}`);
            const pos = atom.position;
            atomInstance.position.x = pos[0];
            atomInstance.position.y = pos[1];
            atomInstance.position.z = 0
            this.atomInstances.push(atomInstance);
        });

        const edges: any[] = model["#box"][0]["#boundary"]["#shape"]["#edges"];
        edges.forEach((edge) => {
            const edgeVertices: any[] = edge["#vertices"];
            const edgeMesh = BABYLON.Mesh.CreateLines("box", edgeVertices.map((v) => new BABYLON.Vector3(v[0], v[1], 0)), this.scene);
            edgeMesh.material.alpha = 0.0;
            edgeMesh.enableEdgesRendering();
            edgeMesh.edgesWidth = 4.0;
            edgeMesh.edgesColor = new BABYLON.Color4(0, 0, 1, 1);
            this.edgeMeshes.push(edgeMesh);
        });
        console.log(this.scene);
    }
    public updatePositions(coords: number[][][]): void {
        const box = coords[0];
        box.forEach((coord, i, arr) => {
            const mesh = this.atomInstances[i];
            mesh.position.x = coord[0];
            mesh.position.y = coord[1];
        })
    }

    private addAtomTypes(model: any) {
        model["#species"].forEach((species: any) => {
            species["#atomType"].forEach((atomType: any) => {
                const baseMesh = BABYLON.MeshBuilder.CreateDisc(
                    `atomType${atomType.index}`,
                    {radius: 0.3},
                    this.scene
                );
                baseMesh.isVisible = false;
                const baseMaterial = new BABYLON.StandardMaterial(`atomTypeMaterial${atomType.index}`, this.scene);
                baseMaterial.diffuseColor = new BABYLON.Color3(
                    Math.random(),
                    Math.random(),
                    Math.random()
                );
                baseMesh.material = baseMaterial;

                this.atomTypes[atomType.index] = {baseMesh}
            });
        });
    }

}
