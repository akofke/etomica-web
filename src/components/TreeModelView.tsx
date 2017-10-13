import * as React from "react";
import JSONTree from "react-json-tree";

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
            <JSONTree data={this.props.treeModel[0]}/>
        );
    }

}
