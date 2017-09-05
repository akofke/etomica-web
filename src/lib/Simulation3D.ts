import * as BABYLON from "babylonjs";

export class Simulation3D {
    private element: HTMLCanvasElement;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private camera: BABYLON.Camera;
    private followCam: BABYLON.FollowCamera;
    private light: BABYLON.Light;

    private atomInstances: BABYLON.InstancedMesh[] = [];
    private edgeMeshes: BABYLON.Mesh[] = [];
    private atomTypes: IAtomTypes = {};

    constructor(mountElement: HTMLCanvasElement) {
        this.element = mountElement;
        this.engine = new BABYLON.Engine(this.element, true);
        this.scene = new BABYLON.Scene(this.engine);

        // this.camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
        this.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        // this.camera = new AnaglyphArcRotateCamera("aar_cam", -Math.PI/2, Math.PI/4, 20, Vector3.Zero(), 0.033, this.scene);
        this.followCam = new BABYLON.FollowCamera("followCam", BABYLON.Vector3.Zero(), this.scene);


        this.scene.activeCamera = this.camera;
        this.camera.attachControl(this.element, false);

        this.light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
        // const sphere = MeshBuilder.CreateSphere('sphere1', {segments: 16, diameter: 2}, this.scene);
        // sphere.position.y = 1;

        window.addEventListener("resize", () => this.engine.resize());
        console.log(this.scene);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

    }

    public addModel(model: any) {
        this.addAtomTypes(model);

        const atoms: any[] = model["#box"][0]["#leafList"];
        atoms.forEach((atom, i, arr) => {
            const atomMesh: BABYLON.Mesh = this.atomTypes[atom["#type"].index].baseMesh;
            const atomInstance = atomMesh.createInstance(`atom${i}`);
            const pos = atom.position;
            atomInstance.position.x = pos[0];
            atomInstance.position.y = pos[1];
            atomInstance.position.z = pos[2];
            this.atomInstances.push(atomInstance);
        });

        const edges: any[] = model["#box"][0]["#boundary"]["#shape"]["#edges"];
        edges.forEach((edge) => {
            const edgeVertices: any[] = edge["#vertices"];
            const edgeMesh = BABYLON.Mesh.CreateLines("box", edgeVertices.map((v) => new BABYLON.Vector3(v[0], v[1], v[2])), this.scene);
            edgeMesh.material.alpha = 0.0;
            edgeMesh.enableEdgesRendering();
            edgeMesh.edgesWidth = 4.0;
            edgeMesh.edgesColor = new BABYLON.Color4(0, 0, 1, 1);
            this.edgeMeshes.push(edgeMesh);
        });
        console.log(this.scene);
    }

    public updatePositions(coords: number[][][]) {
        const box = coords[0];
        box.forEach((coord, i, arr) => {
            const mesh = this.atomInstances[i];
            mesh.position.x = coord[0];
            mesh.position.y = coord[1];
            mesh.position.z = coord[2];
        });
    }

    public pick(): BABYLON.PickingInfo {
        return this.scene.pick(this.scene.pointerX, this.scene.pointerY);
    }

    public followAtomCam(mesh: BABYLON.AbstractMesh) {
        this.followCam.lockedTarget = mesh;
        this.scene.activeCamera = this.followCam;

    }

    private addAtomTypes(model: any) {
        model["#species"].forEach((species: any) => {
            species["#atomType"].forEach((atomType: any) => {
                const baseMesh = BABYLON.MeshBuilder.CreateSphere(
                    `atomType${atomType.index}`,
                    {segments: 16, diameter: 1},
                    this.scene
                );
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

interface IAtomTypes {
    [atomTypeIndex: number]: {
        baseMesh: BABYLON.Mesh
    }
}
