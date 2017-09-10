import * as BABYLON from "babylonjs";

export abstract class SimulationDisplay {
    protected element: HTMLCanvasElement;
    protected engine: BABYLON.Engine;
    protected scene: BABYLON.Scene;
    protected light: BABYLON.Light;
    protected mainCam: BABYLON.Camera;
    protected followCam: BABYLON.FollowCamera;

    protected atomInstances: BABYLON.InstancedMesh[] = [];
    protected edgeMeshes: BABYLON.Mesh[] = [];
    protected atomTypes: IAtomTypes = {};

    public abstract addModel(model: any): void;
    public abstract updatePositions(coords: number[][][]): void;

    public pick(): BABYLON.PickingInfo {
        return this.scene.pick(this.scene.pointerX, this.scene.pointerY);
    }

    public followAtom(mesh: BABYLON.AbstractMesh) {
        this.followCam.lockedTarget = mesh;
        this.scene.activeCamera = this.followCam;
    }

    public resize() {
        this.engine.resize();
    }
    
}

export interface IAtomTypes {
    [atomTypeIndex: number]: {
        baseMesh: BABYLON.Mesh;
    }
}