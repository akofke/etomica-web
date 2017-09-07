import * as React from "react";
import {Link} from "react-router-dom";

interface SimulationIndexListProps {
    simClassInfo: any[];
}

export const SimulationIndexList = (props: SimulationIndexListProps) => (
    <div className="sim-class-card-list">{cardList(props.simClassInfo)}</div>
);

const cardList = (simClassInfo: any[]) => (
    simClassInfo.map((classInfo) => (
        <Link to={`/create/${classInfo.className}`}>
            <div className="pt-card pt-interactive sim-class-card">
                <h6>{classInfo.className}</h6>
                <p dangerouslySetInnerHTML={javadocHTML(classInfo.javadoc)}></p>
            </div>
        </Link>
    ))
);

const javadocHTML = (javadoc: string) => {
    return {__html: javadoc};
}
