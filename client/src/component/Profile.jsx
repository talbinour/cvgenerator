/*import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
  ListItemButton,
  List,
  ListItemText,
} from "@mui/material";
import { ChevronDown as IconChevronDown } from "@tabler/icons-react";
import styles from './profile.css';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);

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
        aria-controls="msgs-menu"
        aria-haspopup="true"
        className={`${styles.menu-button} menu-button`}
        onClick={handleClick2}
      >
        <Avatar
          src={"/images/users/user2.jpg"}
          alt={"ProfileImg"}
          sx={{
            width: 30,
            height: 30,
          }}
        />
        <Box className={styles.avatar-container}>
          <Typography
            color="textSecondary"
            variant="h5"
            fontWeight="400"
            className={styles.profile-text}
          >
            <h5>Bonjour,</h5>
            <Typography
              variant="h5"
              fontWeight="700"
            >
              Rahma
            </Typography>
          </Typography>
          <IconChevronDown width="20" height="20" />
        </Box>
      </IconButton>

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        className={styles.message-dropdown}
      >

        <Box pt={0}>
          <List>
            <Link href="/modifier-profil" passHref>
              <ListItemButton component="a" className="list-item">
                <ListItemText primary="Modifier Profile" />
              </ListItemButton>
            </Link>
            <ListItemButton component="a" href="#" className="list-item">
              <ListItemText primary="Compte" />
            </ListItemButton>
            <ListItemButton component="a" href="#" className="list-item">
              <ListItemText primary="Changer Mot de Passe" />
            </ListItemButton>
            <ListItemButton component="a" href="#" className="list-item">
              <ListItemText primary="Parametre" />
            </ListItemButton>
          </List>
        </Box>

        <Divider className="divider" />
        <Box mt={2}>
          <Button fullWidth variant="contained" color="primary" className="logout-button">
            Deconnecter
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;*/
