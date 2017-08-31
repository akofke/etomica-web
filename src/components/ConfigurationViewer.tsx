import * as React from "react";
import {Simulation3D} from "../lib/Simulation3D";
import {createSimulationInstance, fetchModel, treeifyModel} from "../api/SimulationModel";
import {ContextMenuTarget, Menu} from "@blueprintjs/core";

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
        return <canvas id={"configuration-viewer"}></canvas>;
    }

    public componentDidMount() {
        this.element = document.getElementById("configuration-viewer") as HTMLCanvasElement;
        this.sim3d = new Simulation3D(this.element);

        this.sim3d.addModel(this.modelTree);
        const socket = new WebSocket(`ws://localhost:8080/simulations/${this.id}/configuration`);
        socket.addEventListener("message", (event) => {
            console.log(event);
            this.sim3d.updatePositions(JSON.parse(event.data));
        });
    }

    public renderContextMenu(e: React.MouseEvent<HTMLElement>) {
        console.log(this.sim3d.pickCoordinates(e.clientX, e.clientY));
        return (
            <Menu/>
        );
    }
}
