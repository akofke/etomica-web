
import {MeterRemote} from "../api/MeterRemote";
import {SimulationInstance} from "../stores/SimulationStore";
import {action, computed, observable, runInAction} from "mobx";

export class DataStream {
    @observable public loaded = false;
    public readonly dataId: string;
    public readonly remote: MeterRemote;
    public readonly sim: SimulationInstance;

    @observable.ref public initialDataInfo: any;
    @observable.ref public currentData: any;

    constructor(dataId: string, sim: SimulationInstance) {
        this.dataId = dataId;
        this.sim = sim;
        this.remote = new MeterRemote(dataId, sim.simRemote);

        this.remote.socket.addEventListener("message", (message) => {
            this.updateData(JSON.parse(message.data));
        });
    }

    @action public updateData(newData: any) {
        this.currentData = newData;
    }

    @action public fetchDataInfo() {
        this.loaded = false;
        this.remote.fetchDataInfo().then((res) => {
            runInAction(() => {
                console.log(res);
                this.initialDataInfo = res.data;
                this.loaded = true;
            });
        });
    }

    @computed get isDataGroup() {
        return this.initialDataInfo.hasOwnProperty("subDataInfo");
    }

    @computed get isDataFunction() {
        return this.initialDataInfo.hasOwnProperty("independentData");
    }
}
