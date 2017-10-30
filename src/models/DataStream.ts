
import {MeterRemote} from "../api/MeterRemote";
import {SimulationInstance} from "../stores/SimulationStore";

export class DataStream {
    public readonly dataId: string;
    public readonly remote: MeterRemote;
    public readonly sim: SimulationInstance;

    constructor(dataId: string, sim: SimulationInstance) {
        this.dataId = dataId;
        this.sim = sim;
        this.remote = new MeterRemote(dataId, sim.simRemote);

    }
}
