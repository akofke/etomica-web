
import {action, observable, runInAction} from "mobx";
import {SimulationInstance} from "../stores/SimulationStore";
import {SimulationRemote} from "../api/SimulationRemote";

export interface IPropertyUpdate {
    id: number;
    property: string;
    newValue: any;
}

export class PropertyControl {
    public readonly modelId: number;
    public readonly propertyName: string;
    public readonly propertyType: string;
    @observable public currentValue: any;

    private readonly remote: SimulationRemote;

    constructor(modelId: number, propertyName: string, currentValue: any, sim: SimulationInstance) {
        this.modelId = modelId;
        this.propertyName = propertyName;
        this.currentValue = currentValue;
        this.propertyType = typeof currentValue;
        this.remote = sim.simRemote;
    }

    @action public updateValue(value: any) {
        const update: IPropertyUpdate = {
            id: this.modelId,
            property: this.propertyName.substring(1),
            newValue: value
        };
        this.remote.updateProperty(update).then((res) => {
            runInAction(() => {
                this.currentValue = value;
            });
        }).catch((err) => {
            console.log(err);
        });
    }

}
