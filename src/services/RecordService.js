import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/records';

export const listRecords = () => {
    return axios.get(REST_API_BASE_URL + '/get-list')
}