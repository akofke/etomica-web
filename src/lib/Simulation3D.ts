import {Engine, Scene, FreeCamera, Light} from "babylonjs";

export class Simulation3D {
    private element: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;
    private camera: FreeCamera;
    private light: Light;

    constructor(mountElement: HTMLCanvasElement) {
        this.element = mountElement;
        this.engine = new Engine(this.element, true);
    }
}
