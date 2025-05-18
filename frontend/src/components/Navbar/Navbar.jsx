import React from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { FaCalendarAlt, FaChartBar, FaPen, FaUser } from "react-icons/fa";
import './Navbar.scss';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1b1b1b' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, paddingLeft: '20px' }}>
          Sensiary
        </Typography>

        <Container sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button component={NavLink} to="/analytics" sx={buttonStyles} activeClassName="active">
            <FaChartBar /> Аналитика
          </Button>
          <Button component={NavLink} to="/record" sx={buttonStyles} activeClassName="active">
            <FaPen /> Запись
          </Button>
          <Button component={NavLink} to="/profile" sx={buttonStyles} activeClassName="active">
            <FaUser /> Профиль
          </Button>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

const buttonStyles = {
  color: '#f0f0f0',
  marginLeft: 2,
  textTransform: 'none', // Чтобы текст не был в верхнем регистре
  "&:hover": {
    backgroundColor: '#7d5f94', // Темный сиреневый при наведении
  },
  "&.active": {
    backgroundColor: '#9b4d96', // Розовое свечение на активной странице
    boxShadow: '0 0 8px #9b4d96', // Свечение активной ссылки
    color: '#fff', // Цвет текста активной ссылки
  }
};

export default Navbar;
