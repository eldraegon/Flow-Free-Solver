import React, { Component } from 'react'
import Node from './Node/Node'
import $ from 'jquery'
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
        this.removeAlert();
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

    getCell(x, y, color, length, c) {
        return (x * length * c) + (y * c) + color + 1
    }

    displaySolution(state, colors) {
        const {length} = this.state;
        const nodes = []
        for(let x = 0; x < length; x++) {
            const row = []
            for(let y = 0; y < length; y++) {
                for(let c = 0; c < colors; c++) {
                    if(state.includes(this.getCell(x, y, c, length, colors))) {
                        row.push({
                            x,
                            y,
                            n: c+1
                        })
                    }
                }
            }
            nodes.push(row)
        }
        this.setState({nodes});
    }

    solve() {
        const {endpointStack, nodes, maxEndpoint} = this.state;
        const {length} = endpointStack;
        if(length % 2 !== 0 || length === maxEndpoint) {
            this.appendAlert("Invalid Endpoint Configuration!", "danger");
            return;
        }
        const endpoints = []
        nodes.forEach(row => {
            row.forEach(node => {
                if(node.n !== 0) {
                    const {row, col, n} = node
                    endpoints.push([row, col, n])
                }
            })
        })
        const state = {
            length: nodes.length,
            colors: (maxEndpoint - length) / 2,
            nodes: endpoints
        }
        fetch('https://flowsolver.azurewebsites.net/api/solve', {
            method: 'POST',
            body: JSON.stringify(state),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then(response => response.json())
        .then(json => this.displaySolution(json['nodes'], state['colors']))
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
                        onClick={() => this.refreshButtonOnClick()}>Clear</Button>
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
                                        onClick={(row, col) => this.onClick(row, col)}/>
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