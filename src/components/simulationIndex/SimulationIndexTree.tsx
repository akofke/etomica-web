import * as React from "react";
import {ITreeNode, Tree} from "@blueprintjs/core";
import {PackageHierarchy, SimClassInfo} from "./SimulationIndexView";

export interface ISimulationIndexTreeProps {
    classTree: PackageHierarchy;
    searchResults: string[]; // of class names
    onSelect: (selected: SimClassInfo) => void;
}

export class SimulationIndexTree extends React.Component<ISimulationIndexTreeProps, any> {
    private nodeInfoMap: { [nodeId: number]: SimClassInfo } = {};

    constructor(props: ISimulationIndexTreeProps) {
        super(props);
        this.state = {
            nodes: this.getChildNodes(this.props.classTree),
        };
    }

    public render() {
        return (
            <Tree
                contents={this.state.nodes}
                onNodeExpand={this.handleNodeExpand}
                onNodeCollapse={this.handleNodeCollapse}
                onNodeClick={this.onNodeClick}
            />
        );
    }

    public shouldComponentUpdate() {
        return true;
    }

    public componentWillReceiveProps(nextProps: ISimulationIndexTreeProps) {
        this.setState({
            nodes: this.getChildNodes(nextProps.classTree)
        });
    }

    private handleNodeCollapse = (nodeData: ITreeNode) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    private handleNodeExpand = (nodeData: ITreeNode) => {
        nodeData.isExpanded = true;
        this.setState(this.state);
    };

    private onNodeClick = (nodeData: ITreeNode) => {
        if (!nodeData.hasCaret) {
            if (this.state.selectedNode) {
                this.state.selectedNode.isSelected = false;
            }
            nodeData.isSelected = true;
            this.setState({
                selectedNode: nodeData
            });
            this.props.onSelect(this.nodeInfoMap[nodeData.id as number]);
        }

    }

    private getChildNodes = (treeObj: PackageHierarchy): ITreeNode[] => {
        const childNodes: ITreeNode[] = [];
        treeObj.classes.forEach((classInfo) => {
            const id = Math.random();
            childNodes.push({
                label: classInfo.className.split(".").pop(),
                id
            } as ITreeNode);
            this.nodeInfoMap[id] = classInfo;

        });
        Object.keys(treeObj.subpackages).forEach((key) => {
            childNodes.push({
                label: key,
                childNodes: this.getChildNodes(treeObj.subpackages[key]),
                id: Math.random(),
                isExpanded: this.props.searchResults.some(
                    // TODO: inefficient
                    (searchClassName) => searchClassName.split(".").indexOf(key) > -1
                )
            } as ITreeNode);
        });
        return childNodes;
    }
}
