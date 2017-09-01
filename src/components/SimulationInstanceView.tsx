import * as React from "react";
import {fetchModel, treeifyModel} from "../api/SimulationModel";
import {Intent, NonIdealState, Spinner} from "@blueprintjs/core";
import {ConfigurationViewer} from "./ConfigurationViewer";
import {SimStatusControls} from "./SimStatusControls";

export class SimulationInstanceView extends React.Component<any, any> {
    private simId: string;
    private modelTree: any;

    constructor(props: any) {
        super(props);
        const { match } = props;
        this.simId = match.params.simId;

        this.state = {
            loading: true,
        };
    }

    public componentDidMount() {
        fetchModel(this.simId).then((response) => {
            const model = response.data;
            treeifyModel(model);
            console.log(model);
            this.modelTree = model[0];
            this.setState({loading: false});
        });
    }

    public render() {
        if (this.state.loading) {
            return (
                <NonIdealState
                    className={"sim-view-container"}
                    title={"Loading Simulation..."}
                    visual={<Spinner className="pt-large" intent={Intent.PRIMARY}/>}
                />
            );
        } else {
            return (
                <div className="sim-view-container">
                    <ConfigurationViewer modelTree={this.modelTree} id={this.simId}/>
                </div>
            );
        }
    }




}
