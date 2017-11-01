import * as React from "react";
import {Simulation3D} from "../../../lib/Simulation3D";
import {SimulationDisplay} from "../../../lib/SimulationDisplay";
import { ContextMenuTarget, Menu, MenuItem } from "@blueprintjs/core";
import { Simulation2D } from "../../../lib/Simulation2D";

import "./Configuration.css";
import {simulationStore} from "../../../stores/SimulationStore";
import {observer} from "mobx-react";

@ContextMenuTarget
@observer
export class ConfigurationView extends React.Component<any, any> {
    private element: HTMLCanvasElement;
    private simDisplay: SimulationDisplay;

    private readonly sim = simulationStore.sim;

    public render() {
        return (
            <div className={"Config-container"}>
                <span id="fps-meter"/>
                <canvas id={"Config-canvas"} ref={this.setCanvasRef}>No Canvas</canvas>
            </div>
        );
    }

    public componentDidMount() {
        const space = getSpace(this.sim.model);
        if(space === 3) {
            this.simDisplay = new Simulation3D(this.element);
        } else if(space === 2) {
            this.simDisplay = new Simulation2D(this.element);
        }

        this.simDisplay.addModel(this.sim.model);
        this.sim.simRemote.boxSocket.addEventListener("message", (event) => {
            // console.log(event);
            const update = JSON.parse(event.data);
            this.simDisplay.updatePositions(update.coordinates);
            this.simDisplay.updateBoundary(update.boxBoundaries);
        });
    }

    public renderContextMenu(e: React.MouseEvent<HTMLElement>) {
        const pick = this.simDisplay.pick();
        console.log(pick);
        if(pick.hit) {
            return (
                <Menu>
                    <MenuItem text="Follow Atom" onClick={() => this.simDisplay.followAtom(pick.pickedMesh)}/>
                </Menu>
            );
        }
    }

    public resize() {
        this.simDisplay.resize();
    }

    private setCanvasRef = (canvas: HTMLCanvasElement) => {
        this.element = canvas;
    }

}

const getSpace = (model: any): number => {
    return model["#space"]["d"];
}
