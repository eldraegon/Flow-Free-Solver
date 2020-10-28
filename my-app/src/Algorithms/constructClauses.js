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
        const ret = [];
        this.diff.forEach(element => {
            if(i + element[0] >= 0 && i + element[0] < this.length && j + element[1] >= 0 && j + element[1] < this.length) {
                ret.push([i + element[0], j + element[1]]);
            }
        });
        return ret;
    }

    
    generateClauses() {

    }
}