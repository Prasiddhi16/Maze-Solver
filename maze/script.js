class MazeSolver {
    constructor() {
        this.GRID_SIZE = 20;
        this.grid = [];
        this.currentTool = 'wall';
        this.algorithm = 'bfs';
        this.startPos = null;
        this.endPos = null;
        this.isDrawing = false;
        this.isSolving = false;

        this.initializeGrid();
        this.setupEventListeners();
        this.renderGrid();
    }

    initializeGrid() {
        this.grid = Array(this.GRID_SIZE).fill(null).map(() =>
            Array(this.GRID_SIZE).fill('empty')
        );
    }

    setupEventListeners() {
        document.getElementById('wallBtn').addEventListener('click', () => this.setTool('wall'));
        document.getElementById('eraseBtn').addEventListener('click', () => this.setTool('erase'));
        document.getElementById('startBtn').addEventListener('click', () => this.setTool('start'));
        document.getElementById('endBtn').addEventListener('click', () => this.setTool('end'));

        document.getElementById('dfsBtn').addEventListener('click', () => this.setAlgorithm('dfs'));
        document.getElementById('bfsBtn').addEventListener('click', () => this.setAlgorithm('bfs'));

        document.getElementById('solveBtn').addEventListener('click', () => this.solveMaze());
        document.getElementById('clearPathBtn').addEventListener('click', () => this.clearPath());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAll());

        const gridElement = document.getElementById('grid');
        gridElement.addEventListener('mousedown', (e) => this.startDrawing(e));
        gridElement.addEventListener('mousemove', (e) => this.draw(e));
        gridElement.addEventListener('mouseup', () => this.stopDrawing());
        gridElement.addEventListener('mouseleave', () => this.stopDrawing());
    }

    setTool(tool) {
        this.currentTool = tool;
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));

        if (tool === 'wall') document.getElementById('wallBtn').classList.add('active');
        if (tool === 'erase') document.getElementById('eraseBtn').classList.add('active');
        if (tool === 'start') document.getElementById('startBtn').classList.add('active');
        if (tool === 'end') document.getElementById('endBtn').classList.add('active');
    }

    setAlgorithm(algo) {
        this.algorithm = algo;
        document.querySelectorAll('.algo-btn').forEach(btn => btn.classList.remove('active'));

        if (algo === 'dfs') {
            document.getElementById('dfsBtn').classList.add('active');
            this.updateAlgorithmInfo('Depth-First Search', 'DFS explores deeply along each branch before backtracking. It uses a stack (LIFO) and may find a solution quickly depending on the maze structure.');
        } else {
            document.getElementById('bfsBtn').classList.add('active');
            this.updateAlgorithmInfo('Breadth-First Search', 'BFS explores all neighbors at the current depth before moving to the next level. It uses a queue (FIFO) and guarantees the shortest path.');
        }
    }

    updateAlgorithmInfo(title, description) {
        const infoBox = document.querySelector('.info-box');
        infoBox.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.draw(e);
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    draw(e) {
        if (!this.isDrawing || this.isSolving) return;

        const gridElement = document.getElementById('grid');
        const rect = gridElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const cellSize = 36;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);

        if (row >= 0 && row < this.GRID_SIZE && col >= 0 && col < this.GRID_SIZE) {
            this.setCellValue(row, col, this.currentTool);
            this.renderGrid();
        }
    }

    setCellValue(row, col, value) {
        if (value === 'wall') {
            if (this.grid[row][col] !== 'start' && this.grid[row][col] !== 'end') {
                this.grid[row][col] = 'wall';
            }
        } else if (value === 'erase') {
            this.grid[row][col] = 'empty';
        } else if (value === 'start') {
            if (this.startPos) {
                this.grid[this.startPos.row][this.startPos.col] = 'empty';
            }
            this.startPos = { row, col };
            this.grid[row][col] = 'start';
        } else if (value === 'end') {
            if (this.endPos) {
                this.grid[this.endPos.row][this.endPos.col] = 'empty';
            }
            this.endPos = { row, col };
            this.grid[row][col] = 'end';
        }
    }

    renderGrid() {
        const gridElement = document.getElementById('grid');
        gridElement.innerHTML = '';

        for (let row = 0; row < this.GRID_SIZE; row++) {
            for (let col = 0; col < this.GRID_SIZE; col++) {
                const cell = document.createElement('div');
                cell.className = `cell ${this.grid[row][col]}`;
                gridElement.appendChild(cell);
            }
        }
    }

    async solveMaze() {
        if (!this.startPos || !this.endPos) {
            alert('Please set both start and end points!');
            return;
        }

        this.isSolving = true;
        document.getElementById('solveBtn').disabled = true;

        const response = await fetch('http://127.0.0.1:5000/solve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grid: this.grid,
                start: this.startPos,
                end: this.endPos,
                algorithm: this.algorithm
            })
        });

        const result = await response.json();

        await this.animate(result.visitedOrder, result.path);

        this.isSolving = false;
        document.getElementById('solveBtn').disabled = false;
    }

    async animate(visitedOrder, path) {
        for (const pos of visitedOrder) {
            if (this.grid[pos.row][pos.col] !== 'start' && this.grid[pos.row][pos.col] !== 'end') {
                this.grid[pos.row][pos.col] = 'visited';
            }
            this.renderGrid();
            await this.sleep(10);
        }

        for (const pos of path) {
            if (this.grid[pos.row][pos.col] !== 'start' && this.grid[pos.row][pos.col] !== 'end') {
                this.grid[pos.row][pos.col] = 'path';
            }
            this.renderGrid();
            await this.sleep(30);
        }
    }

    clearPath() {
        for (let row = 0; row < this.GRID_SIZE; row++) {
            for (let col = 0; col < this.GRID_SIZE; col++) {
                if (this.grid[row][col] === 'visited' || this.grid[row][col] === 'path') {
                    this.grid[row][col] = 'empty';
                }
            }
        }
        this.renderGrid();
    }

    clearAll() {
        this.initializeGrid();
        this.startPos = null;
        this.endPos = null;
        this.renderGrid();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MazeSolver();
});