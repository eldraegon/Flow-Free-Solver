import React, {Component} from 'react'
import Node from './Node/Node'
import './FlowFreeSolver.css'
import { Button, ButtonGroup } from 'react-bootstrap';

export default class FlowFreeSolver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            length: 10,
        };
    }

    componentDidMount() {
        const nodes = []
        for(let row = 0; row < this.state.length; row++) {
            const currentRow = [];
            for(let col = 0; col < this.state.length; col++) {
                const Node =  {
                    col,
                    row,
                    isStart: row === 5 && col === 0,
                    isFinish: row === 5 && col === 9,
                };
                currentRow.push(Node);
            }
            nodes.push(currentRow);
        }
        this.setState({nodes});
    }

    render() {
        const {nodes} = this.state;
        const navButtons = [];
        for(let i = 5; i <= 15; i++) {
            navButtons.push(<Button className="Button">{i} x {i}</Button>);
        }

        return (
            <div className="grid">
                <div className="nav">
                    <ButtonGroup>
                        {navButtons}
                    </ButtonGroup>
                </div>
                {nodes.map((row, rowIdx) => {
                    return(
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const {isStart, isFinish} = node
                                return (
                                    <Node 
                                    key={nodeIdx}
                                    isStart={isStart}
                                    isFinish={isFinish}>
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