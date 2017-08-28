import * as React from "react";

import "./App.css";
import {Hello} from "./components/Hello";
import {Navbar} from "./components/Navbar";
import {ConfigurationViewer} from "./components/ConfigurationViewer";

export const App = () => {
    return (
        <ConfigurationViewer/>
    );
};
