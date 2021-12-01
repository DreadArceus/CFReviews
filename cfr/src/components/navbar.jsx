import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { useState } from "react";

export const Navbar = ({ loggedIn, handleLogout }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = () => {
    handleClose();
  };

  const handleRegister = () => {
    handleClose();
  };

  const genLogin = () => {
    if (!loggedIn)
      return (
        <Button color="inherit" onClick={handleClickOpen}>
          Login
        </Button>
      );
    return (
      <Button color="inherit" onClick={handleLogout}>
        Logout
      </Button>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            CFReviews
          </Typography>
          <div style={{ textAlign: "center", width: "95vw" }}>
            <TextField
              color="secondary"
              variant="standard"
              margin="dense"
              style={{ width: "500px" }}
            />
            <Button
              color="inherit"
              onClick={() => {}}
              style={{ marginTop: "10px" }}
            >
              Open Problem
            </Button>
          </div>
          {genLogin()}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Login/Register</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To write reviews, please Login or Register.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Username"
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                id="pass"
                label="Password"
                fullWidth
                type="password"
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleLogin}>Login</Button>
              <Button onClick={handleRegister}>Register</Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
