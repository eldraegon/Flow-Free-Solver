export default class SAT {

    constructor(cnf, length, numColors) {
        this.legnth = length;
        this.cnf = cnf;
        this.numColors = numColors;
        this.solutionLength = length * length * numColors * 6;
        this.solution = []
        for(let i = 0; i < this.solutionLength; i++) this.solution.push(undefined);
        this.sort();
        this.solve();
    }

    sort() {
        this.cnf.sort(function(a, b) {
            return a.length() - b.length();
        });
    }
}