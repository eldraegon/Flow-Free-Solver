import React, {Component} from 'react'
import Node from './Node/Node'
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
                currentRow.push([]);
            }
            nodes.push(currentRow);
        }
        this.setState({nodes});
    }

    render() {
        let {nodes} = this.state
        console.log(nodes);
        return (
            <div>
                <div className="navBar">
                    <nav>
                        <button>4x4</button>
                        <button>5x5</button>
                        <button>6x6</button>
                        <button>7x7</button>
                        <button>8x8</button>
                    </nav>
                </div>
                <div className="grid">
                    {nodes.map((row, rowIdx) => {
                        return <div>
                            {row.map((node, nodeIdx) => <Node></Node>)}
                        </div>
                    })}
                </div>
            </div>
        );
    }
}