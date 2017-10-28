
import {action, observable} from "mobx";
import {IToaster, Toaster} from "@blueprintjs/core";

class UIStore {
    @observable public isDarkTheme: boolean = false;

    public readonly toaster: IToaster = Toaster.create();

    @action
    public toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
    }
}

const uiStore = new UIStore();
export default uiStore;
