import React, {Component} from 'react'
import Node from './Node/Node'
import './FlowFreeSolver.css'
import {Button, ButtonGroup} from 'react-bootstrap';

export default class FlowFreeSolver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            length: 10,
            size: 'lg',
            navButtons: [],
            endpointStack: [7,7,6,6,5,5,4,4,3,3,2,2,1,1],
        };
    }

    componentDidMount() {
        this.createGrid(10);
        const navButtons = [];
        for(let i = 5; i <= 15; i++) {
            navButtons.push(<Button key={i} variant="secondary" onClick={() => this.setGrid(i)}>{i}x{i}</Button>);
        }
        this.setState({navButtons});
    }

    onClick(row, col) {
        let {nodes, endpointStack} = this.state;
        let {n} = nodes[row][col];
        let {length} = endpointStack;
        if(length === 0 && n === 0) {

            return;
        }
        if(n === 0) {
            n = endpointStack.pop();
        }else {
            endpointStack.push(n);
            n = 0;
        }
        nodes[row][col] = {n};
        this.setState({nodes, endpointStack});
    }
    
    createGrid(length) {
        const nodes = []
        for(let row = 0; row < length; row++) {
            const currentRow = [];
            for(let col = 0; col < length; col++) {
                const Node =  {
                    col,
                    row,
                    n: 0,
                };
                currentRow.push(Node);
            }
            nodes.push(currentRow);
        }
        this.setState({nodes, length});
    }

    setGrid(length) {
        if(length !== this.state.length) {
            this.createGrid(length);
        }
    }

    render() {
        const {nodes, length, navButtons} = this.state;
        return (
            <div className="grid">
                <div className="nav">
                    <ButtonGroup className="btn">
                        {navButtons}
                    </ButtonGroup>
                </div>
                {nodes.map((row, rowIdx) => {
                    return(
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const {n} = node;
                                return (
                                    <Node 
                                    row={rowIdx}
                                    col={nodeIdx}
                                    key={nodeIdx}
                                    size={length}
                                    n={n}
                                    onClick={(row, col) => this.onClick(row, col)}
                                    ></Node>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}