import axios from 'axios';
import baseUrl from '../constant/baseUrl';

export const loginApi = axios.create({
  baseURL: baseUrl,
});
