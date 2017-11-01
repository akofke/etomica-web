import * as BABYLON from "babylonjs";
import { SimulationDisplay } from "./SimulationDisplay";
import AnaglyphArcRotateCamera = BABYLON.AnaglyphArcRotateCamera;

export class Simulation3D extends SimulationDisplay {
    private anaglyphCam: BABYLON.AnaglyphArcRotateCamera;

    constructor(mountElement: HTMLCanvasElement) {
        super();
        this.element = mountElement;
        this.engine = new BABYLON.Engine(this.element, true);
        this.scene = new BABYLON.Scene(this.engine);

        this.mainCam = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 15, new BABYLON.Vector3(0, 0, 0), this.scene);
        this.anaglyphCam = new AnaglyphArcRotateCamera("aar_cam", -Math.PI/2, Math.PI/4, 20, BABYLON.Vector3.Zero(), 0.033, this.scene);
        this.followCam = new BABYLON.FollowCamera("followCam", BABYLON.Vector3.Zero(), this.scene);


        this.scene.activeCamera = this.mainCam;
        this.mainCam.attachControl(this.element, false);

        this.light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);

        window.addEventListener("resize", () => this.engine.resize());
        console.log(this.scene);

        const fpsMeter = document.getElementById("fps-meter");
        this.engine.runRenderLoop(() => {
            this.scene.render();
            fpsMeter.innerHTML = "FPS: " + this.engine.getFps().toFixed();
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
                const edgeMesh = BABYLON.MeshBuilder.CreateLines(
                    `box${boxIndex}-edge${edgeIndex}`,
                    {
                        points: edgeVertices.map((v) => new BABYLON.Vector3(v[0], v[1], v[2])),
                        updatable: true
                    },
                    this.scene,

                );
                edgeMesh.material.alpha = 0.0;
                edgeMesh.enableEdgesRendering();
                edgeMesh.edgesWidth = 5;
                edgeMesh.edgesColor = new BABYLON.Color4(0, 0, 1, 1);
                // edgeMesh.color = new BABYLON.Color3(1, 0, 0);
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
                atomInstance.position.z = pos[2];
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
                mesh.position.z = coord[2];
            }
        }
    }

    public updateBoundary(boxBoundaries: any[]) {
        boxBoundaries.forEach((boundary, boxIndex) => {
            const edges: any[] = boundary.shape.edges;
            edges.forEach((edgeVertices, edgeIndex) => {
                const edgeMesh = this.boxEdgeMeshes[boxIndex][edgeIndex];
                const updatedMesh = BABYLON.MeshBuilder.CreateLines(
                    null,
                    {
                        points: edgeVertices.map((v: any) => new BABYLON.Vector3(v[0], v[1], v[2])),
                        instance: edgeMesh as BABYLON.LinesMesh,
                    },
                    null
                );
                updatedMesh.enableEdgesRendering();
            });
        });
    }

    private addAtomTypes(model: any) {
        model["#species"].forEach((species: any) => {
            species["#atomType"].forEach((atomType: any) => {
                const baseMesh = BABYLON.MeshBuilder.CreateSphere(
                    `atomType${atomType.index}`,
                    {segments: 16, diameter: 1},
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
