import { useRef, useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "../LanguageSelector";
import { CODE_SNIPPETS } from "../../pages/CodePage/constants";
import Output from "../Output";
import Button from "../../base/Button";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <Box width={'97.8vw'}>
      <HStack spacing={220} height={'600px'}>
        <Box pl={'25px'} w="41vw" >
          <LanguageSelector  language={language} onSelect={onSelect} />
          <Editor 
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="75vh"
            width='55vw'
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </Box>
        <Output editorRef={editorRef} language={language}  />
      </HStack>
      <HStack display={'flex'} flexDir={'row'} justifyContent={'space-between'} pb='20px' spacing={20} >
        <Button text="Save "></Button>
        <Button text="browse "></Button>
        <Button text="Download "></Button>
        </HStack>
    </Box>
  );
};

export default CodeEditor;
