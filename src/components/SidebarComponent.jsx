import React, { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/sidebar.css';
import { Modal, Button, Form, CardImg } from "react-bootstrap";
import {getUserImage} from "../services/UserService.js";
import {createFamily, getFamilyByUser, joinFamilyByInvitationCode, leaveFamily} from "../services/FamilyService.js";

const MySidebar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user"));
    const [family, setFamily] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [showJoinFamilyModal, setShowJoinFamilyModal] = useState(false);
    const [showCreateFamilyModal, setShowCreateFamilyModal] = useState(false);
    const [inviteCode, setInviteCode] = useState("");
    const [familyName, setFamilyName] = useState("");

    useEffect(() => {
        const storedImage = localStorage.getItem('userImage');
        if (storedImage) {
            setImagePreview(storedImage);
        } else {
            const fetchUserImage = async () => {
                try {
                    const userImage = await getUserImage();
                    setImagePreview(userImage);
                    localStorage.setItem('userImage', userImage);
                } catch (error) {
                    console.error("Error fetching user image:", error);
                }
            };

            fetchUserImage();
        }

        const fetchFamily = async () => {
            try {
                const familyData = await getFamilyByUser();
                setFamily(familyData);
            } catch (error) {
                console.error("Error fetching family:", error);
            }
        };

        fetchFamily();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("family");
        localStorage.removeItem("userImage");
        navigate('/login');
    };

    const handleLeaveFamily = () => {
        leaveFamily();
        sessionStorage.setItem("family",null);
        setFamily(null);
        console.log("User has left the family.");
    };

    const handleJoinFamily = async () => {
        const newFamily = await joinFamilyByInvitationCode(inviteCode);
        sessionStorage.setItem("family", JSON.stringify(newFamily));
        setFamily(newFamily);
        console.log("Joining family with invite code:", inviteCode);
        setShowJoinFamilyModal(false);
    };

    const handleCreateFamily = async () => {
        const newFamily = await createFamily(familyName);
        sessionStorage.setItem("family", JSON.stringify(newFamily));
        setFamily(newFamily); // Обновляем состояние
        console.log("Creating family with name:", familyName);
        setShowCreateFamilyModal(false);
    };

    if (!user) return null;

    return (
        <Sidebar className="sidebar">
            <CardImg
                src={imagePreview}
                alt="User"
                style={{ width: '40%' }}
            />
            <Menu>
                <MenuItem onClick={() => navigate('/profile')}>Профиль</MenuItem>
                <SubMenu label="Семья">
                    {family ? (
                        <>
                            <MenuItem onClick={() => navigate("/family")}>{family.familyName}</MenuItem>
                            <MenuItem onClick={handleLeaveFamily}>Выйти из семьи</MenuItem>
                        </>
                    ) : (
                        <>
                            <MenuItem onClick={() => setShowJoinFamilyModal(true)}>Войти в семью</MenuItem>
                            <MenuItem onClick={() => setShowCreateFamilyModal(true)}>Создать семью</MenuItem>
                        </>
                    )}
                </SubMenu>
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
            </Menu>

            <Modal show={showJoinFamilyModal} onHide={() => setShowJoinFamilyModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Войти в семью</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="inviteCode">
                            <Form.Label>Код приглашения</Form.Label>
                            <Form.Control
                                type="text"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                placeholder="Введите код приглашения"
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleJoinFamily}>
                            Войти
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showCreateFamilyModal} onHide={() => setShowCreateFamilyModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Создать семью</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="familyName">
                            <Form.Label>Название семьи</Form.Label>
                            <Form.Control
                                type="text"
                                value={familyName}
                                onChange={(e) => setFamilyName(e.target.value)}
                                placeholder="Введите название семьи"
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleCreateFamily}>
                            Создать
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Sidebar>
    );
};

export default MySidebar;