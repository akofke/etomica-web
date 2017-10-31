import * as React from "react";
import * as c3 from "c3";
import {DataStream} from "../../../models/DataStream";
import {observer} from "mobx-react";
import {autorun, observable} from "mobx";
import {Button} from "@blueprintjs/core";

interface IMeterGraphProps {
    dataStream: DataStream;
}

@observer
export class DataDisplayGraph extends React.Component<IMeterGraphProps, any> {
    @observable private chartType: "line" | "bar" = "line";
    constructor(props: IMeterGraphProps) {
        super(props);
    }

    public componentDidMount() {
        const chart = c3.generate({
            bindto: `#meter-chart-${this.props.dataStream.dataId}`,
            size: {
                width: 800
            },
            data: {
                x: "x",
                columns: [
                    ["x", ...this.props.dataStream.initialDataInfo.independentData],
                    [this.props.dataStream.initialDataInfo.label],
                ],
            },
            transition: {
                duration: 0
            },
            axis: {
                x: {
                    label: this.props.dataStream.initialDataInfo.independentDataInfo.label,
                    tick: {
                        format: (x: number) => x.toFixed(3)
                    }
                },
                y: {
                    tick: {
                        format: (y) => y.toFixed(3)
                    }
                }
            }
        });

        // window.addEventListener("resize", () => chart.resize());

        autorun("update graph", () => {
            if(this.props.dataStream.currentData) {
                chart.load({
                    columns: [
                        ["x", ...this.props.dataStream.currentData.dataInfo.independentData],
                        [this.props.dataStream.initialDataInfo.label, ...this.props.dataStream.currentData.data]

                    ]
                });
            }
        });

        autorun("change chart type", () => {
            chart.transform(this.chartType);
        });

    }

    public render() {
        return(
            [
                <div key={"controls"} className="pt-button-group Data-chart-controls">
                    <Button iconName={"timeline-line-chart"} active={this.chartType === "line"} onClick={() => this.chartType = "line"}/>
                    <Button iconName={"timeline-bar-chart"} active={this.chartType === "bar"} onClick={() => this.chartType = "bar"}/>
                </div>,
                <div key={"chart"} className="Data-chart" id={`meter-chart-${this.props.dataStream.dataId}`}/>
            ]
        );
    }
}
