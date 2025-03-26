from flask import Flask, jsonify, request
from flask_cors import CORS
from uuid import uuid4
import os
from models import db, Todo

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Setup SQLAlchemy + SQLite
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'todos.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Initialize the database (create tables if they don't exist)
with app.app_context():
    db.create_all()


@app.route('/todos', methods=['GET'])
def get_todos():
    todos = Todo.query.all()
    todos_dict = {todo.id: todo.to_dict() for todo in todos}
    return jsonify(todos_dict)


@app.route('/todos', methods=['POST'])
def create_todo():
    data = request.json
    if not data or 'task' not in data:
        return jsonify({"error": "Task content is required"}), 400

    todo_id = str(uuid4())
    new_todo = Todo(
        id=todo_id,
        task=data['task'],
        completed=False,
        description=data.get('description', ""),
        tags=",".join(data.get('tags', []))
    )

    db.session.add(new_todo)
    db.session.commit()

    return jsonify(new_todo.to_dict()), 201


@app.route('/todos/<todo_id>', methods=['GET'])
def get_todo(todo_id):
    todo = db.session.get(Todo, todo_id)
    if not todo:
        return jsonify({"error": "Todo not found"}), 404
    return jsonify(todo.to_dict())


@app.route('/todos/<todo_id>', methods=['PATCH'])
def update_todo(todo_id):
    todo = db.session.get(Todo, todo_id)
    if not todo:
        return jsonify({"error": "Todo not found"}), 404

    data = request.json
    if 'task' in data:
        todo.task = data['task']
    if 'completed' in data:
        todo.completed = data['completed']
    if 'description' in data:
        todo.description = data['description']
    if 'tags' in data:
        todo.tags = ",".join(data['tags'])

    db.session.commit()
    return jsonify(todo.to_dict())


@app.route('/todos/<todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    todo = db.session.get(Todo, todo_id)
    if not todo:
        return jsonify({"error": "Todo not found"}), 404

    db.session.delete(todo)
    db.session.commit()
    return jsonify(todo.to_dict())


if __name__ == '__main__':
    app.run(debug=True)
