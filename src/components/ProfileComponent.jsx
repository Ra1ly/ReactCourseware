import React, {useEffect, useState} from "react";
import AuthService from "../services/AuthService.js";
import { Modal, Button, Form, Card } from "react-bootstrap";
import "../style/profile.css";
import {updateUser, uploadImage} from "../services/UserService.js";

const Profile = () => {
    const currentUser = AuthService.getCurrentUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        realName: currentUser.realName,
        image: currentUser.image
    });
    const [imagePreview, setImagePreview] = useState(currentUser.imagePath);

    useEffect(() => {
        const storedImage = localStorage.getItem('userImage');
        if (storedImage) {
            setImagePreview(storedImage);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: file });
                setImagePreview(reader.result);
                localStorage.setItem('userImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imagePath = formData.imagePath;

            if (formData.image) {
                imagePath = await uploadImage(formData.image);
            }

            const updatedData = {
                ...formData,
                image: imagePath
            };
            console.log(updatedData);
            sessionStorage.setItem('user', JSON.stringify(updatedData));

            await updateUser(updatedData);

            setIsEditing(false);
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    return (
        <div className="container mt-5">
            <Card className="profile-card">
                <Card.Body>
                    <Card.Title className="text-center">
                        Профиль пользователя
                    </Card.Title>
                    <Card.Img
                        src={imagePreview}
                        alt="Profile"
                        style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '15px' }}
                    />

                    <Card.Text>
                        <strong>Имя пользователя</strong> {currentUser.username}
                    </Card.Text>
                    <Card.Text>
                        <strong>Настоящее имя:</strong> {currentUser.realName}
                    </Card.Text>
                    <Card.Text>
                        <strong>Email:</strong> {currentUser.email}
                    </Card.Text>
                    <Button variant="primary" onClick={() => setIsEditing(true)}>
                        Редактировать профиль
                    </Button>
                </Card.Body>
            </Card>

            <Modal show={isEditing} onHide={() => setIsEditing(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Имя пользователя:</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formRealName">
                            <Form.Label>Настоящее имя:</Form.Label>
                            <Form.Control
                                type="text"
                                name="realName"
                                value={formData.realName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formImage">
                            <Form.Label>Изображение профиля</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '10px' }}
                        />
                        <Button variant="primary" type="submit" style={{ marginTop: '15px' }}>
                            Сохранить изменения
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Profile;