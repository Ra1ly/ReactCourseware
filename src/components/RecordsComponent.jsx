// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { listRecords } from "../services/RecordService.js";
import { useNavigate } from "react-router-dom";
import { Pagination, Table, Form, Row, Col, Button } from "react-bootstrap";

function RecordsComponent() {
    const [records, setRecords] = useState([]);
    const navigator = useNavigate();

    useEffect(() => {
        listRecords()
            .then((response) => {
                setRecords(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

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

    return (
        <div>
            <Row className="mb-3">
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
                    <Form.Group className="d-flex flex-column">
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
                    </Form.Group>
                </Col>
                <Col className="text-end">
                    <Button variant="tertiary" onClick={resetFilters}>
                        <img width="25" height="25" src="https://img.icons8.com/ios/50/reboot.png" alt="Сбросить"/>
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover className="table-responsive">
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

            <Pagination>
                <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                {[...Array(totalPages).keys()].map((number) => (
                    <Pagination.Item key={number + 1} active={number + 1 === currentPage}
                                     onClick={() => setCurrentPage(number + 1)}>
                        {number + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} />
            </Pagination>
        </div>
    );
}

export default RecordsComponent;