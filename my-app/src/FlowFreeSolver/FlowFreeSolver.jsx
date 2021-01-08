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
            disabled: false,
            diff: [
                [-1,0],
                [0, 1],
                [1, 0],
                [0, -1]
            ]
        };
    }

    componentDidMount() {
        const {maxColor} = this.state;
        const endpointStack = []
        for(let i = maxColor; i > 0; --i) { 
            endpointStack.push(i);
            endpointStack.push(i);
        }
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
        let {nodes, endpointStack, disabled} = this.state;
        if(disabled) {
            return;
        }
        let {n} = nodes[row][col];
        let {length} = endpointStack;
        if(length === 0 && n === 0) {
            this.appendAlert("No more colors!", "danger");
            return;
        }
        let isEndpoint = false;
        if(n === 0) {
            n = endpointStack.pop();
            isEndpoint = true;
        }else {
            endpointStack.push(n);
            n = 0;
        }
        nodes[row][col].n = n;
        nodes[row][col].isEndpoint = isEndpoint;
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
        $("#solvebtn").prop({'disabled': false})
        $("#clear").prop({'class': 'btn btn-secondary'})
        this.setState({disabled: false})
    }

    constructGrid(nodes, length) {
        for(let row = 0; row < length; row++) {
            const currentRow = [];
            for(let col = 0; col < length; col++) {
                const Node =  {
                    col,
                    row,
                    n: 0,
                    isEndpoint: false,
                    direction: -1,
                    endpointDirection: -1,
                    gridFade: ""
                }
                currentRow.push(Node);
            }
            nodes.push(currentRow);
        }
    }

    createGrid(length) {
        const nodes = []
        this.constructGrid(nodes, length);
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

    getCell(x, y, color, length, colors) {
        return (x * length * colors) + (y * colors) + color + 1;
    }

    getDirection(x, y, type, colors, length) {
        return (length * length * colors) + (x * length * 6) + (y * 6) + type + 1;
    }

    getDirectionType(x, y, colors, length, state) {
        for(let i = 0; i < 6; i++) {
            if(state.includes(this.getDirection(x, y, i, colors, length))) {
                return i;
            }
        }
        return -1;
    }

    checkWithinBounds(x, y, length) {
        if(x >= 0 && x < length && y >= 0 && y < length) {
            return true;
        }
        return false;
    }

    includes(endpoints, x, y, c) {
        var ret = false;
        endpoints.forEach(([X, Y, C]) => {
            if(x === X && y === Y && c === C) {
                ret = true;
            }
        })
        return ret;
    }

    displaySolution(state, colors, endpoints) {
        console.log(endpoints);
        const {length, diff} = this.state;
        const nodes = []
        for(let x = 0; x < length; x++) {
            const row = []
            for(let y = 0; y < length; y++) {
                for(let c = 0; c < colors; c++) {
                    if(state.includes(this.getCell(x, y, c, length, colors))) {
                        row.push({
                            x,
                            y,
                            n: c+1,
                            isEndpoint: this.includes(endpoints, x, y, c+1),
                            direction: this.getDirectionType(x, y, colors, length, state, endpoints),
                            endpointDirection: -1,
                            gridFade: "animationgridfade"
                        });
                    }
                }
            }
            nodes.push(row);
        }
        endpoints.forEach(([x, y, n]) => {
            diff.forEach(([dx, dy], i) => {
                if(this.checkWithinBounds(x+dx, y+dy, length) && nodes[x+dx][y+dy].n === n) {
                    nodes[x][y].endpointDirection = i;
                }
            });
        });
        console.log(nodes);
        this.setState({nodes, disabled: true});
    }

    solve() {
        $("#solvebtn").prop({'disabled': true})
        $("#clear").prop({class: 'btn btn-danger'})
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
                    const {row, col, n} = node;
                    endpoints.push([row, col, n]);
                }
            })
        })
        const state = {
            length: nodes.length,
            colors: (maxEndpoint - length) / 2,  //TODO FIGURE THIS OUT
            nodes: endpoints
        }
        console.log(state);
        fetch('https://flowsolver.azurewebsites.net/api/solve', {
            method: 'POST',
            body: JSON.stringify(state),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then(response => response.json())
        .then(json => this.displaySolution(json['nodes'], state['colors'], endpoints));
    }

    render() {
        const {nodes, length, navButtons, alert} = this.state;
        return (
            <div>
                {alert}
                <div className="nav">
                    <ButtonGroup className="btn">
                        {navButtons}
                        <Button id="clear" variant="secondary" 
                        onClick={() => this.refreshButtonOnClick()}>Clear</Button>
                    </ButtonGroup>
                </div>
                <div >
                    {nodes.map((row, rowIdx) => {
                        return(
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {n, isEndpoint, direction, endpointDirection, gridFade} = node;
                                    return (
                                        <Node
                                        row={rowIdx}
                                        col={nodeIdx}
                                        key={nodeIdx}
                                        isEndpoint={isEndpoint}
                                        direction={direction}
                                        endpointDirection={endpointDirection}
                                        size={length}
                                        gridFade={gridFade}
                                        n={n}
                                        onClick={(row, col) => this.onClick(row, col)}/>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <Button 
                id="solvebtn"
                className="btn"
                variant="primary"
                onClick={() => this.solve()}>Solve!</Button>
            </div>
        );
    }
}