import { Box, Button, CircularProgress, Container, createTheme, CssBaseline, Paper, Slide, Stack, ThemeProvider, Typography } from "@mui/material";
import duo from './assets/duo.png';
import './Auth.css';
import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import faceIdAnimation from './assets/faceIdAnimation.lottie';
import { useNavigate } from "react-router-dom";
import { VideocamOff } from "@mui/icons-material";

enum PageState
{
  Landing = 'landing',
  Permissions = 'permissions',
  Authenticating = 'authenticating',
  Alternative = 'alternative',
  Denied = 'denied', // TODO: implement this if user denies camera access
  NoCameraDetected = 'noCameraDetected',  
}

function Auth() {
    const [pageState, setPageState] = useState(PageState.Landing);
    const [code, setCode] = useState('');
    const navigate = useNavigate()

    const useAlternative = () => {
        let code = '';
        for (let i = 0; i < 3; i++) {
            code += Math.floor(Math.random() * 10);
        }
        setCode(code);
        setPageState(PageState.Alternative);
    }

    const requestCameraPermission = async () => {
        setPageState(PageState.Permissions);
        
        try {
            await navigator.mediaDevices.getUserMedia({ 
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: { ideal: "user" }
                } 
            });
            setPageState(PageState.Authenticating);
        } catch (err) {
            console.error("Camera permission denied:", err);
            if(!(err instanceof Error)) {
                setPageState(PageState.NoCameraDetected);
                console.error("Unknown error type in camera permission request:", err);
                return;
            }
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                // User explicitly denied permission
                setPageState(PageState.Denied);
            } else {
                // Other errors (like hardware errors, security errors, etc.)
                setPageState(PageState.NoCameraDetected);
            }
        }
    };

    const onCompletedAuthentication = () => {
        if(pageState !== PageState.Authenticating) {
            return;
        }
        navigate('/dashboard');
    }



    const theme = createTheme({
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: '#e7e9ed',
              },
            },
          },
        },
      });

  return (
    <ThemeProvider theme={theme}>
        <CssBaseline>
            <Container sx={{paddingTop: 7, display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center', position: 'relative'}}>
            <Box display={pageState === PageState.Landing ? 'block' : 'none'}>
                    <Slide in={pageState === PageState.Landing} direction='right'>
                        <Paper sx={{py: 4, px: 2, width: '400px', height: '500px', borderRadius: 5}}>
                            
                            <Stack direction='column' spacing={1} alignItems='center' sx={{height: '100%', justifyContent: 'space-between'}}>
                                <div className="paper-division">
                                    <Typography variant="h4">Duo Security</Typography>
                                    <img src={duo} alt="Duo Security" style={{width: '100px', height: '100px', marginBottom: 10, marginTop: 10}}/>                                     
                                    <Typography>Please authenticate with FaceId</Typography>
                                </div>
                                <div className="paper-division">
                                    <Button variant="contained" color="primary" onClick={requestCameraPermission}>Authenticate</Button>
                                    <Button sx={{mt: 2}} onClick={() => useAlternative()}>Use Code Instead</Button>
                                </div>
                            </Stack>                     
                        </Paper>
                    </Slide>
                    </Box>
                    <Box display={pageState === PageState.Alternative ? 'block' : 'none'}>
                        <Slide in={pageState === PageState.Alternative} direction='left' >
                        <Paper sx={{py: 4, px: 2, width: '400px', height: '500px', borderRadius: 5}}>
                            <Stack direction='column' spacing={1} alignItems='center' sx={{height: '100%', justifyContent: 'space-between'}}>
                                <div className="paper-division">
                                    <img src={duo} alt="Duo Security" style={{width: '100px', height: '100px', marginBottom: 10, marginTop: 10}}/>                                     
                                    <Typography>Enter the code in your Duo Mobile app</Typography>
                                    <Typography variant="h1">{code}</Typography>
                                    <CircularProgress size={30}></CircularProgress>
                                </div>
                                <div className="paper-division">
                                    <Typography sx={{cursor: "pointer", ":hover": {color: "#aaaaaa"}}} onClick={onCompletedAuthentication}>This page is for prototyping purposes only. Click this to pretend you entered a code in your app.</Typography>
                                    <Button sx={{mt: 2}} onClick={() => setPageState(PageState.Landing)}>Use Face Id Instead</Button>
                                </div>
                            </Stack>                     
                        </Paper>
                        </Slide>
                    </Box>
                    <Box display={pageState === PageState.Permissions ? 'block' : 'none'}>
                        <Typography>Please allow camera access to continue.</Typography>
                    </Box>
                    <Box display={pageState === PageState.Authenticating ? 'block' : 'none'}>
                        <Stack direction='column' spacing={2} alignItems='center'>  
                            <Typography>Authenticating...</Typography>    
                            <DotLottieReact key={pageState} src={faceIdAnimation} autoplay={true} loop={false}  dotLottieRefCallback={(dotLottie) => {
                                if (dotLottie) {
                                    dotLottie.addEventListener('complete', onCompletedAuthentication);
                                }
                            }}></DotLottieReact>     
                        </Stack>                        
                    </Box>
                    <Box display={pageState === PageState.Denied ? 'block' : 'none'}>
                    <Stack direction='column' spacing={2} alignItems='center'>  
                        <Typography variant="h6">Camera Access Denied</Typography>
                        <Typography>
                            You need to allow camera access to continue with Face ID authentication.
                        </Typography>
                        <Typography variant="body2" sx={{ maxWidth: '400px', textAlign: 'center' }}>
                            Since you denied camera access, you'll need to reset permissions in your browser settings:
                        </Typography>
                        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, maxWidth: '400px' }}>
                            <Typography variant="body2" component="div">
                                <strong>Chrome/Edge:</strong> Click the padlock/site settings icon in the address bar → Site settings → Reset permissions
                            </Typography>
                            <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                                <strong>Safari:</strong> Safari preferences → Websites → Camera → Find this site and change to "Allow"
                            </Typography>
                            <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                                <strong>Firefox:</strong> Click the shield icon in the address bar → Site permissions → Reset permissions
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="primary" onClick={requestCameraPermission}>
                                Try Again
                            </Button>
                            <Button variant="outlined" onClick={useAlternative}>
                                Use Code Instead
                            </Button>
                        </Stack>
                    </Stack>                       
                    </Box>
                    <Box display={pageState === PageState.NoCameraDetected ? 'block' : 'none'}>
                        <Stack direction='column' spacing={2} alignItems='center'>  
                            <Stack direction='row' spacing={1} alignItems='center'>
                                <VideocamOff sx={{fontSize: 80}} />
                                <Typography variant="h6">No Camera Detected</Typography>
                            </Stack>
                            
                            <Typography variant="body1" sx={{ maxWidth: '400px', textAlign: 'center' }}>
                                Face ID authentication requires a camera. 
                            </Typography>
                            <Button variant="contained" color="primary" onClick={requestCameraPermission}>
                                Try Again
                            </Button>
                            <Button color="primary" onClick={useAlternative}>
                                Use Code Instead
                            </Button>
                        </Stack>                       
                    </Box>

            </Container>
    </CssBaseline>
    </ThemeProvider>
  );
}

export default Auth;