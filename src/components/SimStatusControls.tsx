import * as React from "react";
import {Button, Intent} from "@blueprintjs/core";
import Axios from "axios";

const enum Status {
    PAUSED,
    STARTED
}

export class SimStatusControls extends React.Component<any, any> {
    private simId: string;

    constructor(props: any) {
        super(props);


        this.state = {
            status: Status.PAUSED,
            simId: props.simId
        }
    }

    public render() {
        return (
            <div className="pt-button-group pt-large pt-fill">
                {this.getStatusButton()}
                <Button iconName="refresh" intent={Intent.WARNING} onClick={this.handleResetClick}>Reset</Button>
            </div>
        );
    }

    private getStatusButton = () => {
        if (this.state.status === Status.PAUSED) {
            return <Button iconName={"play"} intent={Intent.PRIMARY} onClick={this.handleStatusClick}>Start</Button>
        } else {
            return <Button iconName={"pause"} intent={Intent.PRIMARY} onClick={this.handleStatusClick}>Pause</Button>
        }
    }

    private handleStatusClick = () => {
        switch (this.state.status) {
            case Status.PAUSED:
                Axios.put(`http://localhost:8080/simulations/${this.state.simId}/control`, {status: "start"}).then((response) => {
                    this.setState({status: Status.STARTED});
                });
                break;
            case Status.STARTED:
                Axios.put(`http://localhost:8080/simulations/${this.state.simId}/control`, {status: "pause"}).then((response) => {
                    this.setState({status: Status.PAUSED});
                });
                break;
        }
    }

    private handleResetClick = () => {
        Axios.put(`http://localhost:8080/simulations/${this.state.simId}/control`, {status: "reset"}).then((response) => {
            this.setState({status: Status.PAUSED});
        });
    }
}
