import * as React from "react";
import {SimStatusControls} from "../SimStatusControls";

export class InstanceSidebar extends React.Component<any, any> {

    public render() {
        return (
            <aside className="Instance-sidebar">
                <div className="pt-card pt-elevation-1 Instance-sidebar-box">
                    <SimStatusControls/>
                </div>
            </aside>
        );
    }
}
