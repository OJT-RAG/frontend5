import React, { useState } from "react";
import { Layout } from "antd";
import StaffSidebar from "./StaffSidebar.jsx";
import StaffDashboard from "./Dashboard/StaffDashboard.jsx";
import SemesterManagement from "./Semester/SemesterManagement.jsx";

const { Sider, Content } = Layout;

const StaffsLayout = () => {
  const [activeModule, setActiveModule] = useState("dashboard");

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      
      {/* SIDEBAR */}
      <Sider width={280} style={{ background: "transparent" }}>
        <StaffSidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
        />
      </Sider>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "20px" }}>
        {activeModule === "dashboard" && <StaffDashboard />}
        {activeModule === "semester" && <SemesterManagement />}
      </div>

    </Layout>
  );
};

export default StaffsLayout;