import React, {useEffect, useState} from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale
} from 'chart.js';
import {listFamilyRecords} from "../services/FamilyService.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const Chart = ({ selectedUserIds }) => {
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
    const lineData = filteredData.reduce((acc, record) => {
        const date = record.date;
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += 1;
        return acc;
    }, {});

    // Подготовка данных для линейной диаграммы
    const lineChartData = {
        labels: Object.keys(lineData),
        datasets: [{
            label: "Количество записей",
            data: Object.values(lineData),
            fill: true,
            backgroundColor: "rgba(0, 166, 180, 0.2)",
            borderColor: "#00A6B4",
            borderWidth: 2,
            pointBackgroundColor: "#00A6B4",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            tension: 0.3 // Установите значение для плавной линии
        }]
    };

    return (
        <div>
            <Line
                width={130}
                height={50}
                options={{
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Дата',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Количество',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            beginAtZero: true,
                            min: 0,
                            ticks: {
                                stepSize: 1,
                                callback: (value) => Number.isInteger(value) ? value : null
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#00A6B4',
                            borderWidth: 1,
                        },
                        legend: {
                            display: false
                        }
                    },
                    animation: {
                        duration: 0 // Уберите анимацию
                    }
                }}
                data={lineChartData}
            />
        </div>
    );
};

export default Chart;