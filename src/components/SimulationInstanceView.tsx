import * as React from "react";
import {fetchModel, treeifyModel} from "../api/SimulationModel";
import {Intent, NonIdealState, Spinner} from "@blueprintjs/core";
import {ConfigurationViewer} from "./ConfigurationViewer";
import {SimStatusControls} from "./SimStatusControls";
import {WidthProvider} from "react-grid-layout";
import * as ReactGridLayout from "react-grid-layout";

const GridLayout = WidthProvider(ReactGridLayout);

export class SimulationInstanceView extends React.Component<any, any> {
    private simId: string;
    private modelTree: any;
    private layout: any[];
    private configViewerComponent: ConfigurationViewer;

    constructor(props: any) {
        super(props);
        const { match } = props;
        this.simId = match.params.simId;

        this.state = {
            loading: true,
        };

        this.layout = [
            {i: "config-viewer", x: 0, y: 0, w: 6, h: 6},
            {i: "test", x: 7, y: 0, w: 2, h: 2}
        ]
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
                <GridLayout className="sim-view-container" layout={this.layout} rowHeight={30} cols={12} onResize={() => this.configViewerComponent.resize()}>
                    <div key={"config-viewer"}>
                        <ConfigurationViewer modelTree={this.modelTree} id={this.simId} ref={(viewer: any) => this.configViewerComponent = viewer}/>
                    </div>
                    <div key={"test"}>Test</div>
                </GridLayout>
            );
        }
    }




}
