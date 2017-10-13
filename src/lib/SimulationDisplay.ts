import * as BABYLON from "babylonjs";

export abstract class SimulationDisplay {
    protected element: HTMLCanvasElement;
    protected engine: BABYLON.Engine;
    protected scene: BABYLON.Scene;
    protected light: BABYLON.Light;
    protected mainCam: BABYLON.Camera;
    protected followCam: BABYLON.FollowCamera;

    protected boxMeshes: BABYLON.AbstractMesh[] = [];
    protected atomInstances: {[boxIndex: number]: BABYLON.InstancedMesh[]} = {};
    protected boxEdgeMeshes: {[boxIndex: number]: BABYLON.Mesh[]} = {};
    protected atomTypes: IAtomTypes = {};

    public abstract addModel(model: any): void;
    public abstract updatePositions(coords: number[][][]): void;
    public abstract updateBoundary(boxBoundaries: any[]): void;

    public pick(): BABYLON.PickingInfo {
        return this.scene.pick(this.scene.pointerX, this.scene.pointerY);
    }

    public followAtom(mesh: BABYLON.AbstractMesh) {
        this.followCam.lockedTarget = mesh;
        this.scene.activeCamera = this.followCam;
    }

    public resetCamera() {
        this.scene.activeCamera = this.mainCam;
    }

    public resize() {
        this.engine.resize();
    }

    public setVisibleBox(boxIndex: number) {
        this.boxMeshes.forEach((boxMesh, i) => {
            if(i === boxIndex) {
                boxMesh.setEnabled(true);
            } else {
                boxMesh.setEnabled(false);
            }
        });
    }
    
}

export interface IAtomTypes {
    [atomTypeIndex: number]: {
        baseMesh: BABYLON.Mesh;
    }
}
