import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TaskDetails.css'; // Import the CSS file

function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize the navigate function
    const [task, setTask] = useState(null);

    // WebSocket connection for real-time task updates
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/tasks/');

        socket.onopen = () => console.log('Connected to WebSocket server');

        socket.onmessage = (event) => {
            const updatedTask = JSON.parse(event.data);
            if (updatedTask.task_id === id) {
                setTask((prevTask) => ({ ...prevTask, status: updatedTask.status }));
            }
        };

        socket.onclose = () => console.log('WebSocket connection closed');

        return () => socket.close();
    }, [id]);

    // Fetch task details from the API
    useEffect(() => {
        fetch(`http://localhost:8000/api/tasks/${id}/`)
            .then((response) => response.json())
            .then((data) => setTask(data))
            .catch((error) => console.error('Error fetching task details:', error));
    }, [id]);

    if (!task) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="task-details-container">
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            <h1 className="task-details-title">Task Details</h1>
            <div className="task-details-content">
                <p><strong>ID:</strong> {task.id}</p>
                <p><strong>Title:</strong> {task.title}</p>
                <p><strong>Description:</strong> {task.description}</p>
                <p><strong>Status:</strong> <span className={`status-label ${task.status.toLowerCase()}`}>{task.status}</span></p>
                <p><strong>Created At:</strong> {new Date(task.created_at).toLocaleDateString()}</p>
            </div>
        </div>
    );
}

export default TaskDetails;
