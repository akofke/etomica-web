import * as React from "react";
import {observer} from "mobx-react";
import {simulationStore} from "../../../stores/SimulationStore";
import {DataGraph} from "./DataGraph";

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
            <div className="pt-card" key={dataStream.dataId}>
                <DataGraph dataStream={dataStream}/>
            </div>
        );
    });
};
