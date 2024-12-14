import './App.css'
import ListPersonComponent from "./components/ListPersonComponent.jsx";
import HeaderComponent from "./components/HeaderComponent.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import PersonComponent from "./components/PersonComponent.jsx";
//import PieChartComponent from "./components/PieChartComponent.jsx";

import CardFormComponent from "./components/CardFormComponent.jsx";

function App() {

  return (
    <>
        <BrowserRouter>
            <HeaderComponent/>
                <Routes>

                    <Route path='/person' element={<ListPersonComponent/>}/>

                    <Route path='/register' element={<PersonComponent/>}/>

                    <Route path='/test' element={<CardFormComponent/>}/>
                    <Route path='/edit-person/:id' element = {<PersonComponent/>}/>
                </Routes>

        </BrowserRouter>
    </>
  )
}

export default App
