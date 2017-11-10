import Axios, {AxiosInstance} from "axios";
import {API_URL, WS_URL} from "./";
import {IPropertyUpdate} from "../models/PropertyControl";

// TODO: use webpack define plugin

export class SimulationRemote {
    public readonly simId: string;
    public readonly boxSocket: WebSocket;
    private readonly axios: AxiosInstance;

    constructor(simId: string) {
        this.simId = simId;
        this.axios = Axios.create({
            baseURL: `${API_URL}/simulations/${simId}`
        });

        this.boxSocket = new WebSocket(`${WS_URL}/simulations/${simId}/configuration`);
    }

    public fetchModel() {
        return this.axios.get("");
    }

    public fetchDataStreams() {
        return this.axios.get("/data");
    }

    public fetchAvailableMeters() {
        return this.axios.get("/data/meters");
    }

    public start() {
        return this.axios.put("/control", {status: "start"});
    }

    public pause() {
        return this.axios.put("/control", {status: "pause"});
    }

    public updateProperty(update: IPropertyUpdate) {
        return this.axios.put("/properties", update);
    }

}
