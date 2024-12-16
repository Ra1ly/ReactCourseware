import React, { useState } from "react";
import CreditCardsSpin from "./CreditCardsSpin.jsx";
import RecordsComponent from "./RecordsComponent.jsx";
import PieChart from "./PieChartComponent.jsx";
import LineChartComponent from "./LineChartComponent.jsx";
import '../style/main.css'
import {Tab, Tabs} from "react-bootstrap";

const Main = () => {
    const [records, setRecords] = useState([]);

    const updateRecords = (newRecords) => {
        setRecords(newRecords);
    };

    return (
        <div className="carousel">
            <CreditCardsSpin/>
            <Tabs defaultActiveKey="records" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="records" title="Записи">
                    <RecordsComponent updateRecords={updateRecords}/>
                </Tab>
                <Tab eventKey="pieChart" title="Круговая диаграмма">
                    <PieChart records={records}/>
                </Tab>
                <Tab eventKey="lineChart" title="Линейная диаграмма">
                    <LineChartComponent records={records}/>
                </Tab>
            </Tabs>
        </div>

    );
};

export default Main;