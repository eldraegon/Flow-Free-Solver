import React, {Component} from 'react';
import './Node.css'
import $ from 'jquery'

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: [
                "",
                "blue",
                "red",
                "green",
                "orange",
                "yellow",
                "white",
                "grey",
                "cyan",
                "pink",
                "brown",
                "purple",
                "lawngreen",
                "darkmagenta",
                "khaki"
            ],
            size: {
                "sm": 50,
                "md": 60,
                "lg": 100
            }
        };
    }
    constructSVG(gridSize) {
        const {color, size} = this.state;
        const {n, direction, endpointDirection, isEndpoint} = this.props;
        if(n === 0) return;
        const ret = [];
        const gridS = size[gridSize]
        if(isEndpoint) {
            ret.push(<circle 
                cx={`${gridS/2}`}
                cy={`${gridS/2}`}
                fill={`${color[n]}`}
                r={`${gridS/2 - gridS/10}`}
            ></circle>)
        }
        switch(endpointDirection) {
            case 0:
                ret.push(<rect
                    width={`${2*gridS/5}`}
                    height={`${gridS/2}`}
                    x={`${3 * gridS/10}`}
                    y="0"
                    fill={`${color[n]}`}
                    ></rect>)
                    break;
            
            case 1:
                ret.push(<rect
                    width={`${gridS/2}`}
                    height={`${2 * gridS/5}`}
                    x={`${gridS/2}`}
                    y={`${3 * gridS/10}`}
                    fill={`${color[n]}`}
                    ></rect>)
                    break;

            case 2:
                ret.push(<rect
                    width={`${2*gridS/5}`}
                    height={`${gridS/2}`}
                    x={`${3 * gridS/10}`}
                    y={`${gridS/2}`}
                    fill={`${color[n]}`}
                    ></rect>)
                    break;

            case 3:
                ret.push(<rect
                    width={`${gridS/2}`}
                    height={`${2*gridS/5}`}
                    x= "0"
                    y= {`${3 * gridS/10}`}
                    fill={`${color[n]}`}
                    ></rect>)
                    break;
            default:
                break;
        }
        switch(direction) {
            case 0:
                ret.push(<rect
                    x="0"
                    y={`${3 * gridS/10}`}
                    width={`${gridS}`}
                    height={`${2 * gridS/5}`}
                    fill={`${color[n]}`}
                    ></rect>);
                break;
            case 1:
                ret.push(<rect
                    x={`${3 * gridS/10}`}
                    y="0"
                    width={`${2 * gridS/5}`}
                    height={`${gridS}`}
                    fill={`${color[n]}`}
                    ></rect>);
                break;
            case 2:
                ret.push(<rect
                    x={`${3 * gridS/10}`}
                    y="0"
                    width={`${2 * gridS/5}`}
                    height={`${7 * gridS/10}`}
                    fill={`${color[n]}`}
                    ></rect>);
                ret.push(<rect
                    x="0"
                    y={`${3 * gridS/10}`}
                    width={`${gridS/2}`}
                    height={`${2 * gridS/5}`}
                    fill={`${color[n]}`}
                    ></rect>);
                    break;
            case 3:
                ret.push(<rect
                    x={`${3 * gridS/10}`}
                    y={`${3 * gridS/10}`}
                    width={`${7 * gridS/10}`}
                    height={`${4 * gridS/10}`}
                    fill={`${color[n]}`}
                ></rect>);
                ret.push(<rect
                    x={`${3 * gridS/10}`}
                    y="0"
                    width={`${2 * gridS/5}`}
                    height={`${4 * gridS/10}`}
                    fill={`${color[n]}`}
                ></rect>)
                break;
            case 4:
                ret.push(<rect
                    x={`${3 * gridS/10}`}
                    y={`${3 * gridS/10}`}
                    width={`${4 * gridS/10}`}
                    height={`${7 * gridS/10}`}
                    fill={`${color[n]}`}
                    ></rect>)
                ret.push(<rect
                    x="0"
                    y={`${3 * gridS/10}`}
                    width={`${4 * gridS/10}`}
                    height={`${2 * gridS/5}`}
                    fill={`${color[n]}`}
                    ></rect>)
                break;
            case 5:
                ret.push(<rect
                    x={`${3 * gridS/10}`}
                    y={`${3 * gridS/10}`}
                    width={`${7 * gridS/10}`}
                    height={`${4 * gridS/10}`}
                    fill={`${color[n]}`}
                ></rect>)
                ret.push(<rect
                    x={`${3 * gridS/10}`}
                    y={`${3 * gridS/10}`}
                    width={`${4 * gridS/10}`}
                    height={`${7 * gridS/10}`}
                    fill={`${color[n]}`}
                    ></rect>)
                    break;
            default:
                break;
        }
        return ret;
    }

    render() {
        const {size, row, col, onClick, gridFade} = this.props;
        let grid = "grid";
        if(gridFade !== "") {
            grid = "";
        }
        const gridSize = size < 9? "lg" : size < 12? "md" : "sm";
        return <div className={`node ${gridSize} ${gridFade} ${grid}`}
        onClick={() => onClick(row, col)}>
            <svg>
                {this.constructSVG(gridSize)}
            </svg>
        </div>;
    }
}