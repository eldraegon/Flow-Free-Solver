import React, {Component} from 'react'
import Node from '../Node/Node'
import './FlowFreeSolver.css'

export default class FlowFreeSolver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
        };
    }

    componentDidMount() {
        const nodes = []
        for(let row = 0; row < 10; row++) {
            const currentRow = [];
            for(let col = 0; col < 10; col++) {
                const Node =  {
                    col,
                    row,
                    isStart: row === 5 && col === 0,
                    isFinish: row === 5 && col === 10,
                };
                currentRow.push(Node);
            }
            nodes.push(currentRow);
        }
        this.setState({nodes});
    }

    render() {
        const {nodes} = this.state
        console.log(nodes);

        return (
            <div className="grid">
                {nodes.map((row, rowIdx) => {
                    return(
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                return (
                                    <Node>
                                        
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