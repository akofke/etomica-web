import * as React from "react";
import {Intent, NonIdealState, Spinner} from "@blueprintjs/core";
import {Redirect} from "react-router";
import {createSimulationInstance} from "../api/SimulationModel";

export class CreateSimulationInstance extends React.Component<any, any> {
    private simClassName: any;

    constructor(props: any) {
        super(props);
        const {match} = this.props;
        this.simClassName = match.params.simClassName;
        this.state = {
            loading: true,
        };
    }

    public componentDidMount() {
        createSimulationInstance(this.simClassName).then((response) => {
            console.log(response.data);
            this.setState({
                loading: false,
                simId: response.data,
            });
        });
    }

    public render() {
        if (this.state.loading) {
            return (
                <NonIdealState
                    title={"Creating Simulation..."}
                    visual={<Spinner className="pt-large" intent={Intent.PRIMARY}/>}
                />
            );
        } else {
            return (
                <Redirect to={`/view/${this.state.simId}`}/>
            );

        }
    }

}
