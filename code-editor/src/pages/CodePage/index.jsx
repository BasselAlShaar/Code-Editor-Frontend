import CodeEditor from "../../components/CodeEditor";
import Navbar from "../../components/Navbar";
import "./style.css";

function CodePage() {
  return (
    <>
      <Navbar />
      <div className="code-page">
        <CodeEditor />
      </div>
    </>
  );
}

export default CodePage;
