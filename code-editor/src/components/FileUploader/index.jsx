import React, { useState } from "react";
import axios from "axios";
import "./style.css";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("user-token");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/import-users",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="file-uploader">
      <h2>Import Users</h2>
      <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload File</button>
    </div>
  );
};

export default FileUploader;
