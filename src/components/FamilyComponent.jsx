import React, { useEffect, useState } from 'react';
import {getCurrentFamily, getFamilyUsers} from "../services/FamilyService.js";
import {Card, Col, Row, Form, Tab, Tabs} from "react-bootstrap";
import FamilyRecordsComponent from "./FamilyRecordsComponent.jsx";
import FamilyPieChart from "./FamilyPieChart.jsx";
import FamilyLineChartComponent from "./FamilyLineChartComponent.jsx";

const FamilyComponent = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getFamilyUsers();
                setUsers(data);
                console.log(data);
            } catch (error) {
                console.error("Ошибка получения пользователей:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleCheckboxChange = (userId) => {
        setSelectedUsers(prevSelectedUsers => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter(id => id !== userId);
            } else {
                return [...prevSelectedUsers, userId];
            }
        });
    };



    return (
        <div className="user-list">
            <h2>Участники семьи {getCurrentFamily().familyName}</h2>
            <div className="invitation-code mb-3">
                <strong>Код приглашения:</strong> {getCurrentFamily().invitationCode}
            </div>
            <Row xs={1} md={2} lg={3} className="g-4">
                {users.length > 0 ? (
                    users.map((user) => (
                        <Col key={user.id}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Form.Check
                                        type="checkbox"
                                        id={`checkbox-${user.id}`}
                                        label={user.username}
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleCheckboxChange(user.id)}
                                    />
                                    <Card.Text>
                                        <strong>Имя:</strong> {user.realName}<br/>
                                        <strong>Email:</strong> {user.email}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Text>Нет пользователей для отображения</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
            <Tabs defaultActiveKey="records" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="records" title="Записи">
                    <FamilyRecordsComponent selectedUserIds={selectedUsers}/>
                </Tab>
                <Tab eventKey="pieChart" title="Круговая диаграмма">
                    <FamilyPieChart selectedUserIds={selectedUsers}/>
                </Tab>
                <Tab eventKey="lineChart" title="Линейная диаграмма">
                    <FamilyLineChartComponent selectedUserIds={selectedUsers}/>
                </Tab>
            </Tabs>
        </div>

    );
};

export default FamilyComponent;