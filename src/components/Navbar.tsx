import * as React from "react";
import {Route} from "react-router";
import {SimStatusControls} from "./SimStatusControls";
import {Link} from "react-router-dom";
import {Button, Icon, Menu, MenuItem, Switch} from "@blueprintjs/core";
import {Popover2} from "@blueprintjs/labs";
import uiStore from "../stores/UIStore";
import {observer} from "mobx-react";

export const Navbar = observer(() => {
    return(
        <nav className="pt-navbar" id="App-navbar">
            <div className="pt-navbar-group pt-align-left">
                <div className="pt-navbar-heading">
                    <Link to={"/"}>
                        <Button text="Etomica" className="pt-minimal pt-large"/>
                    </Link>
                </div>
            </div>
            <div className="pt-navbar-group pt-align-right">
                <Popover2>
                    <Button iconName={"cog"} className="pt-minimal"/>
                    <Menu>
                        <MenuItem text={"Toggle theme"} label={getThemeLabel()} shouldDismissPopover={false} onClick={toggleTheme}/>
                    </Menu>
                </Popover2>
            </div>
        </nav>
    );
});

const toggleTheme = (e: React.MouseEvent<HTMLElement>) => uiStore.toggleTheme();

const getThemeLabel = () => (
    uiStore.isDarkTheme ? <Icon iconName={"moon"}/> : <Icon iconName={"flash"}/>
);


const renderControls = ({ match }: any) => (
    <SimStatusControls simId={match.params.simId}/>
);
