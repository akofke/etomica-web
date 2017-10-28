import * as React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {simulationStore} from "../../stores/SimulationStore";
import {Intent, NonIdealState, Spinner} from "@blueprintjs/core";
import {SimulationInstanceView} from "./SimulationInstanceView";

@observer
export class SimulationInstancePage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        const simId = props.match.params.simId;
        simulationStore.loadInstance(simId);
    }

    public render() {
        switch (simulationStore.sim.loadingStatus) {
            case "loading":
                return (
                    <NonIdealState
                        title={"Loading Simulation..."}
                        visual={<Spinner className="pt-large" intent={Intent.PRIMARY}/>}
                    />
                );
            case "notfound":
                return (
                    <NonIdealState
                        title={"Simulation not found"}
                    />
                );
            case "error":
                return (
                    <NonIdealState
                        title={"Error loading simulation"}
                    />
                );
            case "done":
                return (
                    <SimulationInstanceView {...this.props}/>
                );
        }
    }

}
