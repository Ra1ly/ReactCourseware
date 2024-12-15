import axios from "axios";
import AuthService from "./AuthService.js";

const REST_API_BASE_URL = 'http://localhost:8080/records';

export const listUserRecords = () => {
    return axios.get(REST_API_BASE_URL + `/get-user-records?userId=${AuthService.getCurrentUser().id}`)
}
export const addRecord = (record) => {
    return axios.post(REST_API_BASE_URL + `/add-record`, record)
}
export const listCategories = () => {
    return axios.get('http://localhost:8080/categories/get-list')
}