import * as React from "react";
import {addMeter, fetchModel, treeifyModel} from "../../api/SimulationModel";
import {Intent, NonIdealState, Spinner, Tab2, Tabs2} from "@blueprintjs/core";
import {ConfigurationView} from "./configuration/ConfigurationView";
import {IConstructionParams} from "../AddMeterForm";
import {AddMeterDialog} from "../AddMeterDialog";
import {TreeModelView} from "../TreeModelView";
import {InstanceSidebar} from "./InstanceSidebar";

import "./SimulationInstance.css";
import {simulationStore} from "../../stores/SimulationStore";
import {DataGraphsView} from "./data/DataGraphsView";


export class SimulationInstanceView extends React.Component<any, any> {
    private readonly sim = simulationStore.sim;

    public componentDidMount() {
        this.sim.fetchDataStreams();
    }

    public render() {
            return (
                <div className="Instance-container">
                    <InstanceSidebar/>
                    <main className="Instance-main">
                        <Tabs2
                            id="Instance-tabs"
                        >
                            <Tab2 id="configuration" title="Configuration" panel={<ConfigurationView />}/>

                            <Tab2 id="meters" title="Meters" panel={<DataGraphsView/>}/>

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

    // private renderMeterGraphs = () => (
    //     this.state.meterIds.map((meterId) => (
    //         <div key={`meter-graph-${meterId}`}
    //              data-grid={{x: 0, y: Infinity, w: 6, h: 2}}>
    //             <MeterGraph simId={this.simId} meterId={meterId}/>
    //         </div>
    //     ))
    // );
    //
    //
    // private createMeter = (params: IConstructionParams) => {
    //     console.log(params);
    //     addMeter(params, this.simId).then((response) => {
    //         console.log(response.data);
    //         this.setState((prevState) => ({
    //             meterIds: [...prevState.meterIds, response.data],
    //         }));
    //     });
    // }


}
