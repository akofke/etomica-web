import * as React from "react";
import {observable, runInAction} from "mobx";
import {Button, Intent, NonIdealState, Spinner} from "@blueprintjs/core";
import {SimClassInfo} from "../simulationIndex/SimulationIndexView";
import {Link} from "react-router-dom";
import {getInstances} from "../../api/SimulationsRemote";
import {observer} from "mobx-react";

import "./InstancesList.css";

interface SimInstanceInfo {
    id: string;
    classInfo: SimClassInfo;
}

@observer
export class InstancesList extends React.Component<any, any> {
    @observable private loadedInstances: boolean = false;
    @observable.ref private instances: SimInstanceInfo[] = [];

    public componentDidMount() {
        this.loadedInstances = false;
        getInstances().then((res) => {
            runInAction(() => {
                this.instances = res.data;
                this.loadedInstances = true;
            });
        });
    }

    public render() {
        if(!this.loadedInstances) {
            return <NonIdealState visual={<Spinner intent={Intent.PRIMARY}/>}/>;
        } else {
            return (
                <div>
                    {getInstanceItems(this.instances)}
                </div>
            );
        }
    }
}

const getInstanceItems = (instances: SimInstanceInfo[]) => {
    return instances.map((instance) => {
        return (
            <div className="InstanceList-item">
                <div>
                    <Link to={`/view/${instance.id}`}>
                        <Button intent={Intent.SUCCESS} text={"Open"}/>
                    </Link>
                </div>
                <div>
                    <h5>{instance.classInfo.className}</h5>
                </div>
            </div>
        );
    });
};
