# Nikola Kadovic 9/1/2020
import pycosat
import time
import json
import queue


class Solution:  # solves the given puzzle by reducing to SAT problem
    diff = [[0, 1], [1, 0], [-1, 0], [0, -1]]
    directions = {0: [[0, 1], [0, -1]],
                  1: [[1, 0], [-1, 0]],
                  2: [[-1, 0], [0, -1]],
                  3: [[-1, 0], [0, 1]],
                  4: [[1, 0], [0, -1]],
                  5: [[1, 0], [0, 1]]
                  }

    def __init__(self, points, length):  # constructor
        self.cnf = []
        self.points = points
        self.length = length
        self.c = len(points) // 2
        self.n = length * length * self.c
        self.output = []
        self.cycle_clause = []
        self.visited = []
        self.clauses = []

    def get_adjacent_neighbors(self, i, j):  # get neighbors only directly adjacent to coordinate (i,j)
        ret = []
        for d in self.diff:
            if 0 <= i + d[0] < self.length and 0 <= j + d[1] < self.length:
                ret.append([i + d[0], j + d[1]])
        return ret

    def get_cell(self, coord, color):  # given coordinate (i,j, color) return corresponding boolean variable number
        return (coord[0] * self.length * self.c) + (coord[1] * self.c) + color + 1

    def get_direction(self, coord, t):  # given coordinate (i,j,t) return corresponding boolean variable number)
        return self.n + (coord[0] * self.length * 6) + (coord[1] * 6) + t + 1

    def construct_direction_clause(self, t, i, j, k):  # given boolean variables  generate direction clause for them
        for color in range(self.c):
            self.cnf.append([self.get_direction(i, t) * -1, self.get_cell(i, color) * -1, self.get_cell(j, color)])
            self.cnf.append([self.get_direction(i, t) * -1, self.get_cell(i, color), self.get_cell(j, color) * -1])
            self.cnf.append([self.get_direction(i, t) * -1, self.get_cell(i, color) * -1, self.get_cell(k, color)])
            self.cnf.append([self.get_direction(i, t) * -1, self.get_cell(i, color), self.get_cell(k, color) * -1])

    def avoid_neighbors(self, coord, t):
        delta = self.directions[t]
        ret = []
        for [di, dj] in delta:
            ret.append([coord[0] + di, coord[1] + dj])
        return ret

    def construct_direction_avoidance_clause(self, start, t):  # Given a starting point and direction type adds to cnf
        # avoidance for all neighbors not associated with the direction type
        avoid = self.avoid_neighbors(start, t)
        for i in self.get_adjacent_neighbors(start[0], start[1]):
            if i not in avoid:
                for color in range(self.c):
                    self.cnf.append([self.get_direction(start, t) * -1, self.get_cell(start, color) * -1,
                                     self.get_cell(i, color) * -1])

    def lr(self, i, j):  # this function generates clauses for direction type left-right (# 0)
        if 0 <= j - 1 < self.length and 0 <= j + 1 < self.length:  # if it can be done
            self.construct_direction_clause(0, [i, j], [i, j - 1], [i, j + 1])
            self.construct_direction_avoidance_clause([i, j], 0)
        else:  # if it cannot be done place it into cnf
            self.cnf.append([self.get_direction([i, j], 0) * -1])

    def tb(self, i, j):  # this function generates clauses for direction type top-bottom (# 1)
        if 0 <= i - 1 < self.length and 0 <= i + 1 < self.length:
            self.construct_direction_clause(1, [i, j], [i - 1, j], [i + 1, j])
            self.construct_direction_avoidance_clause([i, j], 1)
        else:
            self.cnf.append([self.get_direction([i, j], 1) * -1])

    def tl(self, i, j):  # this function generates clauses for direction type top-left (# 2)
        if 0 <= i - 1 < self.length and 0 <= j - 1 < self.length:
            self.construct_direction_clause(2, [i, j], [i - 1, j], [i, j - 1])
            self.construct_direction_avoidance_clause([i, j], 2)
        else:
            self.cnf.append([self.get_direction([i, j], 2) * -1])

    def tr(self, i, j):  # this function generates clauses for direction type top-right (# 3)
        if 0 <= i - 1 < self.length and 0 <= j + 1 < self.length:
            self.construct_direction_clause(3, [i, j], [i - 1, j], [i, j + 1])
            self.construct_direction_avoidance_clause([i, j], 3)
        else:
            self.cnf.append([self.get_direction([i, j], 3) * -1])

    def bl(self, i, j):  # this function generates clauses for direction type bottom-left (# 4)
        if 0 <= i + 1 < self.length and 0 <= j - 1 < self.length:
            self.construct_direction_clause(4, [i, j], [i + 1, j], [i, j - 1])
            self.construct_direction_avoidance_clause([i, j], 4)
        else:
            self.cnf.append([self.get_direction([i, j], 4) * -1])

    def br(self, i, j):  # this function generates clauses for direction type bottom-right (# 5)
        if 0 <= i + 1 < self.length and 0 <= j + 1 < self.length:
            self.construct_direction_clause(5, [i, j], [i + 1, j], [i, j + 1])
            self.construct_direction_avoidance_clause([i, j], 5)
        else:
            self.cnf.append([self.get_direction([i, j], 5) * -1])

    def ensure_single_direction(self, i, j):  # this function ensures only one direction variable can ever be true
        expression = []
        for t in range(6):
            expression.append(self.get_direction([i, j], t))  # there must be at least one direction type for a cell
        self.cnf.append(expression)
        for t in range(6):
            for t1 in range(t + 1, 6):  # there cannot be 2 direction types for a cell
                self.cnf.append([self.get_direction([i, j], t) * -1, self.get_direction([i, j], t1) * -1])

    def generate_direction_clause(self, i, j):  # this function generate the direction clauses given coordinates (i, j)
        self.ensure_single_direction(i, j)
        self.lr(i, j)
        self.tb(i, j)
        self.tl(i, j)
        self.tr(i, j)
        self.bl(i, j)
        self.br(i, j)

    def end_point_clause(self, i, j):  # this function generates clauses for endpoint cells
        color = self.points.index([i, j]) // 2
        self.cnf.append([self.get_cell([i, j], color)])
        for k in range(self.c):
            if k != color:
                self.cnf.append([self.get_cell([i, j], k) * -1])
        t = []
        for [k, l] in self.get_adjacent_neighbors(i, j):
            t.append(self.get_cell([k, l], color))
        self.cnf.append(t)
        d = self.get_adjacent_neighbors(i, j)
        cnt = 1
        for [x, y] in d:
            for [m, l] in d[cnt:]:
                self.cnf.append([self.get_cell([x, y], color) * -1, self.get_cell([m, l], color) * -1])
            cnt += 1

    def cell_clause(self, i, j):  # this function generates clauses for non endpoint cells
        t = []
        for k in range(self.c):  # at least one color must be true
            t.append(self.get_cell([i, j], k))
        self.cnf.append(t)
        for k in range(self.c):
            for l in range(k + 1, self.c):
                self.cnf.append([self.get_cell([i, j], k) * -1,
                                 self.get_cell([i, j], l) * -1])  # no two colors can be true at same time
        self.generate_direction_clause(i, j)

    def construct_args(self):  # constructs clauses via cnf
        for i in range(self.length):
            for j in range(self.length):
                if [i, j] in self.points:
                    self.end_point_clause(i, j)
                else:
                    self.cell_clause(i, j)

    def bfs(self, i, j):  # searches for cycles (bfs)
        q = queue.Queue()
        q.put([i, j, []])
        while not q.empty():
            curr = q.get()
            if curr[:2] in self.visited:  # if we have already crossed this variable, hence there is a cycle
                return [True, self.output[curr[0]][curr[1]]]
            self.visited.append(curr[:2])
            for k in self.get_adjacent_neighbors(curr[0], curr[1]):
                if self.output[curr[0]][curr[1]] == self.output[k[0]][k[1]] and k != curr[2]:
                    q.put([k[0], k[1], [curr[0], curr[1]]])
        return [False]

    def construct_cycle_clauses(self, value):  # constructs clauses to prevent cycles
        for i in range(self.length):
            for j in range(self.length):
                if self.output[i][j] == value:
                    self.clauses.append(self.get_cell([i, j], value-1) * -1)

    def detect_cycles(self):  # detects cycles via bfs with map tracking visited nodes
        self.visited = []
        self.clauses = []
        for i in range(self.length):
            for j in range(self.length):
                if [i, j] not in self.visited:
                    output = self.bfs(i, j)
                    if output[0]:
                        self.construct_cycle_clauses(output[1])
                        return True
        return False

    def construct_table(self, solution):  # constructs table given list of boolean variables
        self.output.clear()
        for i in range(self.length):
            row = []
            for j in range(self.length):
                for color in range(self.c):
                    if self.get_cell([i, j], color) in solution:
                        row.append(color + 1)
            self.output.append(row)

    def solve(self):  # the default solving method
        self.construct_args()
        solution = pycosat.solve(self.cnf)
        if solution == "UNSAT":
            return
        self.construct_table(solution)
        while self.detect_cycles():
            self.cnf.append(self.clauses)
            solution = pycosat.solve(self.cnf)
            if solution == "UNSAT":
                return
            self.construct_table(solution)


def solve_console():
    try:
        with open('data.txt', 'r') as datafile:  # open file
            points = []
            length = int(datafile.readline())
            lines = datafile.readlines()
            for line in lines:
                points.append(json.loads(line))
    except FileNotFoundError:
        print("Error: data.txt file not detected!")
        exit()
    finally:
        print("Input: \n")
        print_input(points, length)
        solution = Solution(points, length)
        start = time.time()
        solution.solve()
        end = time.time()
        print("\nSolved in {:.3f} Seconds!\n".format(end - start))
        print_table(solution.output)


def print_input(points, length):  # this function prints the input to console given by the user
    for i in range(length):
        for j in range(length):
            if [i, j] in points:
                print(points.index([i, j]) // 2 + 1, end=' ')
            else:
                print('0', end=' ')
        print()


def print_table(table):  # this function prints a 2d list to console
    for i in table:
        for j in i:
            print(str(int(j)), end=' ')
        print()


if __name__ == "__main__":
    solve_console()
