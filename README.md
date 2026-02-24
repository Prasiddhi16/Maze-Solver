# Maze Solver (BFS & DFS Visualizer)

An interactive maze solver built with **JavaScript (frontend)** and **Flask (backend)**.  
Users can draw walls, set start and end points, and visualize how **Breadth-First Search (BFS)** and **Depth-First Search (DFS)** explore the maze.

##  Features
- Draw walls, erase cells, and set start/end points.
- Choose between **BFS** (shortest path guaranteed) and **DFS** (deep exploration).
- Animated visualization of search order and final path.
- Clear/reset options for paths or the entire grid.    

##  Requirements
- Python 3.9+ (tested with Python 3.13)
- Flask
- Flask-CORS

Install dependencies:
bash
pip install flask flask-cors


 Running Locally
1. Start the Backend
cd backend
python app.py
This will start Flask at:
http://127.0.0.1:5000

Open the Frontend
- Navigate to the frontend folder.
- Open index.html in your browser (double-click or use VS Code Live Server).
- The frontend will automatically connect to the backend at http://127.0.0.1:5000/solve.

## BFS vs DFS
- BFS (Breadth-First Search)
Explores level by level using a queue. Guarantees shortest path.
- DFS (Depth-First Search)
Explores deeply using a stack. Finds a path, but not always the shortest.
## Contributing
Pull requests are welcome!
For major changes, please open an issue first to discuss what you’d like to change.



<img width="1336" height="878" alt="image" src="https://github.com/user-attachments/assets/1f1c3853-2319-46f9-8155-222a1606b4f5" />


