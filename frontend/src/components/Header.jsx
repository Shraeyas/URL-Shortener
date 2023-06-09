import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import UserAuthContext from '../context/UserAuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import * as React from 'react';
import { Button, Box, Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";
import useClasses from "../components/useClasses";

const styles = theme => ({
    container: {
        display: 'flex',
        alignItems: 'center',
      },
      image: {
        width: 'auto',
        height: '3em'
      },
  });

const Header = () => {
    const { token, setToken, loginUser, logoutUser } = useContext(UserAuthContext);
    const classes = useClasses(styles);

    const onSuccess = (res) => {
        loginUser(jwt_decode(res.credential));
    }
    const onFailure = (res) => {
        console.log("Login Failed");
    }
    const logoutButtonStyle = {
        color: 'white',
        '&:hover': {
            backgroundColor: '#555',
        },
        backgroundColor: '#000',
    };

    const localStorageData = localStorage.getItem('token');
    let userData;
    if (localStorageData) {
        setToken(localStorageData);
        userData = jwt_decode(localStorageData);
    }
    const navigate = useNavigate();
    const logout = () => {
        logoutUser();
        navigate("/")
    }

    return (
        <>
            <h1>URL Shortener</h1>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <img  className={[classes.image]} src="/images/git.png" alt="Icon" />
            </a>

            {
                token ? <><p>Welcome, <strong>{userData.name.split(" ")[0]}</strong>! 👋</p>
                    <Box display="flex" justifyContent="space-between">
                        <Grid container spacing={2}>
                            <Grid item xs={4} sm={4}>
                                <Link to="/"><Button variant="contained" style={logoutButtonStyle}>Home</Button></Link>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <Link to="/user/my-urls"><Button style={logoutButtonStyle}>My URLs</Button></Link>
                            </Grid>
                            <Grid item xs={4} sm={4}>
                                <Button variant="contained" style={logoutButtonStyle} onClick={logout}>Logout</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </> : <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onFailure}
                />
            }
        </>
    );
}
export default Header;