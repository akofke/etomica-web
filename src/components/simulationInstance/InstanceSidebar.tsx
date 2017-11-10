import * as React from "react";
import {SimStatusControls} from "../SimStatusControls";
import {simulationStore} from "../../stores/SimulationStore";
import {PropertyControlList} from "./properties/PropertyControlList";

export class InstanceSidebar extends React.Component<any, any> {

    public render() {
        return (
            <aside className="Instance-sidebar">
                <div className="pt-card pt-elevation-1 Instance-sidebar-box">
                    <h6 className="pt-text-muted">
                        {simulationStore.sim.classInfo.className.split(".").slice(0, -1).join(".")}
                    </h6>
                    <h4>
                        {simulationStore.sim.classInfo.className.split(".").pop()}
                    </h4>
                    <SimStatusControls/>
                    <PropertyControlList/>
                </div>
            </aside>
        );
    }
}
