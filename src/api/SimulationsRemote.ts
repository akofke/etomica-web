import Axios from "axios";
import {API_URL} from "./index";

export interface SimulationConstructor {
    className: string;
}

export const createSimulationInstance = (simConstructor: SimulationConstructor) => {
    return Axios.post(`${API_URL}/simulations`, simConstructor);
};
