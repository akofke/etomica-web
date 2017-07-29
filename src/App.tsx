import * as React from "react";

import "./App.css";
import { Hello } from "./components/hello";

export const App = (props: any) => {
    return (
        <Hello compiler="typescript" framework="react" />
    );
};
