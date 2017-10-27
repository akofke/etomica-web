import {SimulationRemote} from "./SimulationRemote";
import Axios, {AxiosInstance} from "axios";
import {API_URL} from "./index";

export class MeterRemote {
    public readonly meterId: string;
    private readonly axios: AxiosInstance;
    private readonly socket: WebSocket;

    constructor(meterId: string, simRemote: SimulationRemote) {
        this.meterId = meterId;
        this.axios = Axios.create({
            baseURL: `${API_URL}/simulations/${simRemote.simId}/data`
        });

        this.socket = new WebSocket(`ws://${API_URL}/simulations/${simRemote.simId}/data/${meterId}`);
    }
}
