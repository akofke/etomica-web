import * as React from "react";
import * as c3 from "c3";
import {DataStream} from "../../../models/DataStream";

interface IMeterGraphProps {
    dataStream: DataStream;
}

export class DataGraph extends React.Component<IMeterGraphProps, any> {
    constructor(props: IMeterGraphProps) {
        super(props);
    }

    public componentDidMount() {
        const chart = c3.generate({
            bindto: `#meter-chart-${this.props.dataStream.dataId}`,
            data: {
                columns: [
                    ["data1"],
                ],
            },
            transition: {
                duration: 0
            },
            axis: {
                y: {
                    tick: {
                        format: (y) => y.toFixed(3)
                    }
                }
            }
        });

        this.props.dataStream.remote.socket.addEventListener("message", (event) => {
            console.log("wat");
            console.log(event);
            // chart.flow({
            //     columns: [
            //         ["data1", event.data],
            //     ],
            //     duration: 0,
            //     length: 0,
            // });
        });
    }

    public render() {
        return(
            <div className="meter-chart" id={`meter-chart-${this.props.dataStream.dataId}`}/>
        );
    }
}
