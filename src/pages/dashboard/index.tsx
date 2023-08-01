import React, { useEffect } from "react";
import "./dashboard.scss";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../navigation/Navbar";
import { LocalStore } from "../../utils/storage.utils";
import SidebarComponent from "../navigation/Sidebar";

function DashboardHome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform authentication check here
    const isAuthenticated = LocalStore.get("user")?.access_token;

    if (!isAuthenticated) {
      // navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex flex-row min-h-screen">
      <SidebarComponent />
      <main className="w-10/12 flex flex-col flex-grow ml-[16.675%]  transition-all duration-150 ease-in">
        <Navbar />
        <div className="flex flex-col flex-grow p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardHome;
