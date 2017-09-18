import * as React from "react";
import {Button, Classes, Intent, MenuItem, NonIdealState, Spinner} from "@blueprintjs/core";
import {Select, ISelectItemRendererProps} from "@blueprintjs/labs";
import {getAvailableMeters} from "../api/SimulationModel";
import {FormEvent} from "react";

export interface IConstructionInfo {
    className: string;
    classOptions: {
        [className: string]: [number];
    };
    constructorParamTypes: [string];
    propertyTypes: {
        [propName: string]: string;
    };
}

export interface IConstructionParams {
    className: string;
    constructorParams: number[];
    paramsMap: {
        [propName: string]: string;
    };
}

interface IMeterFormProps {
    onSubmit: (params: IConstructionParams) => void;
    model: any;
    meters: IConstructionInfo[];
}

interface IMeterFormState {
    selectedMeter: IConstructionInfo;
    meterParams: IConstructionParams;
}

const MeterSelect = Select.ofType<IConstructionInfo>();

export class AddMeterForm extends React.Component<IMeterFormProps, IMeterFormState> {

    constructor(props: IMeterFormProps) {
        super(props);
        this.state = {
            selectedMeter: null,
            meterParams: {
                className: "",
                constructorParams: [],
                paramsMap: {},
            }
        }
    }


    public render() {
        return (
            <MeterSelect
                items={this.props.meters}
                itemRenderer={this.renderMeterMenuItem}
                onItemSelect={this.updateSelectedMeter}
                itemPredicate={AddMeterForm.filter}
                popoverProps={{popoverClassName: "popover-menu"}}
            >
                <Button
                    text={this.state.selectedMeter ? this.state.selectedMeter.className : "Select a meter"}
                    rightIconName={"double-caret-vertical"}
                />
            </MeterSelect>

        );
    }

    private renderMeterMenuItem = (props: ISelectItemRendererProps<IConstructionInfo>) => (
        <MenuItem
            className={props.isActive ? Classes.ACTIVE : ""}
            key={props.item.className}
            text={props.item.className}
            onClick={props.handleClick}
        />
    )

    private renderForm = () => (
        <form onSubmit={this.handleSubmit}>

        </form>
    )

    private updateSelectedMeter = (selectedMeter: IConstructionInfo) => {
        this.setState({
            selectedMeter,
            meterParams: {
                className: selectedMeter.className,
                constructorParams: [],
                paramsMap: {},
            },
        });
    }

    private handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.onSubmit(this.state.meterParams);
    }

    private static filter(query: string, meter: IConstructionInfo, index: number) {
        return meter.className.indexOf(query) >= 0;
    }

}
