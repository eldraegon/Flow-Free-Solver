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

    addSingleDirectionClause(i, j) {
        const {cnf} = this;
        const clause = [];
        for(let t = 0; t < 6; t++) {
            clause.push(this.getDirection(i, j, t));
        }
        cnf.append(clause);
        for(let t = 0; t < 6; t++) {
            for(let u = t + 1; u < 6; u++) {
                cnf.push([this.getDirection(i, j, t) * -1, this.getDirection(i, j, u) * -1]);
            }
        }
    }
    
    addDirectionClause(i, j) {

    }

    addCellClause(i, j) {
        const {cnf, c} = this;
        const clause = []
        for(let k = 0; k < this.c; k++) {
            clause.push(this.getCell(i, j, k));
        }
        cnf.push(clause);
        for(let k = 0; k < c; k++) {
            for(let l = k+1; l < c; l++) {
                cnf.push([this.getCell(i, j, k) * -1, this.getCell(i, j, l) * -1]);
            }
        }
        this.addDirectionClause(i, j);
    }

    addEndpointClause(i, j, color) {
        const {cnf, c} = this;
        cnf.push([this.getCell(i, j, color)]);
        for(let k = 0; k < c; k++) {
            if(k !== color) {
                cnf.push([this.getCell(i, j, k) * -1]);
            }
        }
        const clause = [];
        this.getAdjacentNeighbors((i, j).forEach(coordinates => {
            clause.push(this.getCell(coordinates[0], coordinates[1], color));
        }));
        cnf.push(clause);
        this.getAdjacentNeighbors(i, j).forEach((firstCoordinates, idx) => {
            this.getAdjacentNeighbors(i, j).slice(idx + 1).forEach(secondCoordinates => {
                //TODO: check if right (idx + 1 or idx)
                cnf.push([this.getCell(firstCoordinates[0], firstCoordinates[1], color) * -1,
                this.getCell(secondCoordinates[0], secondCoordinates[1]) * -1]);
            });
        });
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