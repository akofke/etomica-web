
import {SimulationRemote} from "../api/SimulationRemote";

export class SimulationInstanceStore {
    public readonly simId: string;
    public readonly simRemote: SimulationRemote;

    constructor(simId: string) {
        this.simId = simId;
        this.simRemote = new SimulationRemote(simId);
    }

}
