import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { listRecords } from "../services/RecordService.js";
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

// Регистрация необходимых элементов
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const Chart = () => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        listRecords()
            .then((response) => {
                setRecords(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Группировка данных для линейной диаграммы
    const lineData = records.reduce((acc, record) => {
        const date = record.date;
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += 1; // Считаем количество записей для каждой даты
        return acc;
    }, {});

    // Подготовка данных для линейной диаграммы
    const lineChartData = {
        labels: Object.keys(lineData),
        datasets: [{
            label: "Количество записей",
            data: Object.values(lineData),
            fill: false,
            backgroundColor: "#00A6B4",
            borderColor: "#00A6B4",
        }]
    };

    return (
        <div>
            <h2>Количество записей по датам</h2>
            <Line
                width={130}
                height={50}
                options={{
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Дата'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Количество'
                            },
                            ticks: {
                                beginAtZero: true, // Начинаем с нуля
                                stepSize: 1, // Шаг 1 для отображения целых чисел
                                callback: (value) => Number.isInteger(value) ? value : null // Отображаем только целые числа
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }}
                data={lineChartData}
            />
        </div>
    );
};

export default Chart;