import { useRef, useState, useEffect } from "react";
import { Box, HStack, Select } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "../LanguageSelector";
import { CODE_SNIPPETS } from "../../pages/CodePage/constants";
import Output from "../Output";
import Button from "../../base/Button";
import Input from "../../base/Input";
import Popup from "../../base/Popup";
import FileSaver from "file-saver";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("python");
  const [savedCodes, setSavedCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [codeTitle, setCodeTitle] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language] || ""); // Default to empty string if no snippet is available
  };

  const saveHandler = async () => {
    const token = localStorage.getItem("user-token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/codes", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: value,
          title: codeTitle,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        throw new Error(`Unexpected response: ${errorText}`);
      }

      const data = await response.json();
      if (response.ok) {
        setSavedCodes((prev) => [...prev, data.code]);
        togglePopup();
        // No need to reload the page, use the state to update UI
      } else {
        console.error("Error saving code:", data);
      }
    } catch (error) {
      console.error("Error saving code:", error.message);
    }
  };

  useEffect(() => {
    const fetchSavedCodes = async () => {
      const token = localStorage.getItem("user-token");

      try {
        const response = await fetch("http://127.0.0.1:8000/api/codes", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSavedCodes(data.codes || []);
        } else {
          console.error("Error fetching saved codes:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching saved codes:", error);
      }
    };

    fetchSavedCodes();
  }, []);

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
    FileSaver.saveAs(blob, `${codeTitle || "untitled"}.${extension}`);
  };

  return (
    <Box width={"99.1vw"} >
      <HStack spacing={220} pb={'15px'} className="flex row">
        <Box pl={"5px"} w="41vw">
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            options={{
              minimap: {
                enabled: false,
                fontSize: 16,
              },
            }}
            height="75vh"
            //width="120%"
            width={'55vw'}
            theme="vs-dark"
            language={language}
            value={selectedCode || value}
            onMount={onMount}
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
        pt={'5px'}
        spacing={20}
      >
        <div className="flex row gap wrap">
          <Input placeHolder={"Code Name"} onTextChange={(e) => setCodeTitle(e.target.value)} />
          <Button text="Save" onClick={saveHandler} />
          {isPopupVisible && <Popup caution={"Thanks!"} message="Code Saved" onClose={() => setIsPopupVisible(false)} />}
        </div>

        <div className="flex row wrap align-items">
          <Select bgColor="#1872c0" textColor="#fff" placeholder="Select saved code" onChange={(e) => setSelectedCode(e.target.value)}>
            {savedCodes.map((code) => (
              <option key={code.id} value={code.content}>
                {code.title}
              </option>
            ))}
          </Select>
        </div>

        <Button text="Download" onClick={downloadHandler} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
