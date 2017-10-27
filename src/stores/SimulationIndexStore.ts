
import {observable} from "mobx";
import {SimClassInfo} from "../components/simulationIndex/SimulationIndexView";

export class SimulationIndexStore {
    @observable public loadingClasses: boolean = false;
    @observable.shallow public classInfos: SimClassInfo[] = [];

    @observable public searchQuery: string = "";
    @observable public selectedClass?: SimClassInfo;
}

const simulationIndexStore = new SimulationIndexStore();
export default simulationIndexStore;
