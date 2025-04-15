import { AppBar, Button, Container, CssBaseline, Stack, Toolbar, Typography } from "@mui/material";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

function Dashboard() {
    const { username } = useUser();
    const navigate = useNavigate();

    return (
        <CssBaseline>
            <AppBar position="static">
                    <Toolbar sx={{ px: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <SettingsIcon/>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <PersonIcon/>
                            <Typography variant="h6">{username}</Typography>
                            <Button variant="contained" onClick={() => navigate('/')}>Log out</Button>   
                        </Stack>
                        
                    </Toolbar>
            </AppBar>
            <Container sx={{paddingTop: 7}}>
                
                <Typography variant="h2">Welcome, {username}</Typography>
                <Typography variant="h5" sx={{marginTop: 2, color: '#0fbd60'}}>You have successfully logged in.</Typography>
                <Typography variant="h5" sx={{marginTop: 2}}>Thank you for testing our prototype!</Typography>
                <Stack direction="column" spacing={2} sx={{marginTop: 10, alignItems: 'center'}}>
                    <Button variant="contained" sx={{margin: 8}}>Please share your feedback in our survey.</Button>
                    <Button onClick={() => navigate('/')}>Log out</Button>
                </Stack>
                
            </Container>
        </CssBaseline>
        
    );
}

export default Dashboard;
