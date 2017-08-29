import * as React from "react";
import {Simulation3D} from "../lib/Simulation3D";
import {createSimulationInstance, fetchModel, treeifyModel} from "../api/SimulationModel";

export class ConfigurationViewer extends React.Component<any, any> {
    private element: HTMLCanvasElement;
    private sim3d: Simulation3D;
    private id: string;

    public render() {
        return <canvas id={"configuration-viewer"}></canvas>;
    }

    public componentDidMount() {
        this.element = document.getElementById("configuration-viewer") as HTMLCanvasElement;
        this.sim3d = new Simulation3D(this.element);

        createSimulationInstance("etomica.simulation.prototypes.HSMD3D").then((response) => {
            console.log(response.data);
            this.id = response.data;
            return fetchModel(response.data);
        }).then((response) => {
            const model = response.data;
            treeifyModel(model);
            console.log(model);
            this.sim3d.addModel(model);
            const socket = new WebSocket(`ws://localhost:8080/simulations/${this.id}/configuration`);
            socket.addEventListener("message", (event) => {
                console.log(event);
                this.sim3d.updatePositions(JSON.parse(event.data));
            });
        });
    }
}
