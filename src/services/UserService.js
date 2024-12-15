import axios from "axios";
import AuthService from "./AuthService.js";
const REST_API_BASE_URL = 'http://localhost:8080/users';

export const listUsers = () => {
    return axios.get(REST_API_BASE_URL + '/get-list')
}

export const createPerson = (person) => axios.post(REST_API_BASE_URL + '/register', person)

export const getPerson =  (personId) => axios.get(REST_API_BASE_URL+'/'+personId)

export const updateUser = () =>{
    const user = AuthService.getCurrentUser();
    axios.post(REST_API_BASE_URL + '/update',user)
    .then((response) => {
    if (response.data.username) {
        sessionStorage.setItem("user", JSON.stringify(response.data));
        console.log(JSON.stringify(response.data));
    }
    return response.data;
});
}

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch('http://localhost:8080/images/upload', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        const imagePath = await response.text();
        console.log("Image uploaded:", imagePath);
        return imagePath;
    } else {
        console.error("Failed to upload image");
    }
};