import React, { Component } from 'react'
import Node from './Node/Node'
import constructClauses from '../Algorithms/constructClauses'
import solver from '../Algorithms/solver'
import './FlowFreeSolver.css'
import { Alert, Button, ButtonGroup } from 'react-bootstrap';

export default class FlowFreeSolver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            length: 5,
            size: 'lg',
            navButtons: [],
            endpointStack: [7,7,6,6,5,5,4,4,3,3,2,2,1,1],
            maxEndpoint: 14,
            alert: undefined,
        };
    }

    componentDidMount() {
        this.createGrid(5);
        const navButtons = [];
        for(let i = 5; i <= 15; i++) {
            navButtons.push(<Button 
                key={i} 
                variant="secondary" 
                onClick={() => this.changeGridSize(i)}>{i}x{i}</Button>);
        }
        this.setState({navButtons});
    }

    onClick(row, col) {
        let {nodes, endpointStack} = this.state;
        let {n} = nodes[row][col];
        let {length} = endpointStack;
        if(length === 0 && n === 0) {
            this.appendAlert("No more colors!", "danger");
            return;
        }
        if(n === 0) {
            n = endpointStack.pop();
        }else {
            endpointStack.push(n);
            n = 0;
        }
        nodes[row][col].n = n;
        this.setState({nodes, endpointStack});
    }

    changeGridSize(length) {
        this.createGrid(length);
        this.refreshEndpointStack();
    }

    refreshEndpointStack() {
        const endpointStack = [7,7,6,6,5,5,4,4,3,3,2,2,1,1];
        this.setState({endpointStack});
    }
    
    refreshButtonOnClick() {
        const {length} = this.state;
        this.createGrid(length);
        this.refreshEndpointStack();
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

    appendAlert(message, variant) {
        const alert = <Alert 
        variant={variant}
        onClose={() => this.removeAlert()} 
        dismissible><h6>{message}</h6></Alert>
        this.setState({alert});
    }

    removeAlert() {
        const alert = undefined;
        this.setState({alert});

    }
    
    solve() {
        const {endpointStack, nodes, maxEndpoint} = this.state;
        const {length} = endpointStack;
        if(length % 2 !== 0 || length === maxEndpoint) {
            this.appendAlert("Invalid Endpoint Configuration!", "danger");
        }else {
            var test = new constructClauses(nodes, (maxEndpoint - length) / 2);
            test.generateClauses();
            console.log(test.cnf);
        }
    }
    render() {
        const {nodes, length, navButtons, alert} = this.state;
        return (
            <div>
                {alert}
                <div className="nav">
                    <ButtonGroup className="btn">
                        {navButtons}
                        <Button variant="secondary" 
                        onClick={() => this.refreshButtonOnClick()}>Refresh</Button>
                    </ButtonGroup>
                </div>
                <div >
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
                                        onClick={(row, col) => this.onClick(row, col)}></Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <Button 
                className="btn" 
                variant="primary" 
                onClick={() => this.solve()}>Solve!</Button>
            </div>
        );
    }
}