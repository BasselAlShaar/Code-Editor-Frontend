import React from "react";
import "./style.css";
import UserTable from "../../components/UserTable";
import FileUploader from "../../components/FileUploader";
import Navbar from "../../components/Navbar";

const Admin = () => (
  <>
    <Navbar />
    <div className="admin-page">
      <div className="admin-layout">
        <h1 className="admin-page-title">Admin</h1>

        <div className="admin-section">
          <div className="admin-section-header">// users</div>
          <div className="admin-section-body"><UserTable /></div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">// import</div>
          <div className="admin-section-body"><FileUploader /></div>
        </div>
      </div>
    </div>
  </>
);

export default Admin;
