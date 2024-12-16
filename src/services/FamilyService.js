import axios from "axios";
import AuthService from "./AuthService.js";

const REST_API_BASE_URL = 'http://localhost:8080/families';

export const createFamily = (familyName) => {
    const user = AuthService.getCurrentUser();
    return axios.post(REST_API_BASE_URL + `/create-family?familyName=${familyName}`,user)
        .then((response) => {
            if (response.data.familyName) {
                sessionStorage.setItem("family", JSON.stringify(response.data));
                console.log(JSON.stringify(response.data));
            }
            return response.data;
        });
}

export const getCurrentFamily = () =>{
    return JSON.parse(sessionStorage.getItem("family"));
}

export const getFamilyByUser = () => {
    const user = AuthService.getCurrentUser();
    axios.get(REST_API_BASE_URL + '/get-family-by-user?userId='+user.id)
        .then((response) => {
            if (response.data) {
                sessionStorage.setItem("family", JSON.stringify(response.data));
                console.log(JSON.stringify(response.data));
            }
            return response.data;
        });
}

export const joinFamilyByInvitationCode= (code) => {
    const user = AuthService.getCurrentUser();
    return axios.post(REST_API_BASE_URL + `/join-family-by-code?invitationCode=${code}`,user)
        .then((response) => {
            if (response.data.familyName) {
                sessionStorage.setItem("family", JSON.stringify(response.data));
                console.log(JSON.stringify(response.data));
            }
            return response.data;
        });
}

export const leaveFamily = () => {
    const user = AuthService.getCurrentUser();
    const family = getCurrentFamily();
    return axios.post(REST_API_BASE_URL + '/leave',{
        family: family,
        user: user
    })
        .then((response) => {
            if (response.data.familyName) {
                sessionStorage.setItem("family", JSON.stringify(response.data));
                console.log(JSON.stringify(response.data));
            }
            return response.data;
        });
}

export const getFamilyUsers = () => {
    const family = getCurrentFamily();
    return axios.get(REST_API_BASE_URL + `/get-family-users?familyId=${family.id}`)
        .then((response) => {
            if (response.data) {
              //  console.log(JSON.stringify(response.data));
            }
            return response.data;
        });
}

export const listFamilyRecords = () => {
    return axios.get(REST_API_BASE_URL + `/get-family-records?familyId=${getCurrentFamily().id}`)
}
