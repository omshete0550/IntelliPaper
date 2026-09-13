import Sidebar from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
