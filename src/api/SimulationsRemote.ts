import Axios from "axios";
import {API_URL} from "./index";

export interface SimulationConstructor {
    className: string;
}

export const createSimulationInstance = (simConstructor: SimulationConstructor) => {
    return Axios.post(`${API_URL}/simulations`, simConstructor);
};

export const getInstances = () => {
    return Axios.get(`${API_URL}/simulations/instances`);
};

export const deleteInstance = (id: string) => {
    return Axios.delete(`${API_URL}/simulations/${id}`);
};
