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

    public addModel(model: any) {
        this.addAtomTypes(model);
        const boxes: any[] = model["#box"];
        boxes.forEach((box, boxIndex) => {

            // Create an invisible "parent" mesh for the box that can control the visibility of everything in the box
            const boxMesh: BABYLON.AbstractMesh = new BABYLON.AbstractMesh("box", this.scene);
            boxMesh.isVisible = false; // Don't render this abstract mesh

            this.boxEdgeMeshes[boxIndex] = [];
            const edges: any[] = box["#boundary"]["#shape"]["#edges"];
            edges.forEach((edge, edgeIndex) => {
                const edgeVertices: any[] = edge["#vertices"];
                const edgeMesh = BABYLON.Mesh.CreateLines(
                    `box${boxIndex}-edge${edgeIndex}`,
                    edgeVertices.map((v) => new BABYLON.Vector3(v[0], v[1], 0)),
                    this.scene
                );
                edgeMesh.material.alpha = 0.0;
                edgeMesh.enableEdgesRendering();
                edgeMesh.edgesWidth = 4.0;
                edgeMesh.edgesColor = new BABYLON.Color4(0, 0, 1, 1);
                this.boxEdgeMeshes[boxIndex].push(edgeMesh);
                edgeMesh.parent = boxMesh;
            });

            this.atomInstances[boxIndex] = [];
            const atoms: any[] = box["#leafList"];
            atoms.forEach((atom, i) => {
                const atomMesh: BABYLON.Mesh = this.atomTypes[atom["#type"].index].baseMesh;
                const atomInstance = atomMesh.createInstance(`box${boxIndex}-atom${i}`);
                const pos = atom.position;
                atomInstance.position.x = pos[0];
                atomInstance.position.y = pos[1];
                atomInstance.position.z = 0;
                this.atomInstances[boxIndex].push(atomInstance);
                atomInstance.parent = boxMesh;
            });
            console.log(boxMesh);

        });

        this.setVisibleBox(0);

    }

    public updatePositions(coords: number[][][]) {
        const numBoxes = coords.length;
        for(let boxIndex = 0; boxIndex < numBoxes; boxIndex++) {
            const box = coords[boxIndex];
            const numAtoms = box.length;
            for(let atomIndex = 0; atomIndex < numAtoms; atomIndex++) {
                const mesh = this.atomInstances[boxIndex][atomIndex];
                const coord = box[atomIndex];
                mesh.position.x = coord[0];
                mesh.position.y = coord[1];
            }
        }
    }

    private addAtomTypes(model: any) {
        model["#species"].forEach((species: any) => {
            species["#atomType"].forEach((atomType: any) => {
                const baseMesh = BABYLON.MeshBuilder.CreateDisc(
                    `atomType${atomType.index}`,
                    {radius: 0.5},
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

    public updateBoundary(boxBoundaries: any[]) {
        boxBoundaries.forEach((boundary, boxIndex) => {
            const edges: any[] = boundary.shape.edges;
            edges.forEach((edgeVertices, edgeIndex) => {
                const edgeMesh = this.boxEdgeMeshes[boxIndex][edgeIndex];
                BABYLON.MeshBuilder.CreateLines(
                    edgeMesh.name,
                    {
                        points: edgeVertices.map((v: any) => new BABYLON.Vector3(v[0], v[1], 0)),
                        instance: edgeMesh as BABYLON.LinesMesh,
                    },
                    this.scene
                );
            });
        });
    }

}
