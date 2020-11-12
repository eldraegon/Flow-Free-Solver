export default class SAT {

    constructor(cnf, length, numColors) {
        this.legnth = length;
        this.cnf = cnf;
        this.numColors = numColors;
        this.solutionLength = length * length * numColors * 6;
        this.solution = []
        for(let i = 0; i < this.solutionLength; i++) this.solution.push(undefined);
        this.sortCnf();
        this.solve();
    }

    sortCnf() {
        this.cnf.sort(function(a, b) {
            return a.length() - b.length();
        });
    }
    solveTrivialClauses() {
        const {cnf, solutionLength, solution} = this;
        cnf.forEach(element => {
            if(element.length === 1) solution[element[0]] = element[0] < 0? false : true;
        });
    }
    solve() {
        let last = this.solveTrivialClauses();
    }
}