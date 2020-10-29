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
            this.length = this.nodes.length;
            this.cnf = [];
            this.visited = [];
            this.clauses = [];
    }

    getAdjacentNeighbors(i, j) {
        let {length} = this;
        let ret = [];
        this.diff.forEach(element => {
            let differenceX = i + element[0];
            let differenceY = j + element[1];
            if(differenceX >= 0 && differenceX < length && differenceY >= 0 && differenceY < length) {
                ret.push([i + element[0], j + element[1]]);
            }
        });
        return ret;
    }

    getCell(x, y, color) {
        let {length, c} = this;
        let val = (x * length * c) + (y * c) + color + 1
        return val;
    }

    getDirection(x, y, type) {
        let {length, c, n} = this;
        return n + (x * length * c) + (y * c) + type + 1;
    }

    addSingleDirectionClause(i, j) {
        let {cnf} = this;
        let clause = [];
        for(let t = 0; t < 6; t++) {
            clause.push(this.getDirection(i, j, t));
        }
        cnf.push(clause);
        for(let t = 0; t < 6; t++) {
            for(let u = t + 1; u < 6; u++) {
                cnf.push([this.getDirection(i, j, t) * -1, this.getDirection(i, j, u) * -1]);
            }
        }
    }

    avoidNeighborCells(i, j, t) {
        let delta = this.directions[t];
        let ret = [];
        delta.forEach(d => {
            ret.push([i + d[0], j + d[1]]);
        });
        return ret;
    }

    addDirectionAvoidanceClause(i, j, t) {
        let {c, cnf} = this;
        let avoid = this.avoidNeighborCells(i, j, t);
        this.getAdjacentNeighbors(i, j).forEach(cell => {
            if(!avoid.includes(i)) {
                for(let color = 0; color < c; color++) {
                    cnf.push([this.getDirection(i, j, t) * -1, this.getCell(i, j, color) * -1,
                    this.getCell(cell[0], cell[1], t) * -1]);
                }
            }
        });
    }

    addLRClause(i, j) {

    }
    
    addTBClause(i, j) {

    }

    addTLClause(i, j) {

    }

    addTRClause(i, j) {

    }

    addBLClause(i, j) {

    }

    addBRClause(i, j) {

    }
    
    
    addDirectionClause(i, j) {
        this.addSingleDirectionClause(i, j);
        this.addLRClause(i, j);
        this.addTBClause(i, j);
        this.addTLClause(i, j);
        this.addTRClause(i, j);
        this.addBLClause(i, j);
        this.addBRClause(i, j);
    }

    addCellClause(i, j) {
        let {cnf, c} = this;
        let clause = []
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
        let {cnf, c} = this;
        cnf.push([this.getCell(i, j, color)]);
        for(let k = 0; k < c; k++) {
            if(k !== color) {
                cnf.push([this.getCell(i, j, k) * -1]);
            }
        }
        let clause = [];
        this.getAdjacentNeighbors(i, j).forEach(coordinates => {
            clause.push(this.getCell(coordinates[0], coordinates[1], color));
        });
        cnf.push(clause);
        this.getAdjacentNeighbors(i, j).forEach((firstCoordinates, idx) => {
            this.getAdjacentNeighbors(i, j).slice(idx + 1).forEach(secondCoordinates => {
                //TODO: check if right (idx + 1 or idx)
                cnf.push([this.getCell(firstCoordinates[0], firstCoordinates[1], color) * -1,
                this.getCell(secondCoordinates[0], secondCoordinates[1], color) * -1]);
            });
        });
    }

    generateClauses() {
        this.nodes.forEach((row, i) => {
            row.forEach((node, j) => {
                let {n} = node;
                if(n === 0) {
                    this.addCellClause(i, j);
                }else {
                    this.addEndpointClause(i, j, n);
                }
            })
        });
    }
}