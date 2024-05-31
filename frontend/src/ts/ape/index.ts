import endpoints from "./endpoints";
import { buildHttpClient } from "./adapters/axios-adapter";
import { envConfig } from "../constants/env-config";
import axios from "axios";

const API_PATH = "";
const BASE_URL = envConfig.backendUrl;
const API_URL = `${BASE_URL}${API_PATH}`;

const httpClient = buildHttpClient(API_URL, 10_000);
const axiosClient = axios.create({
  baseURL: "",
  timeout: 10_000,
});

// API Endpoints
const Ape = {
  users: new endpoints.Users(httpClient),
  configs: new endpoints.Configs(httpClient),
  results: new endpoints.Results(httpClient),
  psas: new endpoints.Psas(httpClient),
  quotes: new endpoints.Quotes(httpClient),
  leaderboards: new endpoints.Leaderboards(httpClient),
  presets: new endpoints.Presets(httpClient),
  publicStats: new endpoints.Public(httpClient),
  apeKeys: new endpoints.ApeKeys(httpClient),
  configuration: new endpoints.Configuration(httpClient),
  usersV2: new endpoints.UsersV2(BASE_URL, axiosClient),
};

export default Ape;
