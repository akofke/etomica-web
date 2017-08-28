import * as React from "react";
import {Simulation3D} from "../lib/Simulation3D";

export class ConfigurationViewer extends React.Component<any, any> {
    private element: HTMLCanvasElement;
    private sim3d: Simulation3D;

    public render() {
        return <div id={"configuration-viewer"}></div>;
    }

    public componentDidMount() {
        this.element = document.getElementById("configuration-viewer") as HTMLCanvasElement;
        this.sim3d = new Simulation3D(this.element);
    }
}
