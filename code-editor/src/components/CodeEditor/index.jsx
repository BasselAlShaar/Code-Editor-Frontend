import { useRef, useState, useEffect } from "react";
import { Box, HStack, Select } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "../LanguageSelector";
import { CODE_SNIPPETS } from "../../pages/CodePage/constants";
import Output from "../Output";
import Button from "../../base/Button";
import Input from "../../base/Input"
import Popup from "../../base/Popup"
import FileSaver from 'file-saver';

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [savedCodes, setSavedCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");

  const [codeTitle,setCodeTitle]= useState("");

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
    setValue(CODE_SNIPPETS[language]);
  };



  const saveHandler = async () => {
    const token = localStorage.getItem('user-token');
    const userId = localStorage.getItem('user-id');
    
    console.log('Token:', token);
    console.log('User ID:', userId);

    try {
        console.log(codeTitle);
        const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}/code`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                content: value,
                title: codeTitle,
                user_id: userId,
            })
        });
        

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const errorText = await response.text();
            throw new Error(`Unexpected response: ${errorText}`);
        }

        const data = await response.json();

        if (response.ok) {
            console.log(data);
            togglePopup();
        } else {
            console.error("Error saving code:", data);
        }
    } catch (error) {
        console.error("Error saving code:", error.message);
    }
};

  
  
  
    
  
  const displayHandler = async () => {
    try {
      const response = await fetch("/api/getSavedCodes", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('user-token')}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        setSavedCodes(data);
      } else {
        console.error("Error fetching saved codes:", response.statusText);
      }
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
        <div className="flex row gap wrap">
          <Input placeHolder={'Code Name'} onTextChange={(e)=>{setCodeTitle(e.target.value)}}></Input>
          <Button text="Save" onClick={saveHandler}></Button>
          {isPopupVisible && <Popup caution={'Thanks'} message='Code Saved' onClose={()=>{setIsPopupVisible(false)}}></Popup>}
        </div>
       
       <div className="flex row wrap align-items">
            <Select bgColor='#ff4b2b' textColor={'#fff'} placeholder="Select saved code" onChange={handleCodeSelection}>
            {savedCodes.map((code) => (
              <option key={code.id} value={code.id}>
                {code.name} {/* Assuming each code has a name property */}
              </option>
            ))}
          </Select> 
          <Button text="Display Code" onClick={displayHandler}></Button>
       </div>

        <Button text="Download" onClick={downloadHandler}></Button>
      </HStack>
    </Box>
  );
};

export default CodeEditor;
