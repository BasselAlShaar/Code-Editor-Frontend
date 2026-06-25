import { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "../LanguageSelector";
import { CODE_SNIPPETS } from "../../pages/CodePage/constants.js";
import { executeCode } from "../../pages/CodePage/api.js";
import Popup from "../../base/Popup";
import FileSaver from "file-saver";
import "./style.css";

const CodeEditor = () => {
  const editorRef    = useRef();
  const [value, setValue]           = useState("");
  const [language, setLanguage]     = useState("python");
  const [savedCodes, setSavedCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [codeTitle, setCodeTitle]   = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Output state
  const [output, setOutput]     = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError]   = useState(false);

  const onMount = (editor) => { editorRef.current = editor; editor.focus(); };
  const onSelect = (lang) => { setLanguage(lang); setValue(CODE_SNIPPETS[lang] || ""); };

  // Fetch saved codes on mount
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("user-token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/codes", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (res.ok) { const d = await res.json(); setSavedCodes(d.codes || []); }
      } catch {}
    })();
  }, []);

  const saveHandler = async () => {
    const token = localStorage.getItem("user-token");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/codes", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: value, title: codeTitle }),
      });
      const d = await res.json();
      if (res.ok) { setSavedCodes((prev) => [...prev, d.code]); setIsPopupVisible(true); }
    } catch {}
  };

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const result = await executeCode(language, sourceCode);
      const out = result.stdout || result.stderr || result.compile_output || "No output";
      setOutput(out.split("\n"));
      setIsError(!!result.stderr);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const downloadHandler = () => {
    const ext = { javascript:"js", python:"py", java:"java", csharp:"cs", php:"php" }[language] || "txt";
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, `${codeTitle || "untitled"}.${ext}`);
  };

  return (
    <div className="code-editor-root">
      {/* Toolbar */}
      <div className="code-editor-toolbar">
        <div className="code-editor-toolbar-group">
          <input
            className="code-name-input"
            placeholder="untitled snippet"
            value={codeTitle}
            onChange={(e) => setCodeTitle(e.target.value)}
          />
          <button className="btn btn-primary" style={{ fontSize: 12, padding: '6px 14px' }} onClick={saveHandler}>
            Save
          </button>
        </div>

        <div className="code-editor-toolbar-sep" />

        <div className="code-editor-toolbar-group">
          <select
            className="code-select"
            onChange={(e) => setSelectedCode(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Load saved snippet…</option>
            {savedCodes.map((code) => (
              <option key={code.id} value={code.content}>{code.title}</option>
            ))}
          </select>
        </div>

        <div className="code-editor-spacer" />

        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }} onClick={downloadHandler}>
          ↓ Download
        </button>
      </div>

      {/* Split view */}
      <div className="code-editor-split">
        {/* Editor */}
        <div className="code-editor-left">
          <div className="code-editor-lang-bar">
            <LanguageSelector language={language} onSelect={onSelect} />
          </div>
          <div className="code-editor-monaco-wrap">
            <Editor
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                lineHeight: 22,
                padding: { top: 14 },
                scrollBeyondLastLine: false,
                renderLineHighlight: "gutter",
              }}
              height="100%"
              width="100%"
              theme="vs-dark"
              language={language}
              value={selectedCode || value}
              onMount={onMount}
              onChange={(v) => setValue(v)}
            />
          </div>
        </div>

        {/* Output */}
        <div className="code-editor-right">
          <div className="output-header">
            <span className="output-header-label">// output</span>
            <button
              className="output-run-btn"
              disabled={isLoading}
              onClick={runCode}
            >
              {isLoading ? "Running…" : "▶ Run"}
            </button>
          </div>
          <div className={`output-console ${isError ? "output-console--error" : "output-console--normal"}`}>
            {output
              ? output.map((line, i) => <span key={i} className="output-line">{line}</span>)
              : <span className="output-empty">Run your code to see output</span>
            }
          </div>
        </div>
      </div>

      {isPopupVisible && (
        <Popup caution="Saved" message="Snippet saved to your account." onClose={() => setIsPopupVisible(false)} />
      )}
    </div>
  );
};

export default CodeEditor;
