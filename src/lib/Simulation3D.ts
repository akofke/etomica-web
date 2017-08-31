import {
    Engine, Scene, FreeCamera, Light, Vector3, HemisphericLight, MeshBuilder, ArcRotateCamera,
    Camera, AnaglyphArcRotateCamera, Mesh, PickingInfo, LinesMesh, StandardMaterial, Color3
} from "babylonjs";

export class Simulation3D {
    private element: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;
    private camera: Camera;
    private light: Light;

    private atomMeshes: Mesh[] = [];
    private edgeMeshes: Mesh[] = [];

    constructor(mountElement: HTMLCanvasElement) {
        this.element = mountElement;
        this.engine = new Engine(this.element, true);
        this.scene = new Scene(this.engine);

        // this.camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
        this.camera = new ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new Vector3(0, 0, 0), this.scene);
        // this.camera = new AnaglyphArcRotateCamera("aar_cam", -Math.PI/2, Math.PI/4, 20, Vector3.Zero(), 0.033, this.scene);


        this.scene.activeCamera = this.camera;
        this.camera.attachControl(this.element, false);

        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);
        // const sphere = MeshBuilder.CreateSphere('sphere1', {segments: 16, diameter: 2}, this.scene);
        // sphere.position.y = 1;

        window.addEventListener("resize", () => this.engine.resize());

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

    }

    public addModel(model: any) {
        const atoms: any[] = model["#box"][0]["#leafList"];
        atoms.forEach((atom, i, arr) => {
            const atomMesh = MeshBuilder.CreateSphere(`atom${i}`, {segments: 16, diameter: 1}, this.scene);
            const positions = atom.position;
            atomMesh.position.x = positions[0];
            atomMesh.position.y = positions[1];
            atomMesh.position.z = positions[2];
            this.atomMeshes.push(atomMesh);
        });

        const boxEdgeMat = new StandardMaterial("boxEdgeMat", this.scene);
        boxEdgeMat.alpha = 1;
        boxEdgeMat.diffuseColor = new Color3(0.9, 0.1, 0.1);
        const edges: any[] = model["#box"][0]["#boundary"]["#shape"]["#edges"];
        edges.forEach((edge) => {
            const edgeVertices: any[] = edge["#vertices"];
            // const edgeMesh = Mesh.CreateLines("box", edgeVertices.map((v) => new Vector3(v[0], v[1], v[2])), this.scene);
            const edgeMesh = Mesh.CreateTube(
                `box`,
                edgeVertices.map((v) => new Vector3(v[0], v[1], v[2])),
                1,
                8,
                () => 0.01,
                Mesh.CAP_ALL,
                this.scene
            );
            edgeMesh.material = boxEdgeMat;
            this.edgeMeshes.push(edgeMesh);
        });
    }

    public updatePositions(coords: number[][][]) {
        const box = coords[0];
        box.forEach((coord, i, arr) => {
            const mesh = this.atomMeshes[i];
            mesh.position.x = coord[0];
            mesh.position.y = coord[1];
            mesh.position.z = coord[2];
        });
    }

    public pickCoordinates(x: number, y: number): PickingInfo {
        return this.scene.pick(x, y);
    }
}
