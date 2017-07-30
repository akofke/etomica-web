import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./app";
import { Hello } from "./components/hello";
import { LocaleProvider } from "antd";
import enUS from "antd/lib/locale-provider/en_US";

ReactDOM.render(
    <LocaleProvider locale={enUS}>
        <App/>
    </LocaleProvider>,
    document.getElementById("example"),
);
