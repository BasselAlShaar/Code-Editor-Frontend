import { Box } from "@chakra-ui/react";
import CodeEditor from "../../components/CodeEditor";
import './style.css'
function CodePage() {
  return (
    <Box
      height="700px"
      bg="#0f0a19"
      color="gray.500"
      px={6}
      py={8}
    >
      <CodeEditor />
    </Box>
  );
}

export default CodePage;
