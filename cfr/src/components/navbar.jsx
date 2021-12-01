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
  makeStyles,
} from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  input: {
    color: "#FFF",
  },
}));

export const Navbar = ({ loggedIn, logout, login, register, getProblem }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    login({ username, password });
    handleClose();
    setUsername("");
    setPassword("");
  };
  const handleRegister = () => {
    register({ username, password });
    handleClose();
    setUsername("");
    setPassword("");
  };

  const [problemCode, setProblemCode] = useState("");
  const openProblem = () => {
    if (problemCode) {
      getProblem(problemCode);
      setProblemCode("");
    }
  };

  const genLogin = () => {
    if (!loggedIn)
      return (
        <Button color="inherit" onClick={handleClickOpen}>
          Login
        </Button>
      );
    return (
      <Button color="inherit" onClick={logout}>
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
              inputProps={{ className: classes.input }}
              color="secondary"
              variant="standard"
              margin="dense"
              style={{ width: "500px" }}
              value={problemCode}
              onChange={(e) => setProblemCode(e.target.value)}
            />
            <Button
              color="inherit"
              onClick={openProblem}
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="dense"
                id="pass"
                label="Password"
                fullWidth
                type="password"
                variant="standard"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
