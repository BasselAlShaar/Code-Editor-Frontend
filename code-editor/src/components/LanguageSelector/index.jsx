import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { LANGUAGE_IDS } from "../../pages/CodePage/constants.js";
import "./style.css";

const languages  = Object.keys(LANGUAGE_IDS);
const ACTIVE_COL = "blue.400";

const LanguageSelector = ({ language, onSelect }) => (
  <Box className="lang-selector-wrap">
    <Menu isLazy>
      <MenuButton as={Button}>{language}</MenuButton>
      <MenuList bg="#161b22" zIndex={1000}>
        {languages.map((lang) => (
          <MenuItem
            key={lang}
            color={lang === language ? ACTIVE_COL : ""}
            bg={lang === language ? "gray.900" : "transparent"}
            _hover={{ color: ACTIVE_COL, bg: "gray.900" }}
            onClick={() => onSelect(lang)}
          >
            {lang}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  </Box>
);

export default LanguageSelector;
