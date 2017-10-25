import * as React from "react";
import {Route} from "react-router";
import {SimStatusControls} from "./SimStatusControls";
import {Link} from "react-router-dom";
import {Button} from "@blueprintjs/core";

export const Navbar = () => {
    return(
        <nav className="pt-navbar" id="navbar">
            <div className="pt-navbar-group pt-align-left">
                <div className="pt-navbar-heading">
                    <Link to={"/"}>
                        <Button text="Etomica" className="pt-minimal pt-large"/>
                    </Link>
                </div>
            </div>
            <div className="pt-navbar-group pt-align-right">
               <Route path={"/view/:simId"} render={renderControls}/>
            </div>
        </nav>
    );
};

const renderControls = ({ match }: any) => (
    <SimStatusControls simId={match.params.simId}/>
);
