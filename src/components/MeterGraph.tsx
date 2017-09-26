import * as React from "react";
import * as c3 from "c3";

interface IMeterGraphProps {
    simId: string;
    meterId: string;
}

export class MeterGraph extends React.Component<IMeterGraphProps, any> {
    constructor(props: IMeterGraphProps) {
        super(props);
    }

    public componentDidMount() {
        const chart = c3.generate({
            bindto: `#meter-chart-${this.props.meterId}`,
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

        const socket = new WebSocket(`ws://localhost:8080/simulations/${this.props.simId}/data/${this.props.meterId}`);
        socket.addEventListener("message", (event) => {
            console.log(event);
            chart.flow({
                columns: [
                    ["data1", event.data],
                ],
                duration: 0,
                length: 0,
            });
        });
    }

    public render() {
        return(
            <div className="meter-chart" id={`meter-chart-${this.props.meterId}`}/>
        );
    }
}
