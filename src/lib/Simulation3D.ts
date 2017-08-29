import {
    Engine, Scene, FreeCamera, Light, Vector3, HemisphericLight, MeshBuilder, ArcRotateCamera,
    Camera
} from "babylonjs";

export class Simulation3D {
    private element: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;
    private camera: Camera;
    private light: Light;

    private atomMeshes: any[];

    constructor(mountElement: HTMLCanvasElement) {
        this.element = mountElement;
        this.engine = new Engine(this.element, true);
        this.scene = new Scene(this.engine);

        // this.camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
        this.camera = new ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new Vector3(0, 0, 0), this.scene);

        this.scene.activeCamera = this.camera;
        this.camera.attachControl(this.element, false);

        this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
        this.atomMeshes = [];
        // const sphere = MeshBuilder.CreateSphere('sphere1', {segments: 16, diameter: 2}, this.scene);
        // sphere.position.y = 1;

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

    }

    public addModel(model: any) {
        const atoms: any[] = model[0]["#box"][0]["#leafList"];
        atoms.forEach((atom, i, arr) => {
            const atomMesh = MeshBuilder.CreateSphere(`atom${i}`, {segments: 16, diameter: 1}, this.scene);
            const positions = atom.position;
            atomMesh.position.x = positions[0];
            atomMesh.position.y = positions[1];
            atomMesh.position.z = positions[2];
            this.atomMeshes.push(atomMesh);
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
}
