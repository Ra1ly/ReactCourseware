import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/users';

export const listUsers = () => {
    return axios.get(REST_API_BASE_URL + '/get-list')
}

export const createPerson = (person) => axios.post(REST_API_BASE_URL + '/register', person)

export const getPerson =  (personId) => axios.get(REST_API_BASE_URL+'/'+personId)

export const updatePerson = (personId, person) => axios.put(REST_API_BASE_URL + '/'+personId,person)