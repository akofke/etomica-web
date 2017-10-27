
import {action, observable} from "mobx";

class UIStore {
    @observable public isDarkTheme: boolean = false;

    @action
    public toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
    }
}

const uiStore = new UIStore();
export default uiStore;
