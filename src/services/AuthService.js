import axios from "axios";
const REST_API_BASE_URL = 'http://localhost:8080/users/';
const register = (username, email, password) => {
    return axios.post(REST_API_BASE_URL + "register", {
        username,
        email,
        password,
    });
};

const login = (username, password) => {
    return axios
        .post(REST_API_BASE_URL + "login", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.username) {
                sessionStorage.setItem("user", JSON.stringify(response.data));
                console.log(JSON.stringify(response.data))
            }

            return response.data;
        });
};

const logout = () => {
    sessionStorage.removeItem("user");
    return axios.post(REST_API_BASE_URL + "logout").then((response) => {
        return response.data;
    });
};

const getCurrentUser = () => {
    return JSON.parse(sessionStorage.getItem("user"));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
}

export default AuthService;