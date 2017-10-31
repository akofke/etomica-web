import {SimulationRemote} from "./SimulationRemote";
import Axios, {AxiosInstance} from "axios";
import {API_URL, WS_URL} from "./index";

export class MeterRemote {
    public readonly meterId: string;
    public readonly socket: WebSocket;
    private readonly axios: AxiosInstance;

    constructor(meterId: string, simRemote: SimulationRemote) {
        this.meterId = meterId;
        this.axios = Axios.create({
            baseURL: `${API_URL}/simulations/${simRemote.simId}/data`
        });

        this.socket = new WebSocket(`${WS_URL}/simulations/${simRemote.simId}/data/${meterId}`);
    }

    public fetchDataInfo() {
        return this.axios.get(`/${this.meterId}`);
    }
}
