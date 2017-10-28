import * as React from "react";
import {SimClassInfo} from "./SimulationIndexView";
import {Link} from "react-router-dom";
import {Button, Intent, NonIdealState} from "@blueprintjs/core";
import {simulationStore} from "../../stores/SimulationStore";
import {simulationIndexStore} from "../../stores/SimulationIndexStore";
import {observer} from "mobx-react";
import {withRouter} from "react-router";
import {History} from "history";

export const SimInfoCard = withRouter(observer(({history}: any) => {
    if (simulationIndexStore.selectedClass) {
        const simInfo = simulationIndexStore.selectedClass;
        return (
            <div className="pt-card pt-elevation-1 sim-info-card">
                <h3 style={{marginBottom: "2rem"}}>{simInfo.className}</h3>
                <p dangerouslySetInnerHTML={javadocHTML(simInfo.javadoc)}/>
                <Button
                    intent={Intent.SUCCESS}
                    loading={simulationStore.isCreating}
                    text="Create Simulation"
                    onClick={() => createInstance(history)}
                />
            </div>
        );
    } else {
        return (
            <div className="pt-card pt-elevation-1 sim-info-card">
                <NonIdealState description={"Select a simulation class to view details"} visual={"graph"}/>
            </div>
        );
    }
}));

const javadocHTML = (javadoc: string) => ({
    __html: javadoc
});

const createInstance = (history: History) => {
    simulationStore.createAndLinkInstance({ className: simulationIndexStore.selectedClass.className }, history);
};

