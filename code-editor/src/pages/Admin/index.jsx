import React from "react";
import "./style.css";
import UserTable from "../../components/UserTable";
import FileUploader from "../../components/FileUploader";

const Admin = () => {
  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <div className="section">
        <UserTable />
      </div>
      <div className="section">
        <FileUploader />
      </div>
    </div>
  );
};

export default Admin;
