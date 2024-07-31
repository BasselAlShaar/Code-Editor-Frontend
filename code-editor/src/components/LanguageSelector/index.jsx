import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../../pages/CodePage/constants";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "blue.400";

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <Box ml={2} mb={4} position="relative">
      <Text mb={2} fontSize="lg" color={'white'}>
      </Text>
      <Menu isLazy>
        <MenuButton as={Button} position="relative" zIndex={1}>
          {language}
        </MenuButton>
        <MenuList
          bg="#110c1b"
          zIndex={1000} // Ensure it appears above other content
          position="absolute"
          top="100%" // Position right below the MenuButton
          left={0} // Align with the left edge of MenuButton
          mt={1} // Optional margin to create space between the button and the menu
        >
          {languages.map(([lang, version]) => (
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
              &nbsp;
              <Text as="span" color="gray.600" fontSize="sm">
                ({version})
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
