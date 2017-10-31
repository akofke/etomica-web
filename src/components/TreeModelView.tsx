import * as React from "react";
import JSONTree from "react-json-tree";
import {simulationStore} from "../stores/SimulationStore";

export class TreeModelView extends React.Component<any, any> {

    public render() {
        return (
            <JSONTree data={simulationStore.sim.model}/>
        );
    }

}
