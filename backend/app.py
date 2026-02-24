from flask import Flask,request,jsonify
app=Flask(__name__)
from flask_cors import CORS
from collections import deque
CORS(app)

def bfs(grid,start,end):
     
          rows,cols=len(grid),len(grid[0])
          visited=set()#to prevent infinite loops
          queue= deque([(start,[start])])

          visited_order=[]
          while queue:
            (r,c),path=queue.popleft()
            visited_order.append({"row": r, "col": c})
            if (r, c) == end:
             return visited_order, [{"row": x, "col": y} for x, y in path]
            
            for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
                    nr, nc = r+dr, c+dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != "wall" and (nr,nc) not in visited:
                        visited.add((nr,nc))
                        queue.append(((nr,nc), path+[(nr,nc)]))

          return visited_order, []  # no path found

def dfs(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    visited = set()
    stack = [(start, [start])]
    visited_order = []

    while stack:
        (r, c), path = stack.pop()
        if (r, c) in visited:
            continue
        visited.add((r, c))
        visited_order.append({"row": r, "col": c})

        if (r, c) == end:
            return visited_order, [{"row": x, "col": y} for x, y in path]

        # Explore neighbors
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != "wall":
                stack.append(((nr,nc), path+[(nr,nc)]))

    return visited_order, []

@app.route('/solve', methods=['POST'])    
def solve():
        data = request.json
        grid= data['grid']
        start=(data['start']['row'],data['start']['col'])
        end = (data['end']['row'], data['end']['col'])
        algorithm = data['algorithm']

        if algorithm == 'bfs':
            visitedOrder, path = bfs(grid, start, end)
        else:
            visitedOrder, path = dfs(grid, start, end)

        return jsonify({
            "visitedOrder": visitedOrder,
            "path": path
     })


if __name__ == '__main__':
    app.run(debug=True)
    