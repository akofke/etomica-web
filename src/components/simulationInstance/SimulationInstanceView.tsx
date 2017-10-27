import * as React from "react";
import {addMeter, fetchModel, treeifyModel} from "../../api/SimulationModel";
import {Intent, NonIdealState, Spinner, Tab2, Tabs2} from "@blueprintjs/core";
import {ConfigurationViewer} from "./configuration/ConfigurationView";
import * as ReactGridLayout from "react-grid-layout";
import {WidthProvider} from "react-grid-layout";
import {IConstructionParams} from "../AddMeterForm";
import {AddMeterDialog} from "../AddMeterDialog";
import {MeterGraph} from "../MeterGraph";
import {TreeModelView} from "../TreeModelView";
import {InstanceSidebar} from "./InstanceSidebar";

import "./SimulationInstance.css";

const GridLayout = WidthProvider(ReactGridLayout);

interface ISimInstanceViewState {
    loading: boolean;

    meterIds: string[];
}

export class SimulationInstanceView extends React.Component<any, ISimInstanceViewState> {
    private simId: string;
    private modelTree: any;
    private model: any;
    private layout: any[];
    private configViewerComponent: ConfigurationViewer;

    constructor(props: any) {
        super(props);
        const {match} = props;
        this.simId = match.params.simId;

        this.state = {
            loading: true,
            meterIds: [],
        };
    }

    public componentDidMount() {
        fetchModel(this.simId).then((response) => {
            const model = response.data;
            treeifyModel(model);
            console.log(model);
            this.modelTree = model[0];
            this.model = model;
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
                <div className="Instance-container">
                    <InstanceSidebar/>
                    <main className="Instance-main">
                        <Tabs2
                            id="Instance-tabs"
                        >
                            <Tab2 id="configuration" title="Configuration" panel={<ConfigurationViewer modelTree={this.modelTree} id={this.simId}
                                                                                                       ref={(viewer: any) => this.configViewerComponent = viewer}/>}/>

                            <Tab2 id="meters" title="Meters"></Tab2>

                        </Tabs2>
                    </main>
                </div>
            );
            // return (
            //     <GridLayout
            //         className="sim-view-container"
            //         layout={this.layout}
            //         rowHeight={150}
            //         cols={12}
            //         onResize={() => this.configViewerComponent.resize()}
            //         autoSize={false}
            //     >
            //         <div key={"config-viewer"}>
            //             <ConfigurationViewer modelTree={this.modelTree} id={this.simId}
            //                                  ref={(viewer: any) => this.configViewerComponent = viewer}/>
            //         </div>
            //         <div key={"form"}>
            //             <AddMeterDialog
            //                 onSubmit={this.createMeter}
            //                 simId={this.simId}
            //                 model={this.model}
            //             />
            //         </div>
            //         {this.renderMeterGraphs()}
            //         <div
            //             key={"tree"}
            //         >
            //             <TreeModelView treeModel={this.model}/>
            //
            //         </div>
            //     </GridLayout>
            // );
        }
    }

    private renderMeterGraphs = () => (
        this.state.meterIds.map((meterId) => (
            <div key={`meter-graph-${meterId}`}
                 data-grid={{x: 0, y: Infinity, w: 6, h: 2}}>
                <MeterGraph simId={this.simId} meterId={meterId}/>
            </div>
        ))
    );


    private createMeter = (params: IConstructionParams) => {
        console.log(params);
        addMeter(params, this.simId).then((response) => {
            console.log(response.data);
            this.setState((prevState) => ({
                meterIds: [...prevState.meterIds, response.data],
            }));
        });
    }


}
