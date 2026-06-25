import React, { useState, useRef } from "react";
import axios from "axios";
import "./style.css";

const FileUploader = () => {
  const [file, setFile]     = useState(null);
  const inputRef            = useRef();
  const token               = localStorage.getItem("user-token");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleFileUpload = async () => {
    if (!file) { alert("Select a file first."); return; }
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("http://localhost:8000/api/admin/import-users", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
    } catch {}
  };

  return (
    <div className="file-uploader">
      <p className="file-uploader-label">Import users from a CSV or Excel file.</p>

      <div className="file-drop-zone" onClick={() => inputRef.current?.click()}>
        {file ? null : "Click to choose a .csv, .xlsx, or .xls file"}
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
        />
      </div>

      {file && <span className="file-selected-name">// {file.name}</span>}

      <button
        className="btn btn-ghost"
        style={{ fontSize: 12, padding: '7px 16px', alignSelf: 'flex-start' }}
        onClick={handleFileUpload}
      >
        Upload
      </button>
    </div>
  );
};

export default FileUploader;
