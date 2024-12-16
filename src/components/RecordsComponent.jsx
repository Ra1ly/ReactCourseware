import React, { useEffect, useState } from "react";
import { listUserRecords, addRecord, listCategories } from "../services/RecordService.js";
import { useNavigate } from "react-router-dom";
import { Pagination, Table, Form, Row, Col, Button, Modal } from "react-bootstrap";
import AuthService from "../services/AuthService.js";
import "../style/styles.css";

function RecordsComponent({ updateRecords }) {
    const [records, setRecords] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newRecord, setNewRecord] = useState({
        date: '',
        category: { id: '', category: '' },
        description: '',
        amount: ''
    });
    const navigator = useNavigate();

    useEffect(() => {
        fetchRecords();
        fetchCategories();
    }, []);

    const fetchRecords = () => {
        listUserRecords()
            .then((response) => {
                setRecords(response.data);
                updateRecords(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchCategories = () => {
        listCategories()
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredData = records.filter(record => {
        const recordDate = new Date(record.date);
        const isWithinDateRange = (!startDate || recordDate >= new Date(startDate)) &&
            (!endDate || recordDate <= new Date(endDate));

        return isWithinDateRange && Object.values(record).some(value => {
            if (typeof value === 'object' && value !== null && value.category) {
                return value.category.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false;
        });
    });

    const sortedData = [...filteredData].sort((a, b) => {
        const aValue = sortField === 'date' ? new Date(a[sortField]) : a[sortField];
        const bValue = sortField === 'date' ? new Date(b[sortField]) : b[sortField];

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
        setItemsPerPage(5);
        setCurrentPage(1);
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecord(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = categories.find(cat => cat.id === parseInt(e.target.value));
        setNewRecord(prevState => ({ ...prevState, category: selectedCategory }));
    };

    const handleSaveRecord = () => {
        const user = AuthService.getCurrentUser();

        const recordToSave = {
            ...newRecord,
            user
        };

        addRecord(recordToSave)
            .then(() => {
                fetchRecords();
                handleCloseModal();
                setNewRecord({ date: '', category: { id: '', category: '' }, description: '', amount: '' });
            })
            .catch((error) => {
                console.error("Ошибка при сохранении записи:", error);
            });
    };

    return (
        <div className="my-4 p-4 border rounded">
            <Row className="mb-3 align-items-end">
                <Col md={2}>
                    <Form.Select
                        size="sm"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                    >
                        <option value={5}>5 записей</option>
                        <option value={10}>10 записей</option>
                        <option value={20}>20 записей</option>
                    </Form.Select>
                </Col>
                <Col md={4} className="text-center">
                    <Form.Control
                        type="text"
                        placeholder="Поиск..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={3} className="text-end">
                    <div className="d-flex">
                        <Form.Control
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="me-2"
                        />
                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </Col>
                <Col className="text-end">
                    <Button variant="tertiary" onClick={resetFilters} className="me-2">
                        <img width="25" height="25" src="https://img.icons8.com/ios/50/reboot.png" alt="Сбросить" />
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover className="table-responsive table-fixed">
                <thead>
                <tr>
                    <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                        Дата {sortField === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                        Категория {sortField === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('description')} style={{ cursor: 'pointer' }}>
                        Описание {sortField === 'description' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                        Сумма {sortField === 'amount' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map(record => (
                    <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>{record.category.category}</td>
                        <td>{record.description}</td>
                        <td>{record.amount}</td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Row className="d-flex justify-content-between align-items-center mt-3">
                <Col md={6} className="d-flex">
                    <Pagination className="me-auto">
                        <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                        {[...Array(totalPages).keys()].map((number) => (
                            <Pagination.Item key={number + 1} active={number + 1 === currentPage}
                                             onClick={() => setCurrentPage(number + 1)}>
                                {number + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
                    </Pagination>
                </Col>

                <Col md={6} className="text-end">
                    <Button variant="primary" onClick={handleShowModal} style={{ width: '160px' }}>
                        Добавить запись
                    </Button>
                </Col>
            </Row>

            {/* Модальное окно для добавления новой записи */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить новую запись</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formDate">
                            <Form.Label>Дата</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={newRecord.date}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formCategory">
                            <Form.Label>Категория</Form.Label>
                            <Form.Select
                                name="category"
                                onChange={handleCategoryChange}
                                required
                            >
                                <option key="">Выберите категорию</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.category}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={newRecord.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAmount">
                            <Form.Label>Сумма</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                value={newRecord.amount}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Закрыть
                    </Button>
                    <Button variant="primary" onClick={handleSaveRecord}>
                        Сохранить запись
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default RecordsComponent;