import * as React from "react";

interface SimulationIndexListProps {
    classNames: string[];
}

export const SimulationIndexList = (props: SimulationIndexListProps) => (
    <div className="sim-class-card-list">{cardList(props.classNames)}</div>
);

const cardList = (classNames: string[]) => (
    classNames.map((className) => (
        <div className="pt-card pt-elevation-1 pt-interactive sim-class-card">
            <h5>{className}</h5>
        </div>
    ))
);
