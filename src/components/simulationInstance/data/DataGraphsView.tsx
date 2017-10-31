import * as React from "react";
import {observer} from "mobx-react";
import {simulationStore} from "../../../stores/SimulationStore";
import {DataStream} from "../../../models/DataStream";
import {DataDisplayGroup} from "./DataDisplayGroup";
import {NonIdealState} from "@blueprintjs/core";

import "./DataDisplay.css";
import {DataDisplayGraph} from "./DataDisplayGraph";

export interface IDataDisplayProps {
    dataStream: DataStream;
}

export const DataGraphsView = observer(() => {
    return (
        <div id={"Data-container"}>
            {getGraphs()}
        </div>
    );
});

const getGraphs = () => {
    return simulationStore.sim.dataStreams.map((dataStream) => {
        return (
            <div className="pt-card Data-display" key={dataStream.dataId}>
                {getDisplayComponent(dataStream)}
            </div>
        );
    });
};

const getDisplayComponent = (dataStream: DataStream) => {
    console.log(dataStream);
    if (!dataStream.loaded) {
        return <NonIdealState title={"Loading..."}/>;
    } else if (dataStream.isDataGroup) {
        return <DataDisplayGroup dataStream={dataStream}/>;
    } else if(dataStream.isDataFunction) {
        return <DataDisplayGraph dataStream={dataStream}/>;
    }
};
