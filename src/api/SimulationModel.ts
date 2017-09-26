import Axios from "axios";
import {IConstructionParams} from "../components/AddMeterForm";

export const createSimulationInstance = (className: string) => {
    return Axios.post("http://localhost:8080/simulations", {
        className,
    });
};

export const fetchModel = (id: string) => {
    return Axios.get(`http://localhost:8080/simulations/${id}`);
};

export const treeifyModel = (model: any) => {
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

export const getAvailableMeters = (simId: string) => {
    return Axios.get(`http://localhost:8080/simulations/${simId}/data/meters`);
};

export const addMeter = (params: IConstructionParams, simId: string) => {
    return Axios.post(`http://localhost:8080/simulations/${simId}/data`, params);
}
