import React, { useEffect, useState } from 'react';
import {Button, Modal} from 'react-bootstrap';
import CreditCardForm from "./CardFormComponent.jsx";
import "../style/spinMenu.css";
import ReactCreditCards from 'react-credit-cards';
import plusImage from '../assets/plus50.png';
import CardService from "../services/CardService.js";
import { FaTimes } from 'react-icons/fa';

const SpinMenu = () => {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(0);
    const [cards, setCards] = useState([]);
    const [cardToDelete, setCardToDelete] = useState(null);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const handleCloseConfirm = () => setShowConfirmModal(false);

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = () => {
        CardService.getCards()
            .then((response) => {
                setCards(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const deleteCard = (card) => {
        CardService.deleteCard(card)
            .then(() => {
                handleCloseConfirm();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const confirmDeleteCard = (card) => {
        setCardToDelete(card);
        setShowConfirmModal(true);
    };

    const totalCards = cards.length + 1;

    return (
        <div className="container mt-5">
            <div className="spin-menu-container">
                {Array.from({ length: totalCards }).map((_, index) => (
                    <div
                        key={index}
                        className="credit-card-container"
                        style={{ transform: `translateX(${(index - selectedCard) * 100}%)` }}
                        onClick={() => {
                            if (index === totalCards - 1) {
                                handleShow();
                            } else {
                                setSelectedCard(index);
                            }
                        }}
                    >
                        {index === totalCards - 1 ? (
                            <div className="add-card">
                                <img src={plusImage} alt="Add Card" className="add-card-image" />
                            </div>
                        ) : (
                            <div className="card-with-delete">
                                <ReactCreditCards
                                    number={cards[index].cardNumber}
                                    name={cards[index].cardholderName}
                                    expiry={cards[index].expiryDate}
                                    cvc="***"
                                    focused="number"
                                />
                                <button
                                    className="delete-card-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        confirmDeleteCard(cards[index]);
                                    }}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="pagination-controls">
                {Array.from({ length: totalCards }).map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${selectedCard === index ? 'active' : ''}`}
                        onClick={() => setSelectedCard(index)}
                    />
                ))}
            </div>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить кредитную карту</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreditCardForm />
                </Modal.Body>
            </Modal>


            <Modal show={showConfirmModal} onHide={handleCloseConfirm} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Подтвердите удаление</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы уверены, что хотите удалить эту карту?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="btn btn-danger" onClick={() => deleteCard(cardToDelete)}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SpinMenu;