from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# Define the Todo model
class Todo(db.Model):
    id = db.Column(db.String(36), primary_key=True)  # UUID as a string
    task = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    description = db.Column(db.Text, nullable=True)  # Markdown description (nullable)
    tags = db.Column(db.String(200), nullable=True)  # Tags stored as comma-separated string
    lists = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "task": self.task,
            "completed": self.completed,
            "description": self.description,
            "tags": self.tags.split(",") if self.tags else [],
            "lists": self.lists.split(",") if self.lists else ["Active"]
        }


def reset_database():
    """Resets the database to the initial in-memory todos state."""
    db.drop_all()
    db.create_all()

    # Define the in-memory todos
    initial_todos = {
        "6a0273d7-7438-45d8-bf35-469ab2c37e3e":
            {
                "completed": False,
                "id": "6a0273d7-7438-45d8-bf35-469ab2c37e3e",
                "task": "Feed the cat!",
                "description": "## buy food",
                "tags": "important",
                "lists": "Active,Home"
            },
        "7a0273d7-7438-45d8-bf35-469ab2c37e3e":
            {
                "completed": True,
                "id": "7a0273d7-7438-45d8-bf35-469ab2c37e3e",
                "task": "Solve coding problem",
                "description": "- look at files\n- look at code",
                "tags": "important",
                "lists": "Archived,Work"
            },
        "7a0273d7-7438-45d9-bf35-469ab2c37e3e":
            {
                "completed": False,
                "id": "7a0273d7-7438-45d9-bf35-469ab2c37e3e",
                "task": "touch grass",
                "description": "**you got this**",
                "tags": "quick",
                "lists": "Active,Work"
            }
    }

    for todo_id, todo_data in initial_todos.items():
        new_todo = Todo(
            id=todo_id,
            task=todo_data['task'],
            completed=todo_data['completed'],
            description=todo_data.get('description', ""),
            tags=todo_data.get('tags', ""),
            lists=todo_data.get('lists', "")
        )
        db.session.add(new_todo)

    db.session.commit()
