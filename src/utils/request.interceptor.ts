import axios from "axios";
import { LocalStore } from "./storage.utils";

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    const urlPath = !config.url?.includes('/auth');
    const headers = config.headers;
    if (urlPath && !headers.Authorization) {
        headers.Authorization = `Bearer ${LocalStore.get('token')}`
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    console.log('Response interceptor:', response);
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});


export default axios;