import React, {useEffect, useState} from "react";
import { Pie } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Tooltip, Legend } from "chart.js";
import {useNavigate} from "react-router-dom";
import {listFamilyRecords} from "../services/FamilyService.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ selectedUserIds }) => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        listFamilyRecords()
            .then((response) => {
                setRecords(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const filteredData = records.filter(record =>
        selectedUserIds.includes(record.user.id)
    );
    const groupedData = filteredData.reduce((acc, record) => {
        const category = record.category.category;
        const amount = record.amount;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
    }, {});

    const total = Object.values(groupedData).reduce((sum, value) => sum + value, 0);

    const pieChartData = {
        labels: Object.keys(groupedData),
        datasets: [{
            data: Object.values(groupedData),
            backgroundColor: [
                "#2FDE00", "#00A6B4", "#ff6600", "#FF5733",
                "#C70039", "#900C3F", "#581845"
            ],
            hoverBackgroundColor: [
                "#175000", "#003350", "#993d00", "#C70039",
                "#900C3F", "#581845", "#0E4C92"
            ],
            borderWidth: 2,
            borderColor: "#fff"
        }]
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const label = tooltipItem.label || '';
                        const value = tooltipItem.raw || 0;
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            },
            legend: {
                display: true,
                position: "top",
                labels: {
                    boxWidth: 20,
                    padding: 15
                }
            }
        }
    };

    return (
        <div className='container' style={{ width: '50%', height: '400px' }}>
            <Pie
                data={pieChartData}
                options={pieChartOptions}
            />
        </div>
    );
};

export default PieChart;