export default class constructClauses {
    
    constructor(nodes, c) {
        this.diff = [[0, 1], [1, 0], [-1, 0], [0, -1]];
        this.directions = {0: [[0, 1], [0, -1]],
            1: [[1, 0], [-1, 0]],
            2: [[-1, 0], [0, -1]],
            3: [[-1, 0], [0, 1]],
            4: [[1, 0], [0, -1]],
            5: [[1, 0], [0, 1]]
            };
            this.nodes = nodes;
            this.c = c;
            this.n = this.nodes.length * this.nodes.length * this.c;
            this.cnf = [];
            this.visited = [];
            this.clauses = [];
    }

    getAdjacentNeighbors(i, j) {
        const {length} = this;
        const ret = [];
        this.diff.forEach(element => {
            const differenceX = i + element[0];
            const differenceY = j + element[1];
            if(differenceX >= 0 && differenceX < length && differenceY >= 0 && differenceY < length) {
                ret.push([i + element[0], j + element[1]]);
            }
        });
        return ret;
    }

    getCell(x, y, color) {
        const {length, c} = this;
        return (x * length * c) + (y * c) + color + 1;
    }

    getDirection(x, y, type) {
        const {length, c, n} = this;
        return n + (x * length * c) + (y * c) + type + 1;
    }

    addCellClause(i, j) {
        const {length} = this;
        const clause = []
        for(let k = 0; k < this.c; k++) {
            clause.push(this.getCell(i, j, k));
        }
    }

    addEndpointClause(i, j, n) {

    }

    generateClauses() {
        this.nodes.forEach((row, i) => {
            row.forEach((node, j) => {
                const n = {node};
                if(n === 0) {
                    this.addCellClause(i, j);
                }else {
                    this.addEndpointClause(i, j, n);
                }
            })
        });
    }
}