
import {observable, action, runInAction, computed} from "mobx";
import {SimClassInfo, PackageHierarchy} from "../components/simulationIndex/SimulationIndexView";
import { SimulationIndexRemote } from "../api/SimulationIndexRemote";

export class SimulationIndexStore {
    @observable public loadedClasses: boolean = false;
    @observable public error = false;
    @observable.shallow public classInfos: SimClassInfo[] = [];

    @observable public searchQuery: string = "";
    @observable.ref public selectedClass?: SimClassInfo;

    @action
    public fetchSimulations() {
        this.error = false;
        SimulationIndexRemote.fetchSimulationClasses().then((response) => {
            runInAction(() => {
                this.classInfos = response.data;
                this.loadedClasses = true;
            });
        }).catch((err) => {
            console.log(err);
            runInAction(() => { this.error = true; });
        })
    }

    @action
    public setSearchQuery(query: string) {
        this.searchQuery = query;
    }

    @computed get simPackageHierarchy(): PackageHierarchy {
        const classes: PackageHierarchy = { subpackages: {}, classes: [] };
        this.classInfos.forEach((classInfo) => {
            const classNameComponents = classInfo.className.split(".");
            addToPackageHierarchy(classes, classNameComponents.slice(0, -1), classInfo);
        });
        return classes;
    }

    @computed get infosByClass(): { [className: string]: SimClassInfo } {
        return this.classInfos.reduce((result: any, item) => {
            result[item.className] = item;
            return result;
        }, {});
    }

    @computed get searchResults(): string[] {
        if (this.searchQuery.length < 3) {
            return [];
        } else {
            const pattern = new RegExp(this.searchQuery, "i");
            return this.classInfos.filter((classInfo) => (
                pattern.test(classInfo.className + classInfo.javadoc)
            )).map((classInfo) => classInfo.className);
        }
    }
}

const addToPackageHierarchy = (hierarchy: PackageHierarchy, packagePath: string[], classInfo: SimClassInfo) => {
    const lastKeyIndex = packagePath.length;
    for (let i = 0; i < lastKeyIndex; ++i) {
        const key = packagePath[i];
        if (!(key in hierarchy.subpackages)) {
            hierarchy.subpackages[key] = {subpackages: {}, classes: []};
        }
        hierarchy = hierarchy.subpackages[key];
    }

    hierarchy.classes.push(classInfo);
};

export const simulationIndexStore = new SimulationIndexStore();
