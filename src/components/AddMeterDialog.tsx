import * as React from "react";
import {Button, Dialog} from "@blueprintjs/core";
import {AddMeterForm, IConstructionInfo, IConstructionParams} from "./AddMeterForm";
import {getAvailableMeters} from "../api/SimulationModel";

interface IMeterDialogState {
    isOpen: boolean;
    meterInfos?: IConstructionInfo[];
    loading: boolean;
}

interface IMeterDialogProps {
    onSubmit: (constructionParams: IConstructionParams) => void;
    simId: string;
    model: any;
}

export class AddMeterDialog extends React.Component<IMeterDialogProps, IMeterDialogState> {
    private simId: string;

    constructor(props: IMeterDialogProps) {
        super(props);
        this.state = {
            isOpen: false,
            loading: true,
        };
        this.simId = props.simId;
    }

    public componentDidMount() {
        getAvailableMeters(this.simId).then((resp) => {
            this.setState({
                meterInfos: resp.data as IConstructionInfo[],
                loading: false,
            });

            console.log(this.state.meterInfos);
        });
    }

    public render() {
        return (
            <div>
                <Button onClick={this.toggleDialog} text={"Add Meter"}/>
                <Dialog
                    isOpen={this.state.isOpen}
                    onClose={this.toggleDialog}
                    title={"Create Meter"}
                >
                    <div className="pt-dialog-body">
                        <AddMeterForm
                            meters={this.state.meterInfos}
                            model={this.props.model}
                            onSubmit={this.onSubmit}
                        />
                    </div>

                </Dialog>
            </div>
        );
    }

    private onSubmit = (params: IConstructionParams) => {
        this.toggleDialog();
        this.props.onSubmit(params);
    }

    private toggleDialog = () => this.setState({isOpen: !this.state.isOpen});
}
