import * as React from "react";

import "./App.css";
import { Layout } from "antd";

const { Content, Footer, Sider } = Layout;

export const App = () => {
    return (
        <Layout style={{height: "100vh"}}>
            <Sider>Sider</Sider>
            <Content>
                <h1>Content</h1>
            </Content>
        </Layout>
    );
};
