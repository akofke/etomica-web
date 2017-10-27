import * as React from "react";
import Axios from "axios";
import {Intent, NonIdealState, Spinner} from "@blueprintjs/core";
import {SimulationIndexTree} from "./SimulationIndexTree";
import {SimInfoCard} from "./SimInfoCard";
import { simulationIndexStore } from "../../stores/SimulationIndexStore";

import "./SimulationIndex.css";
import { observer } from "mobx-react";

export interface SimClassInfo {
    className: string;
    javadoc: string;
}

export interface PackageHierarchy {
    subpackages: { [packageName: string]: PackageHierarchy };
    classes: SimClassInfo[];
}

@observer
export class SimulationIndexView extends React.Component<any, any> {

    public componentDidMount() {
        simulationIndexStore.fetchSimulations();
    }

    public render() {
        if (!simulationIndexStore.loadedClasses) {
            return (
                <NonIdealState
                    title={"Loading Available Simulations..."}
                    visual={<Spinner className="pt-large" intent={Intent.PRIMARY}/>}
                />
            );
        } else {
            return (
                <div className="sim-index-container">
                    <div className="pt-card pt-elevation-1 sim-index-tree">
                        <div className="pt-input-group sim-search">
                            <span className="pt-icon pt-icon-search"/>
                            <input
                                type="search"
                                className="pt-input"
                                placeholder="Filter simulations"
                                value={simulationIndexStore.searchQuery}
                                onChange={this.handleSearchChange}
                            />
                        </div>
                        <SimulationIndexTree
                            searchResults={simulationIndexStore.searchResults}
                            classTree={simulationIndexStore.simPackageHierarchy}
                            onSelect={this.handleSelect}
                        />
                    </div>

                    <SimInfoCard simInfo={simulationIndexStore.selectedClass}/>
                </div>
            );
        }
    }

    private handleSearchChange = (event: React.FormEvent<any>) => {
        const value: string = event.currentTarget.value;
        simulationIndexStore.setSearchQuery(value);
    }

    private handleSelect = (selected: SimClassInfo) => {
        simulationIndexStore.selectedClass = selected;
    }

}
