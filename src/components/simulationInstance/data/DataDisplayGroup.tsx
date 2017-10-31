import * as React from "react";
import {IDataDisplayProps} from "./DataGraphsView";
import {observer} from "mobx-react";

@observer
export class DataDisplayGroup extends React.Component<IDataDisplayProps, any> {

    constructor(props: IDataDisplayProps) {
        super(props);
    }

    public render() {
        return (
            <table className="pt-table pt-bordered">
                <thead>
                <tr>
                    {this.getTableHeaders()}
                </tr>
                </thead>
                <tbody>
                <tr>
                    {this.getTableData()}
                </tr>
                </tbody>

            </table>
        );
    }

    private getTableHeaders = () => {
        return(
            this.props.dataStream.initialDataInfo.subDataInfo.map((subDataInfo: any) => {
                return <th key={subDataInfo.label}>{subDataInfo.label}</th>;
            })
        );
    }

    private getTableData = () => {
        if(this.props.dataStream.currentData) {
            return (this.props.dataStream.currentData.data.map((data: any) => {
                return <td><samp>{data.toFixed(7)}</samp></td>;
            }));
        } else {
            return (
                this.props.dataStream.initialDataInfo.subDataInfo.map(() => {
                    return <td></td>;
                })
            );
        }
    }
}

