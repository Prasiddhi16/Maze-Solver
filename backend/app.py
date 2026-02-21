from flask import Flask,request,jsonify
app=Flask(__name__)
from flask_cors import CORS
CORS(app)
@app.route('/slove',methods=['POST'])
def solve():
        data = request.json
        print(data)
        return jsonify({
        "visitedOrder": [],
        "path": []
    })

if __name__ == '__main__':
    app.run(debug=True)
    