import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, handleLogout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending"
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTasks = async () => {
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;

    const res = await api.get("/api/tasks", { params });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;

    await api.post("/api/tasks", form);
    setForm({ title: "", description: "", status: "pending" });
    fetchTasks();
  };

  const onDelete = async (id) => {
    await api.delete(`/api/tasks/${id}`);
    fetchTasks();
  };

  const onStatusChange = async (id, status) => {
    const task = tasks.find((t) => t._id === id);
    await api.put(`/api/tasks/${id}`, {
      ...task,
      status
    });
    fetchTasks();
  };

  const onSearchFilterSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  return (
    <div className="app-container">
      <div className="dashboard-layout">
        <div className="navbar">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.name}</p>
          </div>
          <div>
            <Link to="/profile" className="btn-secondary" style={{ marginRight: 8 }}>
              Profile
            </Link>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3>Create Task</h3>
          <form onSubmit={onSubmit}>
            <label>
              Title
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                required
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                rows={2}
                value={form.description}
                onChange={onChange}
              />
            </label>
            <label>
              Status
              <select
                name="status"
                value={form.status}
                onChange={onChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <button type="submit" className="btn-primary">
              Add Task
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Your Tasks</h3>
          <form
            onSubmit={onSearchFilterSubmit}
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1rem",
              flexWrap: "wrap"
            }}
          >
            <input
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <button type="submit" className="btn-secondary">
              Apply
            </button>
          </form>

          <div className="task-list">
            {tasks.length === 0 && <p>No tasks yet.</p>}
            {tasks.map((task) => (
              <div key={task._id} className="task-item">
                <div>
                  <h4>{task.title}</h4>
                  {task.description && <p>{task.description}</p>}
                  <span className="badge">{task.status}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button
                    onClick={() => onDelete(task._id)}
                    className="btn-secondary"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
