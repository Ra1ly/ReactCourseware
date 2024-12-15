import axios from "axios";
import AuthService from "./AuthService.js";
const REST_API_BASE_URL = 'http://localhost:8080/users';

export const listUsers = () => {
    return axios.get(REST_API_BASE_URL + '/get-list')
}

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

export const getUserImage = async ()=>{
    try {
        const response = await axios.get(`http://localhost:8080/images/${AuthService.getCurrentUser().image}`, {
            responseType: 'arraybuffer',
        });
        console.log('Response data size:', response.data.byteLength);
        const base64Image = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        return `data:image/${AuthService.getCurrentUser().image.split('.').pop()};base64,${base64Image}`;
    } catch (error) {
        console.error("Error fetching user image:", error);
        throw error;
    }
}
