import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { executeCode } from "../../pages/CodePage/api.js";
import "./style.css";
 
const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
 
  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
 
    try {
      setIsLoading(true);
 
      const result = await executeCode(language, sourceCode);
 
      const finalOutput =
        result.stdout ||
        result.stderr ||
        result.compile_output ||
        "No output";
 
      setOutput(finalOutput.split("\n"));
      setIsError(!!result.stderr);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <Box w="40%" height={"80vh"}>
      <button
        className="output-run-btn"
        data-loading={isLoading}
        disabled={isLoading}
        onClick={runCode}
      >
        {isLoading ? "Running…" : "Run Code"}
      </button>
 
      <div
        className={`output-console ${isError ? "output-console--error" : "output-console--normal"}`}
      >
        {output ? (
          output.map((line, i) => (
            <span key={i} className="output-line">{line}</span>
          ))
        ) : (
          <span className="output-empty">Click "Run Code" to see the output here</span>
        )}
      </div>
    </Box>
  );
};
 
export default Output;
 