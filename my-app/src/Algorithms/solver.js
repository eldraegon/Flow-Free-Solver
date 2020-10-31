import SAT from "./SAT"

export default class constructClauses {
    
    constructor(nodes, c) {
        this.diff = [[0, 1], [1, 0], [-1, 0], [0, -1]];
        this.directions = [[[0, 1], [0, -1]],
            [[1, 0], [-1, 0]],
            [[-1, 0], [0, -1]],
            [[-1, 0], [0, 1]],
            [[1, 0], [0, -1]],
            [[1, 0], [0, 1]]
            ];
            this.nodes = nodes;
            this.c = c;
            this.n = this.nodes.length * this.nodes.length * this.c;
            this.length = this.nodes.length;
            this.cnf = [];
            this.visited = [];
            this.clauses = [];
            this.output = [];
            this.cycleClause = [];
    }

    getAdjacentNeighbors(i, j) {
        const {length} = this;
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
        const {length, c} = this;
        return (x * length * c) + (y * c) + color + 1;
    }

    getDirection(x, y, type) {
        const {length, c, n} = this;
        return n + (x * length * 6) + (y * 6) + type + 1;
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
        const delta = this.directions[t];
        let ret = [];
        delta.forEach(d => {
            ret.push([i + d[0], j + d[1]]);
        });
        return ret;
    }

    coordinateContainedWithin(item, array) {
        let ret = false;
        array.forEach(element => {
            if(item[0] === element[0] && item[1] === element[1]) {
                ret = true;
            }
        });
        return ret;
    }

    addDirectionAvoidanceClause(i, j, t) {
        let {cnf} = this;
        const {c} = this;
        const avoid = this.avoidNeighborCells(i, j, t);
        this.getAdjacentNeighbors(i, j).forEach(cell => {
            if(!this.coordinateContainedWithin(cell, avoid)) {
                for(let color = 0; color < c; color++) {
                    cnf.push([this.getDirection(i, j, t) * -1, this.getCell(i, j, color) * -1,
                    this.getCell(cell[0], cell[1], color) * -1]);
                }
            }
        });
    }

    addLRClause(i, j) {
        const {length} = this;
        let {cnf} = this;
        if(0 <= j - 1 && j - 1 < length && 0 <= j + 1 && j + 1 < length) {
            this.addDirectionTypeClause(0, [i, j], [i, j-1], [i, j+1]);
            this.addDirectionAvoidanceClause(i, j, 0);
        }else {
            cnf.push([this.getDirection(i, j, 0) * -1]);
        }
    }
    
    addTBClause(i, j) {
        const {length} = this;
        let {cnf} = this;
        if(0 <= i - 1 && i - 1 < length && 0 <= i + 1 && i + 1 < length) {
            this.addDirectionTypeClause(1, [i, j], [i-1, j], [i+1, j]);
            this.addDirectionAvoidanceClause(i, j, 1);
        }else {
            cnf.push([this.getDirection(i, j, 1) * -1]);
        }
    }

    addTLClause(i, j) {
        const {length} = this;
        let {cnf} = this;
        if(0 <= i - 1 && i - 1 < length && 0 <= j - 1 && j - 1 < length) {
            this.addDirectionTypeClause(2, [i, j], [i-1, j], [i, j-1]);
            this.addDirectionAvoidanceClause(i, j, 2);
        }else {
            cnf.push([this.getDirection(i, j, 2) * -1]);
        }
    }

    addTRClause(i, j) {
        const {length} = this;
        let {cnf} = this;
        if(0 <= i - 1 && i - 1 < length && 0 <= j + 1 && j + 1 < length) {
            this.addDirectionTypeClause(3, [i, j], [i-1, j], [i, j+1]);
            this.addDirectionAvoidanceClause(i, j, 3);
        }else {
            cnf.push([this.getDirection(i, j, 3) * -1]);
        }
    }

    addBLClause(i, j) {
        const {length} = this;
        let {cnf} = this;
        if(0 <= i + 1 && i + 1 < length && 0 <= j - 1 && j - 1 < length) {
            this.addDirectionTypeClause(4, [i, j], [i+1, j], [i, j-1]);
            this.addDirectionAvoidanceClause(i, j, 4);
        }else {
            cnf.push([this.getDirection(i, j, 4) * -1]);
        }
    }

    addBRClause(i, j) {
        const {length} = this;
        let {cnf} = this;
        if(0 <= i + 1 && i + 1 < length && 0 <= j + 1 && j + 1 < length) {
            this.addDirectionTypeClause(5, [i, j], [i+1, j], [i, j+1]);
            this.addDirectionAvoidanceClause(i, j, 5);
        }else {
            cnf.push([this.getDirection(i, j, 5) * -1]);
        }
    }
    
    addDirectionTypeClause(t, coord1, coord2, coord3) { //TODO ensure correctness
        let {cnf} = this;
        const {c} = this;
        let [i1, j1, i2, j2, i3, j3] = [coord1[0], coord1[1], coord2[0], coord2[1], coord3[0], coord3[1]];
        for(let color = 0; color < c; color++) {
            cnf.push([this.getDirection(i1, j1, t) * -1, this.getCell(i1, j1, color) * -1, 
            this.getCell(i2, j2, color)]);
            cnf.push([this.getDirection(i1, j1, t) * -1, this.getCell(i1, j1, color), 
                this.getCell(i2, j2, color) * -1]);
            cnf.push([this.getDirection(i1, j1, t) * -1, this.getCell(i1, j1, color) * -1, 
                this.getCell(i3, j3, color)]);
            cnf.push([this.getDirection(i1, j1, t) * -1, this.getCell(i1, j1, color), 
                this.getCell(i3, j3, color) * -1]);                
        }
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
        let {cnf} = this;
        const {c} = this;
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
        let {cnf} = this;
        const {c} = this;
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
        const {nodes} = this;
        nodes.forEach((row, i) => {
            row.forEach((node, j) => {
                let {n} = node;
                if(n === 0) {
                    this.addCellClause(i, j);
                }else {
                    this.addEndpointClause(i, j, n-1);
                }
            })
        });
    }

    bfs(i, j) {
        let {visited, output} = this;
        let queue = [];
        queue.push([i, j, []]);
        while(queue.length !== 0) {
            let currentNode = queue.shift();
            if(visited.includes(currentNode.slice(0, 2))) {
                return [true, output[currentNode[0]][currentNode[1]]];
            }
            visited.push(currentNode.slice(0, 2));
            this.getAdjacentNeighbors(currentNode[0], currentNode[1]).forEach(neighbor => {  //TODO MAKE SURE CORRECT
                if(output[currentNode[0]][currentNode[1]] === output[[neighbor[0]][neighbor[1]]]) {
                    queue.push(neighbor[0], neighbor[1], currentNode.slice(0, 2));
                }
            });
        }
        return [false];
    }

    constructCycleClauses(value) {
        const {length, output} = this;
        let {clauses} = this;
        for(let i = 0; i < length; i++) {
            for(let j = 0; j < length; j++) {
                if(output[i][j] === value) {
                    clauses.push(this.getCell(i, j, value-1) * -1);
                }
            }
        }
    }

    detectCycles() {
        const {length} = this;
        let {visited} = this;
        visited = [];
        this.clauses = [];
        for(let i = 0; i < length; i++) {
            for(let j = 0; j < length; j++) {
                if(!visited.includes([i, j])) {
                    let output = this.bfs(i, j);
                    if(output[0]) {
                        this.constructCycleClauses(output[1]);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    solve() {
        this.generateClauses();
    }


}