import axios from "axios";
import { LANGUAGE_IDS } from "./constants";

const API = axios.create({
  baseURL: "https://ce.judge0.com",
});

export const executeCode = async (language, sourceCode) => {
  const response = await API.post(
    "/submissions?base64_encoded=false&wait=true",
    {
      source_code: sourceCode,
      language_id: LANGUAGE_IDS[language],
    }
  );

  return response.data;
};