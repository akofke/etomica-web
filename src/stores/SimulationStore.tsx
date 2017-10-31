
import {SimulationRemote} from "../api/SimulationRemote";
import {action, computed, IObservableArray, observable, runInAction} from "mobx";
import {createSimulationInstance, SimulationConstructor} from "../api/SimulationsRemote";
import {History} from "history";
import uiStore from "./UIStore";
import {Intent} from "@blueprintjs/core";
import {MeterRemote} from "../api/MeterRemote";
import {DataStream} from "../models/DataStream";
import {ObservableArray} from "mobx/lib/types/observablearray";

export class SimulationStore {
    @observable.ref public sim?: SimulationInstance;

    @observable public isCreating: boolean = false;

    @action public createAndLinkInstance(constructor: SimulationConstructor, history: History) {
        this.isCreating = true;
        createSimulationInstance(constructor).then((response) => {
            this.loadInstance(response.data);
            runInAction(() => {
                this.isCreating = false;
                history.push(`/view/${this.sim.simId}`);
            });
        }).catch((reason) => {
            runInAction(() => this.isCreating = false);
            console.log(reason);
            uiStore.toaster.show({
                intent: Intent.DANGER,
                message: "Error creating simulation. You may have to pick a different one"
            });
        });
    }

    @action public loadInstance(simId: string) {
        if (!this.sim || this.sim.simId !== simId) {
            this.sim = new SimulationInstance(simId);
            this.sim.fetchModel();
        }
    }
}

export const simulationStore = new SimulationStore();

export type LoadingStatus = "loading" | "notfound" | "error" | "done";
export type ControlStatus = "running" | "paused";

export class SimulationInstance {
    public readonly simId: string;
    public readonly simRemote: SimulationRemote;

    @observable public loadingStatus: LoadingStatus = "loading";
    @observable.ref public rawModel: {[id: number]: any};
    @observable public status: ControlStatus = "paused";
    @observable public isSyncing: boolean = false;

    public dataStreams: IObservableArray<DataStream> = observable([]);

    constructor(simId: string) {
        this.simId = simId;
        this.simRemote = new SimulationRemote(simId);
    }

    @action public toggle() {
        if(this.status === "paused") {
            this.start();
        } else {
            this.pause();
        }
    }

    @action public start() {
        if(this.status === "paused") {
            this.isSyncing = true;
            this.simRemote.start().then((res) => {
                runInAction(() => {
                    this.isSyncing = false;
                    this.status = "running";
                });
            }).catch((reason) => {
                console.log(reason);
                runInAction(() => {
                    this.isSyncing = false;
                    this.status = "paused";
                });
            });
        }
    }

    @action public pause() {
        if(this.status === "running") {
            this.isSyncing = true;
            this.simRemote.pause().then((res) => {
                runInAction(() => {
                    this.isSyncing = false;
                    this.status = "paused";
                });
            }).catch((reason) => {
                console.log(reason);
                runInAction(() => {
                    this.isSyncing = false;
                    this.status = "running";
                });
            });
        }
    }

    @action public fetchModel() {
        this.loadingStatus = "loading";
        this.simRemote.fetchModel().then((res) => {
            runInAction(() => {
                this.rawModel = res.data;
                treeifyModel(this.rawModel);
                this.loadingStatus = "done";
            });
        }).catch((err) => {
            console.log(err);
            if(err.response.status === 404) {
                runInAction(() => this.loadingStatus = "notfound");
            } else {
                runInAction(() => this.loadingStatus = "error");
            }
        });
    }

    @action public fetchDataStreams() {
        this.simRemote.fetchDataStreams().then((res) => {
            runInAction(() => {
                this.dataStreams.replace(res.data.map((dataId: string) => {
                    return new DataStream(dataId, this);
                }));

                this.dataStreams.forEach((dataStream) => dataStream.fetchDataInfo());
            });
        });
    }

    @action public setModel(newRawModel: any) {
        this.rawModel = newRawModel;
        treeifyModel(this.rawModel);
    }

    @computed get model(): any {
        return this.rawModel[0];
    }

}

const treeifyModel = (model: any) => {
    Object.keys(model).map((k) => model[k]).forEach((properties) => {
        Object.keys(properties).forEach((propName) => {
            if (propName.charAt(0) === "#") {
                if (Array.isArray(properties[propName])) {
                    properties[propName].forEach((item: any, i: number, arr: any) => {
                        properties[propName][i] = model[properties[propName][i]];
                    });
                } else {
                    properties[propName] = model[properties[propName]];
                }
            }
        });
    });
};
