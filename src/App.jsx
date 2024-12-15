import './App.css';
import ListPersonComponent from "./components/ListPersonComponent.jsx";
import HeaderComponent from "./components/HeaderComponent.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PersonComponent from "./components/PersonComponent.jsx";
import RegistrationComponent from "./components/RegistrationComponent.jsx";
import LoginComponent from "./components/LoginComponent.jsx";
import MainComponent from "./components/MainComponent.jsx";
import SidebarComponent from "./components/SidebarComponent.jsx";
import ProfileComponent from "./components/ProfileComponent.jsx";

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <HeaderComponent />
                <div className="content-container">
                    <SidebarComponent />
                    <div className="main-content">
                        <Routes>
                            <Route path='/person' element={<ListPersonComponent />} />
                            <Route path='/register' element={<RegistrationComponent />} />
                            <Route path='/profile' element={<ProfileComponent/>}/>
                            <Route path='/' element={<MainComponent />} />
                            <Route path='/login' element={<LoginComponent />} />
                            <Route path='/edit-person/:id' element={<PersonComponent />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;