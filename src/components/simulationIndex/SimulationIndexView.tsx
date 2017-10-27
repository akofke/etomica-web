import * as React from "react";
import Axios from "axios";
import {Intent, NonIdealState, Spinner} from "@blueprintjs/core";
import {SimulationIndexTree} from "./SimulationIndexTree";
import {SimInfoCard} from "./SimInfoCard";

import "./SimulationIndex.css";

export interface SimClassInfo {
    className: string;
    javadoc: string;
}

export interface PackageHierarchy {
    subpackages: { [packageName: string]: PackageHierarchy };
    classes: SimClassInfo[];
}

interface ISimulationIndexViewState {
    loaded: boolean;
    classInfos: SimClassInfo[];
    searchResults: string[];
    searchValue: string;
    selectedSim?: SimClassInfo;
}

export class SimulationIndexView extends React.Component<any, ISimulationIndexViewState> {

    constructor() {
        super();
        this.state = {
            loaded: false,
            classInfos: [],
            searchResults: [],
            searchValue: ""
        };
    }

    public componentDidMount() {
        Axios.get(`http://localhost:8080/simulations`).then((res) => {
            this.setState({classInfos: res.data, loaded: true});
        });
    }

    public render() {
        if (!this.state.loaded) {
            return (
                <NonIdealState
                    title={"Loading Available Simulations..."}
                    visual={<Spinner className="pt-large" intent={Intent.PRIMARY}/>}
                />
            );
        } else {
            const classInfos = this.state.classInfos;
            const classes: PackageHierarchy = {subpackages: {}, classes: []};
            classInfos.forEach((classInfo) => {
                const classNameComponents = classInfo.className.split(".");
                addToPackageHierarchy(classes, classNameComponents.slice(0, -1), classInfo);
            });
            console.log(classes);
            return (
                <div className="sim-index-container">
                    <div className="pt-card pt-elevation-1 sim-index-tree">
                        <div className="pt-input-group sim-search">
                            <span className="pt-icon pt-icon-search"/>
                            <input type="search" className="pt-input" placeholder="Filter simulations"
                                   onChange={this.handleSearchChange}/>
                        </div>
                        <SimulationIndexTree
                            classTree={classes}
                            searchResults={this.state.searchResults}
                            onSelect={this.handleSelect}
                        />
                    </div>

                    <SimInfoCard simInfo={this.state.selectedSim}/>
                </div>
            );
        }
    }

    private handleSearchChange = (event: React.FormEvent<any>) => {
        const value: string = event.currentTarget.value;
        const results: string[] = value.length < 3 ? [] :
            this.state.classInfos.filter(
                (classInfo) => classInfo.className.indexOf(value) > -1 || classInfo.javadoc.indexOf(value) > -1
            ).map((classInfo) => classInfo.className);

        this.setState({
            searchValue: value,
            searchResults: results
        });
    };

    private handleSelect = (selected: SimClassInfo) => {
        this.setState({
            selectedSim: selected
        });
    }

}

const addToPackageHierarchy = (hierarchy: PackageHierarchy, packagePath: string[], classInfo: SimClassInfo) => {
    const lastKeyIndex = packagePath.length;
    for (let i = 0; i < lastKeyIndex; ++i) {
        const key = packagePath[i];
        if (!(key in hierarchy.subpackages)) {
            hierarchy.subpackages[key] = {subpackages: {}, classes: []};
        }
        hierarchy = hierarchy.subpackages[key];
    }

    hierarchy.classes.push(classInfo);
};
