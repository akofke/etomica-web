import * as React from "react";
import JSONTree from "react-json-tree";
import {simulationStore} from "../../../stores/SimulationStore";
import {Button} from "@blueprintjs/core";

export class TreeModelView extends React.Component<any, any> {

    public render() {
        return (
            <JSONTree
                data={simulationStore.sim.model}
                labelRenderer={renderLabel}
            />
        );
    }

}

const renderLabel = (path: [string | number]): JSX.Element => {
    console.log(path);
    const propName = path[0];
    if (propName.toString().charAt(0) === "$") {
        return (
            <span>
                <Button className="pt-small" iconName={"plus"} onClick={addPropControl(path)}/>
                {propName}
            </span>
        );
    } else {
        return <span>{propName}</span>;
    }
};

const addPropControl = (path: [string | number]) => () => {
    simulationStore.sim.addPropertyControl(path);
};
