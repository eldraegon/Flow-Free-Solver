import React, {Component} from 'react';
import './Node.css'

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: {
                0: "",
                1: "colorBlue",
                2: "colorRed",
                3: "colorGreen",
                4: "colorOrange",
                5: "colorYellow",
                6: "colorWhite",
                7: "colorGrey",
            },
        };
    }
    render() {
        const {color} = this.state;
        const {size, n, row, col, onClick} = this.props;
        const gridSize = size < 8? "lg" : size < 11? "md" : "sm";
        return <div className={`node ${color[n]} ${gridSize}`}
        onClick={() => onClick(row, col)}
        ></div>
    }
}