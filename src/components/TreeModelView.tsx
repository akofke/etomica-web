import * as React from "react";
const Inspector = require("react-json-inspector");

export class TreeModelView extends React.Component<any, any> {
    private simId: string;

    constructor(props: any) {
        super(props);
        this.simId = props.simId;

        this.state = {
            treeModel: props.treeModel,
        };
    }

    public render() {
        return (
            <Inspector data={this.state.treeModel[0]} interactiveLabel={this.renderInteractiveLabel}/>
        );
    }

    private renderInteractiveLabel = (value: any, originalValue: any, isKey: boolean, keypath: any) => {
        console.log(value);
        console.log(keypath);
        return <div></div>;
    }
}
