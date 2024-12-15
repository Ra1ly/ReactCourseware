import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/sidebar.css';

const MySidebar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user"));

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        navigate('/login');
    };


    if (!user) return null;

    return (
        <Sidebar className="sidebar">
            <Menu>
                <MenuItem onClick={() => navigate('/profile')} className="menu-item">Профиль</MenuItem>
                <SubMenu label="Семья" className="menu-item">
                    <MenuItem onClick={() => navigate('/family/join')} className="submenu-item">Войти в семью</MenuItem>
                    <MenuItem onClick={() => navigate('/family/create')} className="submenu-item">Создать семью</MenuItem>
                </SubMenu>
                <MenuItem onClick={handleLogout} className="menu-item">Выйти</MenuItem>
            </Menu>
        </Sidebar>
    );
};

export default MySidebar;