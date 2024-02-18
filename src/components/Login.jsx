import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'
import Cookies from 'js-cookie';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function LoginWidget() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect-url');

  const [email, setEmail] = useState('');
  const [isWaitingOtp, setIsWaitingOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const cookies = document.cookie.split(/\s*;\s*/).map(cookie => cookie.split('='));
    const accessTokenCookie = cookies.find(x => x[0] == 'cg-access-token');
    const refreshTokenCookie = cookies.find(x => x[0] == 'cg-refresh-token');
    
    if (accessTokenCookie && refreshTokenCookie) {
      supabase.auth.setSession({
        access_token: accessTokenCookie[1],
        refresh_token: refreshTokenCookie[1],
      })
    }
  })

  // Get the user from the session
  // Remove cookie or set cookie
  // I want to use cookie since cookies are available across subdomains 
  // This callback is required on any of my projects using supabase auth
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session)

    const cookieOptions = {
      path: '/',
      domain: window.location.hostname,
      expires: 1, // 1 day
      sameSite: 'Lax',
      secure: import.meta.env.VITE_ENVIRONEMENT === "Local" ? false : true
    };
    // handle sign out - delete cookie
    if (event === 'SIGNED_OUT') {
      Cookies.remove('cg-access-token', cookieOptions)
      Cookies.remove('cg-refresh-token', cookieOptions)
    }
    // handle sign in - create cookie
    else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      Cookies.set('cg-access-token', session.access_token, cookieOptions); // Expires in 1 day
      Cookies.set('cg-refresh-token', session.refresh_token, cookieOptions); // Expires in 1 day

      // Were signed in and can redirect the user
      if (redirectUrl) {
        window.location.href = redirectUrl ?? import.meta.env.VITE_APP_URL; // Dont know if I want to redirect already logged in users
      }
    }
    // I am not handling 'PASSWORD_RECOVERY' 'USER_UPDATED' 
    // I do not think 'INITIAL_SESSION' is necessary to handle
  })


  const handleMagicLinkLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          redirectTo: redirectUrl ?? import.meta.env.VITE_APP_URL,
        }
      })
      if (error) {
        throw error;
      }
      else {
        setSuccess('Check your email for the login link!');
        setIsWaitingOtp(true)
        setError(null);
      }
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  const handleVerifyOtpLogin = async () => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email',
        options: {
          redirectTo: redirectUrl ?? import.meta.env.VITE_APP_URL,
        }
      });
      if (error) {
        throw error;
      }
      else {
        setSuccess('Logged in successfully!');
        console.log("data", data);
        setError(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSocialLogin = (socialProvider) => {
    return async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: socialProvider,
          options: {
            redirectTo: redirectUrl ?? import.meta.env.VITE_APP_URL,
          }
        })
        if (error) {
          throw error;
        }
        else {
          setSuccess('Logged in successfully!');
          console.log("data", data);
          setError(null);
        }
      } catch (error) {
        setError(error.message);
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
        <div className='social-login-container'>
          <button className="social-button" onClick={() => handleSocialLogin('github')()}>Login with GitHub</button>
          <button className="social-button" onClick={() => handleSocialLogin('google')()}>Login with Google</button>
        </div>
        <div>or</div>
        { !isWaitingOtp && 
        <div className='email-login-container'>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="login-button" onClick={handleMagicLinkLogin}>Continue with email</button>
        </div>
        }
        {isWaitingOtp && 
        <div>
          <input
            type="text"
            placeholder="One Time Password"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="login-button" onClick={handleVerifyOtpLogin}>Login with OTP</button>
          <button className="login-button" onClick={() => setIsWaitingOtp(false)}>Cancel</button>
        </div>
        }
        <div>
          {!isWaitingOtp &&
            <a href="#" onClick={(e) => { e.preventDefault(); setIsWaitingOtp(true); }}>Already have a verification code?</a>
          }
        </div>
      </div>{/* End of Login Container */}
    </div>
  );
}

export default LoginWidget;