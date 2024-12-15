import axios from "axios";
import AuthService from "./AuthService.js";

const REST_API_BASE_URL = 'http://localhost:8080/cards/';

const addCard = (cardNumber,cardholderName,expiryDate,cvc) => {
    const user = AuthService.getCurrentUser()
    return axios.post(REST_API_BASE_URL, {
        user,
        cardNumber,
        cardholderName,
        expiryDate,
        cvc
    })
        .then(window.location.reload());
};

const getCards = () =>{
    const user = AuthService.getCurrentUser();
    return axios.get(REST_API_BASE_URL+user.id);
}


const deleteCard = (card) => {
    axios.post(REST_API_BASE_URL+'delete', card)
        .then(window.location.reload())
        .catch((error) => {
            console.error(error);
        });
}

const CardService = {
    addCard,
    getCards,
    deleteCard
}

export default CardService;