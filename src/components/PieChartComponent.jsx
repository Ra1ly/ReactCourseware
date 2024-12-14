import React, {useEffect, useState} from "react";
import {Pie} from "react-chartjs-2"
import {listRecords} from "../services/RecordService.js";
import {ArcElement, Chart as ChartJS, Tooltip, Legend} from "chart.js";

ChartJS.register(ArcElement,Tooltip,Legend);

const PieChart = () => {

    const [records, setRecords] = useState([])


    useEffect(() => {
        listRecords().then((response)=>{
            setRecords(response.data)
        }).catch(error => {
            console.error(error)
        })
    }, []);

    const groupedData = records.reduce((acc, record) => {
        const category = record.category.category;
        const amount = record.amount;

        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
    }, {});

    const pieChartData = {
        labels: Object.keys(groupedData),
        datasets: [{
            data: Object.values(groupedData),
            backgroundColor: ["#2FDE00", "#00A6B4", "#ff6600", "#FF5733", "#C70039", "#900C3F", "#581845"],
            hoverBackgroundColor: ["#175000", "#003350", "#993d00", "#C70039", "#900C3F", "#581845", "#0E4C92"]
        }]
    };

    const pieChart = (
        <div className='container'>
        <Pie
            type="pie"
            width={130}
            height={50}
            options={{
                title: {
                    display: true,
                    text: "Расходы",
                    fontSize: 15
                },
                legend: {
                    display: true, //Is the legend shown?
                    position: "top" //Position of the legend.
                }
            }}
            data={pieChartData}
        />
        </div>
    );
    return pieChart;
};
export default PieChart;