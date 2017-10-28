import * as React from "react";
import {Button, IconName, Intent} from "@blueprintjs/core";
import {simulationStore} from "../stores/SimulationStore";
import {observer} from "mobx-react";

@observer
export class SimStatusControls extends React.Component<any, any> {
    private readonly sim = simulationStore.sim;

    public render() {
        return (
            <div className="pt-button-group pt-large pt-fill">
                {this.getStatusButton()}
                {/*<Button iconName="refresh" intent={Intent.WARNING} onClick={this.handleResetClick}>Reset</Button>*/}
            </div>
        );
    }

    private getStatusButton = () => {
        if (this.sim.status === "paused") {
            return <Button iconName={"play"} intent={Intent.PRIMARY} onClick={this.handleStatusClick} loading={this.sim.isSyncing}>Start</Button>
        } else {
            return <Button iconName={"pause"} intent={Intent.PRIMARY} onClick={this.handleStatusClick} loading={this.sim.isSyncing}>Pause</Button>
        }
    }

    private handleStatusClick = () => {
        this.sim.toggle();
    }

    private handleResetClick = () => {

    }
}
