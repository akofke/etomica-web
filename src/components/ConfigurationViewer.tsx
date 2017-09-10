import * as React from "react";
import {Simulation3D} from "../lib/Simulation3D";
import {SimulationDisplay} from "../lib/SimulationDisplay";
import {createSimulationInstance, fetchModel, treeifyModel} from "../api/SimulationModel";
import { ContextMenuTarget, Menu, MenuItem } from "@blueprintjs/core";
import { Simulation2D } from "../lib/Simulation2D";

@ContextMenuTarget
export class ConfigurationViewer extends React.Component<any, any> {
    private element: HTMLCanvasElement;
    private simDisplay: SimulationDisplay;
    private id: string;
    private modelTree: any;

    constructor(props: any) {
        super(props);
        this.modelTree = props.modelTree;
        this.id = props.id;
    }

    public render() {
        return (
            <div className={"config-viewer-container"}>
                <canvas id={"configuration-viewer"} ref={this.setCanvasRef}>No Canvas</canvas>
            </div>
        );
    }

    public componentDidMount() {
        const space = this.getSpace(this.modelTree);
        if(space === 3) {
            this.simDisplay = new Simulation3D(this.element);
        } else if(space === 2) {
            this.simDisplay = new Simulation2D(this.element);
        }

        this.simDisplay.addModel(this.modelTree);
        const socket = new WebSocket(`ws://localhost:8080/simulations/${this.id}/configuration`);
        socket.addEventListener("message", (event) => {
            console.log(event);
            this.simDisplay.updatePositions(JSON.parse(event.data));
        });
    }

    public renderContextMenu(e: React.MouseEvent<HTMLElement>) {
        const pick = this.simDisplay.pick();
        console.log(pick);
        return (
            <Menu>
                <MenuItem text="Follow Atom" onClick={() => this.simDisplay.followAtom(pick.pickedMesh)}/>
            </Menu>
        );
    }

    public resize() {
        this.simDisplay.resize();
    }

    private setCanvasRef = (canvas: HTMLCanvasElement) => {
        this.element = canvas;
    }

    private getSpace(model: any): number {
        return model["#space"]["d"];
    }
}
