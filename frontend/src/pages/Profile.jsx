import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, handleLogout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName(user?.name || "");
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.put("/api/users/me", { name });
      setMessage("Profile updated");
    } catch (err) {
      setMessage("Update failed");
    }
  };

  return (
    <div className="card">
      <h2>Profile</h2>
      <p>Email: {user?.email}</p>
      <form onSubmit={onSubmit}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
      {message && <p>{message}</p>}
      <button
        style={{ marginTop: "1rem" }}
        className="btn-secondary"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
