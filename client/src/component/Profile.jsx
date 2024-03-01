import React, { useState } from 'react';
import { IconButton, Menu, Box, ListItemButton, List, ListItemText } from '@mui/material';
import { IconChevronDown } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: 'Profile', link: '/userprofile' },
    
    // Add more menu items as needed
  ];

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <IconChevronDown width="20" height="20" />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Box pt={0}>
          <List>
            {menuItems.map((item) => (
              <Link to={item.link} key={item.label} style={{ textDecoration: 'none' }}>
                <ListItemButton component="a" onClick={handleClose}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
            ))}
            <ListItemButton component="a" href="#" onClick={handleClose}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;