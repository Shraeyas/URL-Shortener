import { useState } from "react";
import validator from 'validator'
import axios from 'axios';
import { Button, Stack, Container, TextField } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react';
import UserAuthContext from '../context/UserAuthContext';
import 'react-toastify/dist/ReactToastify.css';

const isUrlValid = (inputUrl) => {
    return validator.isURL(inputUrl);
}

const Shortener = () => {
    const { token } = useContext(UserAuthContext);

    const [shortUrl, setShortUrl] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [inputUrl, setInputUrl] = useState("");
    const [errorHelper, setErrorHelper] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let url = inputUrl.startsWith("http") ? inputUrl : `http://${inputUrl}`;
            const body = {
                url: url
            }

            if(token) {
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.post("url/shorten", body, { headers });
                console.log(response);
                setShortUrl(response.data.short_url);
            }
            else {
                const response = await axios.post("url/shorten", body);
                console.log(response);
                setShortUrl(response.data.short_url);
            }

        }
        catch (e) {
            console.log("Server error")
         }
    }

    const onChange = async (e) => {
        setInputUrl(e.target.value);
        let url = e.target.value.startsWith("http") ? e.target.value : `http://${e.target.value}`;
        if (e.target.value === "" || isUrlValid(url)) {
            setIsButtonDisabled(false);
            setErrorHelper(null);
        }
        else {
            setIsButtonDisabled(true);
            setErrorHelper("Invalid URL");
        }
    }

    const onCopyClick = async () => {
        try {
            if (shortUrl && shortUrl !== "") {
                navigator.clipboard.writeText(shortUrl);
                toast.success('URL copied to clipboard', {
                    icon: <ContentPasteIcon />,
                });
            }
        }
        catch (e) { }
    }

    const buttonStyle = {
        backgroundColor: '#000',
        color: 'white',
        '&:hover': {
            backgroundColor: '#555',
        },
        width: '100%'
    };

    const copyButtonStyle = {
        color: 'black',
        '&:hover': {
            backgroundColor: '#555',
        },
        width: '100%'
    };

    return (
        <>
            <Container maxWidth="sm">
                <Stack spacing={2}>
                    <form onSubmit={onSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                value={inputUrl}
                                className={(shortUrl || shortUrl === "") ? 'filled-textfield' : ''}
                                onChange={onChange}
                                id="outlined-basic"
                                error={errorHelper ? true : false}
                                helperText={errorHelper}
                                placeholder="Long URL"
                                variant="outlined" />
                            <Button type="submit" style={buttonStyle} variant="contained" disabled={isButtonDisabled} onClick={onSubmit}>Shorten</Button>
                        </Stack>
                    </form>
                    <TextField
                        id="outlined-basic"
                        className={(shortUrl || shortUrl === "") ? 'filled-textfield' : ''}
                        InputProps={{
                            readOnly: true
                        }}
                        value={shortUrl}
                        variant="outlined"
                        placeholder="Short URL"
                        fullWidth
                    />
                    <Button style={copyButtonStyle} onClick={onCopyClick} endIcon={<ContentCopyIcon />}>Copy to Clipboard</Button>
                </Stack>
                <ToastContainer
                    position="top-right"
                    autoClose={2100}
                    hideProgressBar={true}
                    closeOnClick={true}
                    pauseOnHover={false}
                    draggable={false}
                />
            </Container>
        </>
    );
}
export default Shortener;