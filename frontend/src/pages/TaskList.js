import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './TaskList.css';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [filteredTasks, setFilteredTasks] = useState([]);

    // WebSocket for real-time task updates
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/tasks/');
        socket.onopen = () => console.log('Connected to WebSocket server');
        socket.onmessage = (event) => {
            const updatedTask = JSON.parse(event.data);
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === updatedTask.task_id ? { ...task, status: updatedTask.status } : task
                )
            );
        };
        socket.onclose = () => console.log('WebSocket connection closed');
        return () => socket.close();
    }, []);

    // Fetch tasks from API
    useEffect(() => {
        fetch('http://localhost:8000/api/tasks/')
            .then((response) => response.json())
            .then((data) => setTasks(data))
            .catch((error) => console.error('Error fetching tasks:', error));
    }, []);

    // Filter tasks by search term and status
    useEffect(() => {
        let filtered = tasks;
        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter) {
            filtered = filtered.filter(task => task.status === statusFilter);
        }
        setFilteredTasks(filtered);
    }, [tasks, searchTerm, statusFilter]);

    // Function to map status to CSS class
    const getStatusClass = (status) => {
        console.log(status);
        switch (status) {
            case 'queued':
                return 'status-queued';
            case 'in_progress':
                return 'status-inprogress';
            case 'completed':
                return 'status-completed';
            case 'failed':
                return 'status-failed';
            default:
                return '';
        }
    };

    return (
        <div className="tasklist-container">
            <header className="tasklist-header">
                <h1>Task List</h1>
                <Link to="/add-task">
                    <button className="add-task-btn">Add Task</button>
                </Link>
            </header>

            <div className="tasklist-controls">
                <input
                    type="text"
                    placeholder="Search tasks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="status-filter"
                >
                    <option value="">All Statuses</option>
                    <option value="queued">Queued</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            <ul className="tasklist">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <li key={task.id} className="task-item">
                            <span className="task-id">{task.id}</span>
                            <span className="task-title">{task.title}</span>
                            <span className="task-date">{new Date(task.created_at).toLocaleDateString()}</span>
                            <span className={`task-status ${getStatusClass(task.status)}`}>
                                {task.status}
                            </span>
                            <Link to={`/task/${task.id}`}>
                                <button className="view-task-btn">View</button>
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>No tasks found</p>
                )}
            </ul>
        </div>
    );
}

export default TaskList;
