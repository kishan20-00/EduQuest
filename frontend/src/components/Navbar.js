import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Switch, Box, IconButton, Menu, MenuItem, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AuthContext from '../contexts/AuthContext';
import Logo from '../assets/logo.png'

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
    <AppBar position="fixed" sx={{ backgroundColor: ' #0B1130' }}>
      <Toolbar>
      <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', marginRight: 2 }}>
          <Box component="img" src={Logo} alt="LearnPath+ Logo" sx={{ width: 28, height: 28, marginRight: 1 }} />
          <Typography 
              variant="h6" 
              sx={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold', 
                  textDecoration: 'none', 
                  color: '#fff', 
                  margin: 1 
              }}
          >
              LearnPath+
          </Typography>
      </Box>


        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" component={RouterLink} to="/" sx={{ margin: 1, textDecoration: 'none', color: 'inherit' }}>
            Home
          </Typography>
          
          <Typography variant="body1" component={RouterLink} to="/course" sx={{ margin: 1, textDecoration: 'none', color: 'inherit' }}>
            Recommended For You
          </Typography>

          <Typography variant="body1" component={RouterLink} to="/about" sx={{ margin: 1, textDecoration: 'none', color: 'inherit' }}>
            About
          </Typography>

          <Typography variant="body1" component={RouterLink} to="https://learnpath-plus-static-site.vercel.app/" sx={{ margin: 1, textDecoration: 'none', color: 'inherit' }}>
            What is LearnPath+
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
