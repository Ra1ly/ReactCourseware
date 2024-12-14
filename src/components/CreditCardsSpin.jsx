import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import CreditCardForm from "./CardFormComponent.jsx";
import "../style/spinMenu.css";
import ReactCreditCards from 'react-credit-cards';
import plusImage from '../assets/plus50.png';

const SpinMenu = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(0);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const cards = [
        { number: "4916 1616 1616 1616", name: "Иван Иванов", expiry: "12/25", cvc: "123" },
        { number: "4024 1234 5678 9010", name: "Мария Петрова", expiry: "11/24", cvc: "456" },
        { number: "5123 4567 8910 1113", name: "Сергей Сидоров", expiry: "10/23", cvc: "789" },
    ];

    const totalCards = cards.length + 1; // Учитываем элемент с плюсом

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
                            <ReactCreditCards
                                number={cards[index].number}
                                name={cards[index].name}
                                expiry={cards[index].expiry}
                                cvc={cards[index].cvc}
                                focused="number"
                            />
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
        </div>
    );
};

export default SpinMenu;