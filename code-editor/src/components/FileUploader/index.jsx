import React from "react";
import "./style.css";

const FileUploader = () => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        // Process the file content (CSV/Excel parsing logic will be added here)
        console.log(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="file-uploader">
      <h2>Import Users</h2>
      <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
      <button>Upload File</button>
    </div>
  );
};

export default FileUploader;
