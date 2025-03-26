import pytest
from app import app, db
from models import reset_database


@pytest.fixture(scope="module")
def client():
    """Fixture to create a test client and reset the database before each test session."""
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_todos.db'

    with app.test_client() as client:
        with app.app_context():
            reset_database()
        yield client

        # Clean up the database file after all tests are done
        with app.app_context():
            db.drop_all()


def test_get_todos(client):
    """Test fetching all todos."""
    response = client.get('/todos')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert len(data) == 2  # Initial todos from `reset_database()`


def test_create_todo(client):
    """Test creating a new todo."""
    response = client.post('/todos', json={
        "task": "New Task",
        "description": "### Details\nA new task description.",
        "tags": ["important", "urgent"]
    })
    assert response.status_code == 201

    data = response.get_json()
    assert data['task'] == "New Task"
    assert data['description'] == "### Details\nA new task description."
    assert "important" in data['tags']
    assert "urgent" in data['tags']


def test_update_todo(client):
    """Test updating an existing todo."""
    # Fetch an existing todo to update
    response = client.get('/todos')
    todos = response.get_json()
    todo_id = list(todos.keys())[0]

    response = client.patch(f'/todos/{todo_id}', json={
        "task": "Updated Task",
        "completed": True,
        "description": "### Updated\nThis is an updated description.",
        "tags": ["updated", "modified"]
    })
    assert response.status_code == 200

    data = response.get_json()
    assert data['task'] == "Updated Task"
    assert data['completed'] is True
    assert data['description'] == "### Updated\nThis is an updated description."
    assert "updated" in data['tags']
    assert "modified" in data['tags']


def test_delete_todo(client):
    """Test deleting a todo."""
    # Fetch an existing todo to delete
    response = client.get('/todos')
    todos = response.get_json()
    todo_id = list(todos.keys())[0]

    response = client.delete(f'/todos/{todo_id}')
    assert response.status_code == 200

    # Verify the todo is deleted
    response = client.get(f'/todos/{todo_id}')
    assert response.status_code == 404


def test_get_todo_not_found(client):
    """Test getting a non-existent todo."""
    response = client.get('/todos/nonexistent-id')
    assert response.status_code == 404
    assert response.get_json()["error"] == "Todo not found"


def test_update_todo_not_found(client):
    """Test updating a non-existent todo."""
    response = client.patch('/todos/nonexistent-id', json={"task": "This won't work"})
    assert response.status_code == 404
    assert response.get_json()["error"] == "Todo not found"


def test_delete_todo_not_found(client):
    """Test deleting a non-existent todo."""
    response = client.delete('/todos/nonexistent-id')
    assert response.status_code == 404
    assert response.get_json()["error"] == "Todo not found"
