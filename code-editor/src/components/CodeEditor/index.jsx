import { useRef, useState, useEffect } from "react";
import { Box, HStack, Select } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "../LanguageSelector";
import { CODE_SNIPPETS } from "../../pages/CodePage/constants";
import Output from "../Output";
import Button from "../../base/Button";
import axios from "axios";
import FileSaver from 'file-saver';

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [savedCodes, setSavedCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");

  const token = localStorage.getItem("jwtToken");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const saveHandler = async () => {
    try {
      const response = await axios.post(
        "/api/saveCode",
        { code: value, language },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user-token')}`,
          },
        }
      );
      alert("Code saved successfully!");
    } catch (error) {
      console.error("Error saving code:", error);
    }
  };

  const browseHandler = async () => {
    try {
      const response = await axios.get("/api/getSavedCodes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('user-token')}`,
        },
      });
      setSavedCodes(response.data);
    } catch (error) {
      console.error("Error fetching saved codes:", error);
    }
  };

  const handleCodeSelection = (event) => {
    const selectedCode = savedCodes.find(
      (code) => code.id === event.target.value
    );
    setValue(selectedCode.code);
    setSelectedCode(event.target.value);
  };

  const downloadHandler = () => {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    let extension = "";
    switch (language) {
      case "javascript":
        extension = "js";
        break;
      case "python":
        extension = "py";
        break;
        case "java":
        extension = "java";
        break;
        case "csharp":
        extension = "cs";
        break;
        case "php":
        extension = "php";
        break;
      default:
        extension = "txt";
    }
    FileSaver.saveAs(blob, `code.${extension}`);
  };

  useEffect(() => {
    if (selectedCode) {
      const selected = savedCodes.find((code) => code.id === selectedCode);
      if (selected) {
        setValue(selected.code);
      }
    }
  }, [selectedCode, savedCodes]);

  return (
    <Box width={"97.8vw"}>
      <HStack spacing={220} height={"600px"}>
        <Box pl={"25px"} w="41vw">
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            options={{
              minimap: {
                enabled: false,
                fontSize: 16,
              },
            }}
            height="75vh"
            width="55vw"
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </Box>
        <Output editorRef={editorRef} language={language} />
      </HStack>
      <HStack
        display={"flex"}
        flexDir={"row"}
        justifyContent={"space-between"}
        pb="20px"
        spacing={20}
      >
        <Button text="Save" onClick={saveHandler}></Button>
        <Button text="Browse" onClick={browseHandler}></Button>
        <Select placeholder="Select saved code" onChange={handleCodeSelection}>
          {savedCodes.map((code) => (
            <option key={code.id} value={code.id}>
              {code.name} {/* Assuming each code has a name property */}
            </option>
          ))}
        </Select>
        <Button text="Download" onClick={downloadHandler}></Button>
      </HStack>
    </Box>
  );
};

export default CodeEditor;
