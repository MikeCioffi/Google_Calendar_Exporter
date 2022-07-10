import React, {useState, useEffect } from 'react';
import { gapi, loadAuth2 } from 'gapi-script'
import { TailSpin } from  'react-loader-spinner'


import './gapi.css';

export const Gapi  = (props) => {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const setAuth2 = async () => {
      const auth2 = await loadAuth2(gapi, process.env.REACT_APP_CLIENT_ID, 'https://www.googleapis.com/auth/calendar')
      if (auth2.isSignedIn.get()) {
          updateUser(auth2.currentUser.get())
          setLoggedIn(true)
      } else {
          attachSignin(document.getElementById('customBtn'), auth2);
      }
    }
    setAuth2();
  }, []);

  useEffect(() => {
    console.log(props.user)
    if (!props.user) {
        console.log(props.user)
        const setAuth2 = async () => {
        const auth2 = await loadAuth2(gapi, process.env.REACT_APP_CLIENT_ID, 'https://www.googleapis.com/auth/calendar')
        attachSignin(document.getElementById('customBtn'), auth2);
      }
      setAuth2();
    }
  }, [props.user])

  const updateUser = (currentUser) => {
    const name = currentUser.getBasicProfile().getName();
    const profileImg = currentUser.getBasicProfile().getImageUrl();
    props.setUser({
      name: name,
      profileImg: profileImg,
    })};
  ;

  const attachSignin = (element) => {
    const setAuth2 = async () => {
      const auth2 = await loadAuth2(gapi, process.env.REACT_APP_CLIENT_ID, 'https://www.googleapis.com/auth/calendar')
      auth2.attachClickHandler(element, {},
        (googleUser) => {
          updateUser(googleUser);
          setLoggedIn(true)
          console.log('user logged in')
        }, (error) => {
        console.log(JSON.stringify(error))
      })}
    
    setAuth2(); 
   
  }

  const signOut = () => {
    
       const auth2 = gapi.auth2.getAuthInstance();
       props.setUser(false);
       auth2.signOut().then(() => {
    
      console.log('User signed out.');
    })}
  

  if(props.user) {
    return (
      <div className="container">
        <button  className="login-with-google-btn " onClick={signOut}>
          <span className='logout-tag'>Logout</span> 
          <img height='50 px' width = '50px'  align='left' src={props.user.profileImg} alt="user profile" />
        </button>
        </div>
    );
  }

  return (
    <div className='container'>
      <button id="customBtn" className="login-with-google-btn googlepic">
        Sign in with Google
    </button>
    </div>
  );
}
