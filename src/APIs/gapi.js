import React, {useEffect } from 'react';
import { gapi, loadAuth2 } from 'gapi-script'

import './gapi.css';

export const Gapi  = (props) => {

  useEffect(() => {
    
    const setAuth2 = async () => {
        console.log("setAuth2 ran")
      const auth2 = await loadAuth2(gapi, process.env.REACT_APP_CLIENT_ID, 'https://www.googleapis.com/auth/calendar')
      if (auth2.isSignedIn.get()) {
          updateUser(auth2.currentUser.get())
      } else {
          attachSignin(document.getElementById('customBtn'), auth2);
      }
    }
    setAuth2();
        
  }, []);

  useEffect(() => {
    if (props.user != null) {
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

  const attachSignin = (element, auth2) => {
    auth2.attachClickHandler(element, {},
      (googleUser) => {
        updateUser(googleUser);
      }, (error) => {
      console.log(JSON.stringify(error))
    });
  };

  const signOut = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      props.setUser(null);
      console.log('User signed out.');
    });
  }

  if(props.user) {
    return (
        <button id="customBtn" className="login-with-google-btn " onClick={signOut}>
          <span className='logout-tag'>Logout</span> 
          <img height='50 px' width = '50px'  align='left' src={props.user.profileImg} alt="user profile" />
        </button>
    );
  }

  return (
      <button id="customBtn" className="login-with-google-btn googlepic">
        Sign in with Google
    </button>
  );
}