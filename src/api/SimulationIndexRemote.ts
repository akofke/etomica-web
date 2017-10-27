import Axios from "axios";
import { API_URL } from "./";

export class SimulationIndexRemote {
    public static fetchSimulationClasses = () => {
        return Axios.get(`${API_URL}/simulations`);
    }

}
