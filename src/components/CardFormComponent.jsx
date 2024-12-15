import React, { useState } from 'react';
import ReactCreditCards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import CardService from "../services/CardService.js"

const CreditCardForm = () => {
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focused, setFocused] = useState('');
    const [error, setError] = useState('');

    const validateCardNumber = (cardNumber) => {
        const sanitizedNumber = cardNumber.replace(/\D/g, '');
        let sum = 0;
        let shouldDouble = false;

        for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(sanitizedNumber.charAt(i), 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }

        return sum % 10 === 0;
    };

    const validateCVC = (cvc) => {
        const sanitizedCVC = cvc.replace(/\D/g, '');
        return sanitizedCVC.length === 3;
    };

    const validateForm = () => {
        if (!number || !name || !expiry || !cvc) {
            setError('Пожалуйста, заполните все поля');
            return false;
        }
        if (!validateCardNumber(number)) {
            setError('Номер кредитной карточки не действителен');
            return false;
        }
        if (!validateCVC(cvc)) {
            setError('CVV должен состоять из 3 цифр');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log({ number, name, expiry, cvc });
            CardService.addCard(number,name,expiry,cvc);
        }
    };

    return (
        <div className="container mb-1">

            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="container mb-md-3">
                    <ReactCreditCards
                        number={number}
                        name={name}
                        expiry={expiry}
                        cvc={cvc}
                        focused={focused}
                    />
                </div>
                <div className="form-group">
                    <label>Номер карточки</label>
                    <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        onFocus={() => setFocused('number')}
                        className="form-control"
                        placeholder="1234 1234 1234 1234"
                        required
                        minLength={16}
                        maxLength={16}
                        pattern="\d{16}" // 16 цифр
                    />
                </div>
                <div className="form-group">
                    <label>Имя владельца</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocused('name')}
                        className="form-control"
                        placeholder="IVAN IVANOV"
                        required
                        pattern="^[A-Za-z]{2,} [A-Za-z]{2,}$" // Два латинских слова
                    />
                </div>
                <div className="form-group">
                    <label>Срок действия</label>
                    <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        onFocus={() => setFocused('expiry')}
                        className="form-control"
                        placeholder="MM/YY"
                        required
                        pattern="^(0[1-9]|1[0-2])\/\d{2}$" // Формат MM/YY
                    />
                </div>
                <div className="form-group">
                    <label>CVV</label>
                    <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        onFocus={() => setFocused('cvc')}
                        className="form-control"
                        placeholder="CVV"
                        required
                        minLength={3}
                        maxLength={3}
                        pattern="\d{3}" // 3 цифры
                    />
                </div>
                <div className="container text-center mt-3">
                    <button type="submit" className="btn btn-primary">Добавить карточку</button>
                </div>
            </form>
        </div>
    );
};

export default CreditCardForm;