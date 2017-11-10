
import {observer} from "mobx-react";
import {SimulationInstance, simulationStore} from "../../../stores/SimulationStore";
import * as React from "react";
import {PropertyControlField} from "./PropertyControlField";

export const PropertyControlList = observer(() => {
    const sim = simulationStore.sim;
    return (
        <div className="Property-list">
            {getControls(sim)}
        </div>
    );
});

const getControls = (sim: SimulationInstance) => {
    return sim.propertyControls.map((propControl) => {
        return (
            <div key={`${propControl.modelId}-${propControl.propertyName}`} className="Property-input-container">
                <PropertyControlField control={propControl}/>
            </div>
        );
    });
};
