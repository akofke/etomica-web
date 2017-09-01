import * as React from "react";
import {Route} from "react-router";
import {SimStatusControls} from "./SimStatusControls";

export const Navbar = () => {
    return(
        <nav className="pt-navbar">
            <div className="pt-navbar-group pt-align-left">
                <div className="pt-navbar-heading">Etomica</div>
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
