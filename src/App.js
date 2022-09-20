import './App.css';
import GoogleLogin from 'react-google-login';
import { useEffect, useState } from 'react';



function App() {

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleLogin
  });
  }, []);

  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
    ? JSON.parse(localStorage.getItem('loginData'))
    : null
  )

  const handleFailure = (result) => {
    alert('Log in Failed!');

  }

  const handleLogin = async (googleData) => {
    const res = await fetch("/api/v1/auth/google", {
        method: "POST",
        body: JSON.stringify({
        token: googleData.tokenId
      }),
      headers: {
        "Content-Type": "application/json"
      },
    });

    const data = await res.json()
    // store returned user somehow
    setLoginData(data);
    localStorage.setItem('loginData', JSON.stringify(data));
  };

  const handleLogout = () => {
    localStorage.removeItem('loginData');
    setLoginData(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>React App with Social Login Auth</h2>
        <div>
        {loginData ? (
            <div>
              <h3>You logged in as {loginData.email}</h3>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
          <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText='Login with Google'
          onSuccess={handleLogin}
          onFailure={handleFailure}
          cookiePolicy={'single_host_origin'}
          ></GoogleLogin>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
