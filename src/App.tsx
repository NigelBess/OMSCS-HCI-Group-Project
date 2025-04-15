import { Button, CircularProgress, Container, Grid, Slide, Stack, TextField, Typography } from '@mui/material'
import './App.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from './UserContext';

enum PageState
{
  Username = 'username',
  Password = 'password',
  Loading = 'loading',
}

function App() {
  const {username, setUsername} = useUser();
  const [pageState, setPageState] = useState(PageState.Username)
  const [welcomeText, setWelcomeText] = useState('Please Login')
  const [welcomeText2, setWelcomeText2] = useState('In this prototype, any username and password will work')
  const [usernameError, setUsernameError] = useState(false)
  const navigate = useNavigate()

  const trySetPageState = (pageState: PageState) => {
    if (pageState === PageState.Password)
    {
      if(username.length <= 0)
      {
        setUsernameError(true)
        return;
      }
      setWelcomeText(`Welcome, ${username}`)
      setWelcomeText2(`In this prototype, any username and password will work`);
    } 

    if(pageState === PageState.Loading)
    {
      setWelcomeText(`Logging in...`)
      setWelcomeText2(``)
    }

    if(pageState === PageState.Username)
    {
      setUsernameError(false)
      setWelcomeText(`Please Login`)
      setWelcomeText2(`In this prototype, any username and password will work`)
    }
    
    setPageState(pageState);
  }

  const submit = async () => {
    trySetPageState(PageState.Loading)
    await new Promise(resolve => setTimeout(resolve, 2000));
    navigate('/auth')
  }


  return (
    <Container sx={{paddingTop: 7}}> 
      <Container sx={{
      }}>
        <Typography variant='h2'>{welcomeText}</Typography>
        <Typography sx={{mx: 7}}>{welcomeText2}</Typography>
        <Grid container></Grid>
      </Container>
        
        
        <Container sx={{  
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 15,
          position: 'relative',
          minHeight: '120px'
        }}>
          <Slide in={pageState === PageState.Username} direction='right'>
            <Stack sx={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0}} direction='row'>
              <TextField label='Username' size='small' sx={{mx: 3}} onChange={(e) => setUsername(e.target.value)} error={usernameError}/>
              <Button variant='contained' onClick={() => trySetPageState(PageState.Password)}> Next</Button>
            </Stack>
          </Slide>
          <Slide in={pageState === PageState.Password} direction='left'>    
            <Stack sx={{position: 'absolute', bottom: 0}} direction='column'> 
            <Stack sx={{ justifyContent: 'center', alignItems: 'center'}} direction='row'>
              <Button onClick={() => trySetPageState(PageState.Username)}> Back</Button>
              <TextField label='Password' size='small' type='password' sx={{mx: 3}}/>
              <Button variant='contained' onClick={() => submit()}> Submit</Button>
            </Stack>
            </Stack> 
          </Slide>
          <Slide in={pageState === PageState.Loading} direction='left'>    
            <CircularProgress sx={{position: 'absolute', bottom: 0}} size={60}/>
          </Slide>
          
        </Container>
    </Container>

  )


}

export default App
