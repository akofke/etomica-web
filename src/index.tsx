import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/hello";
import { Unused } from "./components/unused";

ReactDOM.render(
    // <Hello compiler="ts" framework="react" />,
    <Unused />,
    document.getElementById("example")
);
