import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { LANGUAGE_IDS } from "../../pages/CodePage/constants.js";
import "./style.css";
 
const languages = Object.keys(LANGUAGE_IDS);
const ACTIVE_COLOR = "blue.400";
 
const LanguageSelector = ({ language, onSelect }) => {
  return (
    <Box ml={2} mb={4} position="relative" className="lang-selector-wrap">
      <Menu isLazy>
        <MenuButton as={Button} position="relative" zIndex={1}>
          {language}
        </MenuButton>
 
        <MenuList
          bg="#110c1b"
          zIndex={1000}
          position="absolute"
          top="100%"
          left={0}
          mt={1}
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang}
              color={lang === language ? ACTIVE_COLOR : ""}
              bg={lang === language ? "gray.900" : "transparent"}
              _hover={{
                color: ACTIVE_COLOR,
                bg: "gray.900",
              }}
              onClick={() => onSelect(lang)}
            >
              {lang}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
 
export default LanguageSelector;
 