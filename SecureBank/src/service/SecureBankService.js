import axios from 'axios';
import { Platform } from "react-native";


let SecureBankService = axios.create({
  baseURL: Platform.OS === "ios" ? 'https://.com/' : 'https://.com/',
  timeout: 10000,
});

export const setClientToken = token => {
    SecureBankService.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default SecureBankService;