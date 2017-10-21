import * as React from "react";
import {ITreeNode, Tree} from "@blueprintjs/core";
import {PackageHierarchy, SimClassInfo} from "./SimulationIndexView";

export interface ISimulationIndexTreeProps {
    classTree: PackageHierarchy;
    searchResults: string[]; // of class names
    onSelect: (selected: SimClassInfo) => void;
}

interface ISimulationIndexTreeState {
    nodes: ITreeNode[];

}

const arraysAreEqual = (arr1: string[], arr2: string[]) => {
    return arr1.length === arr2.length && arr1.every((value, i) => value === arr2[i]);
}

export class SimulationIndexTree extends React.Component<ISimulationIndexTreeProps, any> {
    private nodeInfoMap: { [nodeId: string]: SimClassInfo } = {};

    constructor(props: ISimulationIndexTreeProps) {
        super(props);
        this.state = {
            nodes: this.getChildNodes(this.props.classTree, ""),
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
        if(!arraysAreEqual(this.props.searchResults, nextProps.searchResults)) {
            this.setState({
                nodes: this.getChildNodes(nextProps.classTree, "")
            });
        }
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
        if (!nodeData.childNodes) {
            console.log(nodeData);
            if (this.state.selectedNode) {
                this.state.selectedNode.isSelected = false;
            }
            nodeData.isSelected = true;
            this.setState({
                selectedNode: nodeData,
                nodes: this.state.nodes
            });
            this.props.onSelect(this.nodeInfoMap[nodeData.id as number]);
        }

    }

    private getChildNodes = (treeObj: PackageHierarchy, path: string): ITreeNode[] => {
        const childNodes: ITreeNode[] = [];
        treeObj.classes.forEach((classInfo) => {
            const id = classInfo.className;
            childNodes.push({
                label: classInfo.className.split(".").pop(),
                iconName: "graph",
                id
            } as ITreeNode);
            this.nodeInfoMap[id] = classInfo;

        });
        Object.keys(treeObj.subpackages).forEach((key) => {
            const currentPath = path + key + ".";
            childNodes.push({
                label: key,
                iconName: "box",
                childNodes: this.getChildNodes(treeObj.subpackages[key], currentPath),
                id: currentPath,
                isExpanded: this.props.searchResults.some(
                    // TODO: inefficient
                    (searchClassName) => searchClassName.split(".").indexOf(key) > -1
                )
            } as ITreeNode);
        });
        return childNodes;
    }
}
