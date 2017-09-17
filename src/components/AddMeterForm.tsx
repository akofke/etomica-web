import * as React from "react";
import {Button, Classes, Intent, MenuItem, NonIdealState, Spinner} from "@blueprintjs/core";
import {Select, ISelectItemRendererProps} from "@blueprintjs/labs";
import {getAvailableMeters} from "../api/SimulationModel";

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

const MeterSelect = Select.ofType<IConstructionInfo>();

export class AddMeterForm extends React.Component<any, any> {
    private simId: any;

    constructor(props: any) {
        super();
        this.simId = props.simId;
        this.state = {
            loading: true,
        };
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
        if(this.state.loading) {
            return (
                <NonIdealState
                    className={"sim-view-container"}
                    title={"Loading Simulation..."}
                    visual={<Spinner className="pt-large" intent={Intent.PRIMARY}/>}
                />
            );
        } else {
            return (
                <MeterSelect
                    items={this.state.meterInfos}
                    itemRenderer={this.renderMeterMenuItem}
                    onItemSelect={this.update}
                    itemPredicate={this.filter}
                    popoverProps={{popoverClassName: "popover-menu"}}
                >
                    <Button text={this.state.meterInfos[0].className} rightIconName={"double-caret-vertical"}/>
                </MeterSelect>

            );
        }
    }

    private renderMeterMenuItem = (props: ISelectItemRendererProps<IConstructionInfo>) => (
        <MenuItem
            className={props.isActive ? Classes.ACTIVE : ""}
            key={props.item.className}
            text={props.item.className}
            onClick={props.handleClick}
        />
    )

    private update = () => {};

    private filter(query: string, meter: IConstructionInfo, index: number) {
        return meter.className.indexOf(query) >= 0;
    }

}
