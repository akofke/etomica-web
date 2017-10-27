import * as React from "react";
import {FormEvent} from "react";
import {Button, Classes, MenuItem, Switch} from "@blueprintjs/core";
import {ISelectItemRendererProps, Select} from "@blueprintjs/labs";

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
        [propName: string]: string | number;
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
            <div>
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
                {this.renderForm()}
            </div>
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

    private renderForm = () => {
        if (this.state.selectedMeter) {
            return (
                <form onSubmit={this.handleSubmit} className="meter-form">
                    <h5>Constructor Parameters</h5>
                    {this.renderConstructorParamsInputs()}

                    <h5>Properties</h5>
                    {this.renderPropertiesInputs()}

                    <input type="submit" value="Submit" className="pt-button pt-intent-success"/>
                </form>
            );
        }
    }

    private renderConstructorParamsInputs = () => (
        this.state.selectedMeter.constructorParamTypes.map((paramClass, paramIdx) => (
            <label className="pt-label">
                {paramClass}
                <div className="pt-select">
                    <select name={paramIdx.toString()} onChange={this.onParamsChange}>
                        {this.state.selectedMeter.classOptions[paramClass].map((id, idx) => (
                            <option value={id}>{this.props.model[id].class}</option>
                        ))}
                    </select>
                </div>
            </label>
        ))
    )

    private renderPropertiesInputs = () => (
        Object.keys(this.state.selectedMeter.propertyTypes).map((propName) => (
            <label className="pt-label">
                {propName}
                {this.getPropertyField(propName)}
            </label>
        ))
    )

    private getPropertyField = (propName: string) => {
        const propClass = this.state.selectedMeter.propertyTypes[propName];
        if(this.state.selectedMeter.classOptions.hasOwnProperty(propClass)) {
            return (
                <div className="pt-select">
                    <select name={propName} onChange={this.onPropertiesChange}>
                        {this.state.selectedMeter.classOptions[propClass].map((id) => (
                            <option value={id}>{this.props.model[id].class}</option>
                        ))}
                    </select>
                </div>
            );
        } else if(propClass === "java.lang.String") {
            return (<input className="pt-input" type="input" name={propName} onChange={this.onPropertiesChange}/>);
        } else if(propClass.match(/int|.*Integer/)) {
            return (<input className="pt-input" type="input" name={propName} onChange={this.onPropertiesChange}/>);
        } else if(propClass.match(/double|.*Double|float|.*Float/)) {
            return (<input className="pt-input" type="input" name={propName} onChange={this.onPropertiesChange}/>);
        } else if(propClass.match(/boolean|.*Boolean/)) {
            return (<Switch defaultChecked={false} onChange={this.onPropertiesChange}/>)
        }

    }



    private updateSelectedMeter = (selectedMeter: IConstructionInfo) => {
        const newMeterParams: IConstructionParams = {
            className: selectedMeter.className,
            constructorParams: selectedMeter.constructorParamTypes.map((paramClass) => (
                selectedMeter.classOptions[paramClass][0])
            ),
            paramsMap: {},
        };

        Object.keys(selectedMeter.propertyTypes).forEach((propName) => {
            if(selectedMeter.classOptions.hasOwnProperty(selectedMeter.propertyTypes[propName])) {
                newMeterParams.paramsMap[propName] = selectedMeter.classOptions[selectedMeter.propertyTypes[propName]][0];
            }
        });

        this.setState({
            selectedMeter,
            meterParams: newMeterParams
        });
    }

    private handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.onSubmit(this.state.meterParams);
    }

    private onParamsChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const newParams = {...this.state.meterParams};
        newParams.constructorParams[Number(event.currentTarget.name)] = Number(event.currentTarget.value);
        this.setState({
            meterParams: newParams,
        });
    }

    private onPropertiesChange = (event: React.FormEvent<any>) => {
        const newParams = {...this.state.meterParams};
        newParams.paramsMap[event.currentTarget.name] = event.currentTarget.value;
        console.log(event);
        this.setState({
            meterParams: newParams,
        });
    }

    private static filter(query: string, meter: IConstructionInfo) {
        return meter.className.indexOf(query) >= 0;
    }

}
