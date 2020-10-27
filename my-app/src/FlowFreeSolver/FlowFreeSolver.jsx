import React, {Component} from 'react'
import Node from './Node/Node'
import './FlowFreeSolver.css'
import { Button, ButtonGroup } from 'react-bootstrap';
function test(num) {
    console.log("TEST")
}
export default class FlowFreeSolver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            length: 10,
            size: 'lg',
        };
    }

    componentDidMount() {
        this.createGrid(10);
    }
    
    createGrid(length) {
        const nodes = []
        for(let row = 0; row < length; row++) {
            const currentRow = [];
            for(let col = 0; col < length; col++) {
                const Node =  {
                    col,
                    row,
                    num: 0,
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
        const {nodes} = this.state;
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
                                const {isStart, isFinish} = node
                                const {size} = this.state;
                                return (
                                    <Node 
                                    key={nodeIdx}
                                    isStart={isStart}
                                    isFinish={isFinish}
                                    size={size}>
                                    </Node>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}