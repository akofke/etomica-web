import * as React from "react";

import {BrowserRouter as Router} from "react-router-dom";
import "./App.css";
import {ConfigurationViewer} from "./components/ConfigurationViewer";
import {Navbar} from "./components/Navbar";
import {Route} from "react-router";
import {SimulationIndexView} from "./components/SimulationIndexView";

export const App = () => (
    <Router>
        <div>
            <Navbar/>
            <Route exact={true} path={"/"} component={SimulationIndexView}/>
        </div>
    </Router>
);
