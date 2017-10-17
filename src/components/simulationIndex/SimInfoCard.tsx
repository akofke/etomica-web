import * as React from "react";
import {SimClassInfo} from "./SimulationIndexView";
import {Link} from "react-router-dom";
import {Button, Intent, NonIdealState} from "@blueprintjs/core";

interface ISimInfoProps {
    simInfo?: SimClassInfo;
}

export const SimInfoCard = (props: ISimInfoProps) => {
    if (props.simInfo) {
        return (
            <div className="pt-card pt-elevation-1 sim-info-card">
                <h3 style={{marginBottom: "2rem"}}>{props.simInfo.className}</h3>
                <p dangerouslySetInnerHTML={javadocHTML(props.simInfo.javadoc)}/>
                <Link to={`/create/${props.simInfo.className}`}>
                    <Button intent={Intent.SUCCESS} text="Create Simulation"/>
                </Link>
            </div>
        );
    } else {
        return (
            <div className="pt-card pt-elevation-1 sim-info-card">
                <NonIdealState description={"Select a simulation class to view details"}/>
            </div>
        );
    }
};

const javadocHTML = (javadoc: string) => ({
    __html: javadoc
});

