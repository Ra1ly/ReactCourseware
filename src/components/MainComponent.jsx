
import CreditCardsSpin from "./CreditCardsSpin.jsx";
import RecordsComponent from "./RecordsComponent.jsx";
import PieChart from "./PieChartComponent.jsx";
import {useState} from "react";
import LineChartComponent from "./LineChartComponent.jsx";

const Main = () =>{

    const [records, setRecords] = useState([]);

    const updateRecords = (newRecords) => {
        setRecords(newRecords);
    };
return (

    <div className="container">
        <CreditCardsSpin/>
        <RecordsComponent updateRecords={updateRecords} />
        <PieChart records={records} />
        <LineChartComponent records={records}/>
    </div>
)
}
export default Main;