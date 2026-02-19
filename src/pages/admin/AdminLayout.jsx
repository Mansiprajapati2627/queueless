import { Link, Outlet } from "react-router-dom";

const AdminLayout = ({ user, onLogout }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <h2>
              Queueless <span className="admin-badge">Admin</span>
            </h2>
          </div>

          <div className="admin-info">
            <div className="admin-avatar">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h4>{user?.name}</h4>
              <p>{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="nav-item">
            Dashboard
          </Link>

          <Link to="/admin/orders" className="nav-item">
            Orders
          </Link>

          <Link to="/admin/menu" className="nav-item">
            Menu
          </Link>

          <button className="nav-item" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;