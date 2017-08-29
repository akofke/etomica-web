import {Engine, Scene, FreeCamera, Light, Vector3, HemisphericLight, MeshBuilder} from "babylonjs";

export class Simulation3D {
    private element: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;
    private camera: FreeCamera;
    private light: Light;

    constructor(mountElement: HTMLCanvasElement) {
        this.element = mountElement;
        this.engine = new Engine(this.element, true);
        this.scene = new Scene(this.engine);

        this.camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(this.element, false);

        this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);

        const sphere = MeshBuilder.CreateSphere('sphere1', {segments: 16, diameter: 2}, this.scene);
        sphere.position.y = 1;

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

    }
}
