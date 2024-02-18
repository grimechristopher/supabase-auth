import { useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'

import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

const { data } = supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session)

  // if (event === 'INITIAL_SESSION') {
  //   // handle initial session
  // } else if (event === 'SIGNED_IN') {
  //   // handle sign in event
  // } else if (event === 'SIGNED_OUT') {
  //   // handle sign out event
  // } else if (event === 'PASSWORD_RECOVERY') {
  //   // handle password recovery event
  // } else if (event === 'TOKEN_REFRESHED') {
  //   // handle token refreshed event
  // } else if (event === 'USER_UPDATED') {
  //   // handle user updated event
  // }


})

function LoginPage() {
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect-url');

  console.log('redirectUrl', redirectUrl);



  // // call unsubscribe to remove the callback
  // data.subscription.unsubscribe()

  return (
    <div>
      <div class="image-container">
        <img src="src/assets/cg-logo1.png"></img>
        <h1>Login</h1>
        <h2>chrisgrime.com</h2>
      </div>
      <Auth
        supabaseClient={supabase}
        redirectTo={redirectUrl ?? import.meta.env.VITE_APP_URL}
        view='magic_link'
        // magicLink={true}
        // view='verify_otp'
        showLinks={false}
        appearance={{ 
          theme: ThemeSupa,
          // variables: {
          //   default: {
          //     colors: {
          //       brand: 'red',
          //       brandAccent: 'darkred',
          //     },
          //   },
          // },
         }}
        providers={['github', /*'linkedin',*/ 'google']}
        theme="dark"
      />
    </div>
  );
}

export default LoginPage;