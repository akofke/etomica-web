import * as React from "react";
import Axios from "axios";
import {SimulationIndexList} from "./SimulationIndexList";
import {Spinner} from "@blueprintjs/core";

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
            return <Spinner/>;
        } else {
            return <SimulationIndexList classNames={this.state.data}/>;
        }
    }
}
