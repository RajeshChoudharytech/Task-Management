import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTask.css'; // Import the CSS file

function AddTask() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8000/api/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        });

        if (response.ok) {
            navigate('/');
        } else {
            console.error('Error creating task');
        }
    };

    return (
        <div className="add-task-container">
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>

            <h1 className="add-task-title">Add Task</h1>
            <form className="add-task-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    required
                />
                <textarea
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea-field"
                    required
                />
                <button type="submit" className="submit-button">Add Task</button>
            </form>
        </div>
    );
}

export default AddTask;
