import * as React from "react";
import Axios from "axios";
import {SimulationIndexList} from "./SimulationIndexList";
import {Intent, NonIdealState, Spinner} from "@blueprintjs/core";

export class SimulationIndexView extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            loaded: false,
        };
    }

    componentDidMount() {
        Axios.get(`http://localhost:8080/simulations`).then((res) => {
            this.setState({data: res.data, loaded: true});
        });
    }

    render() {
        if (!this.state.loaded) {
            return (
                <NonIdealState
                    className={"sim-view-container"}
                    title={"Loading Available Simulations..."}
                    visual={<Spinner className="pt-large" intent={Intent.PRIMARY}/>}
                />
            );
        } else {
            return <SimulationIndexList simClassInfo={this.state.data}/>;
        }
    }
}
