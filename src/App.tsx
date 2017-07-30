import * as React from "react";

import "./App.css";
import { Hello } from "./components/hello";
import { Layout } from "antd";

const { Content, Footer, Sider } = Layout;

export const App = () => {
    return (
        <Layout style={{height: "100vh"}}>
            <Sider>Sider</Sider>
            <Content>Content</Content>
        </Layout>
    );
};
