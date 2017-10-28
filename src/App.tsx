import * as React from "react";

import {BrowserRouter as Router} from "react-router-dom";
import "./App.css";
import {Navbar} from "./components/Navbar";
import {Route} from "react-router";
import {SimulationIndexView} from "./components/simulationIndex/SimulationIndexView";
import {CreateSimulationInstance} from "./components/CreateSimulationInstance";
import {SimulationInstanceView} from "./components/simulationInstance/SimulationInstanceView";
import {FocusStyleManager} from "@blueprintjs/core";
import {observer} from "mobx-react";
import uiStore from "./stores/UIStore";
import DevTools from "mobx-react-devtools";
import {SimulationInstancePage} from "./components/simulationInstance/SimulationInstancePage";

FocusStyleManager.onlyShowFocusOnTabs();

export const App = observer(() => (
    <Router>
        <div id="App-main" className={uiStore.isDarkTheme ? "pt-dark" : ""}>
            <Navbar/>
            <div id="App-content">
                <Route exact={true} path={"/"} component={SimulationIndexView}/>
                <Route path={"/create/:simClassName"} component={CreateSimulationInstance}/>
                <Route path={"/view/:simId"} component={SimulationInstancePage}/>
            </div>
            <DevTools/>
        </div>
    </Router>
));
