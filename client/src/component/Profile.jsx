import React from "react";
import {  IconButton, Menu, Box, ListItemButton, List, ListItemText } from "@mui/material";
import { IconChevronDown } from "@tabler/icons-react"; // Assurez-vous que ce module est correctement installé
import { Link } from 'react-router-dom';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick2}
      >
        {/* Ajouter ici le contenu de l'avatar et du nom d'utilisateur */}
        <IconChevronDown width="20" height="20" />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Box pt={0}>
          <List>
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <ListItemButton component="a" onClick={handleClose2}>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </Link>
            <Link to="/settings" style={{ textDecoration: 'none' }}>
              <ListItemButton component="a" onClick={handleClose2}>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </Link>
            <ListItemButton component="a" href="#" onClick={handleClose2}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
