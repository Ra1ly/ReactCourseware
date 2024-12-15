import './App.css';
import ListPersonComponent from "./components/ListPersonComponent.jsx";
import HeaderComponent from "./components/HeaderComponent.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegistrationComponent from "./components/RegistrationComponent.jsx";
import LoginComponent from "./components/LoginComponent.jsx";
import MainComponent from "./components/MainComponent.jsx";
import SidebarComponent from "./components/SidebarComponent.jsx";
import ProfileComponent from "./components/ProfileComponent.jsx";
import FamilyComponent from "./components/FamilyComponent.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <HeaderComponent />
                <div className="content-container">
                    <SidebarComponent />
                    <div className="main-content">
                        <Routes>
                            <Route path='/person' element={<PrivateRoute element={<ListPersonComponent />} />} />
                            <Route path='/register' element={<RegistrationComponent />} />
                            <Route path='/profile' element={<PrivateRoute element={<ProfileComponent />} />} />
                            <Route path='/' element={<PrivateRoute element={<MainComponent />} />} />
                            <Route path='/login' element={<LoginComponent />} />
                            <Route path='/family' element={<PrivateRoute element={<FamilyComponent />} requiresFamily={true} />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;