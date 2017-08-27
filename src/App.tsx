import * as React from "react";

import "./App.css";
import {Hello} from "./components/Hello";

export const App = () => {
    return (
        <Hello compiler={"typescript"} framework={"react"}/>
    );
};
