import * as React from "react";
import {Simulation3D} from "../lib/Simulation3D";
import {createSimulationInstance, fetchModel, treeifyModel} from "../api/SimulationModel";
import { ContextMenuTarget, Menu, MenuItem } from "@blueprintjs/core";

@ContextMenuTarget
export class ConfigurationViewer extends React.Component<any, any> {
    private element: HTMLCanvasElement;
    private sim3d: Simulation3D;
    private id: string;
    private modelTree: any;

    constructor(props: any) {
        super(props);
        this.modelTree = props.modelTree;
        this.id = props.id;
    }

    public render() {
        return <canvas id={"configuration-viewer"} ref={this.setCanvasRef}>No Canvas</canvas>;
    }

    public componentDidMount() {
        this.sim3d = new Simulation3D(this.element);

        this.sim3d.addModel(this.modelTree);
        const socket = new WebSocket(`ws://localhost:8080/simulations/${this.id}/configuration`);
        socket.addEventListener("message", (event) => {
            console.log(event);
            this.sim3d.updatePositions(JSON.parse(event.data));
        });
    }

    public renderContextMenu(e: React.MouseEvent<HTMLElement>) {
        const pick = this.sim3d.pick();
        console.log(pick);
        return (
            <Menu>
                <MenuItem text="Follow Atom" onClick={() => this.sim3d.followAtomCam(pick.pickedMesh)}/>
            </Menu>
        );
    }

    private setCanvasRef = (canvas: HTMLCanvasElement) => {
        this.element = canvas;
    }
}
