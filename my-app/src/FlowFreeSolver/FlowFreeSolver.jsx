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
            endpointStack: {
                stackArray: [7,7,6,6,5,5,4,4,3,3,2,2,1,1],
                stackTop: 13,
            },
        };
    }

    componentDidMount() {
        this.createGrid(10);
    }

    onClick(row, col) {
        const {nodes} = this.state;
        let {endpointStack} = this.state;
        let {stackArray, stackTop} = endpointStack;
        if(nodes[row][col] !== 0) {
            stackArray.pop();
            stackTop--;
            console.log("did it!");
        }
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
        const {nodes, length} = this.state;
        const navButtons = [];
        for(let i = 5; i <= 15; i++) {
            navButtons.push(<Button key={i} variant="secondary" onClick={() => this.setGrid(i)}>{i}x{i}</Button>);
        }
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
                                    onClick={this.onClick}
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