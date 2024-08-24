import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Switch, Box, IconButton, Menu, MenuItem, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AuthContext from '../contexts/AuthContext';
import logo from '../images/Logo.png'; // Adjust the path to your logo

const NavBar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'inherit', marginRight: 2 }}>
          <img src={logo} alt="EduQuest Logo" style={{ height: '40px' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" component={RouterLink} to="/" sx={{ margin: 1, textDecoration: 'none', color: 'inherit' }}>
            Home
          </Typography>
          <Typography variant="body1" component={RouterLink} to="/about" sx={{ margin: 1, textDecoration: 'none', color: 'inherit' }}>
            About
          </Typography>
          <Typography variant="body1" component={RouterLink} to="/course" sx={{ margin: 1, textDecoration: 'none', color: 'inherit' }}>
            Courses
          </Typography>
          <Typography variant="body1" component={RouterLink} to="/contact" sx={{ margin: 1, textDecoration: 'none', color: 'inherit' }}>
            Contact
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <Typography variant="body1" sx={{ display: 'inline', marginRight: 1 }}>
            {darkMode ? 'Dark' : 'Light'} Mode
          </Typography>
          <Switch checked={darkMode} onChange={handleThemeChange} />
        </Box>
        {user ? (
          <Box>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} component={RouterLink} to="/profile">Profile</MenuItem>
              <MenuItem onClick={handleClose} onClick={logout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button color="inherit" component={RouterLink} to="/signin">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
