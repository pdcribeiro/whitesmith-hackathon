import { Router } from '@reach/router';
import { useState } from 'react';

import './firebase.config';
import Login from './pages/Login';
import Register from './pages/Register';
import Matches from './pages/Matches';

function App() {
  const [user, setUser] = useState(null);
  console.dir(user);

  return (
    <>
      {user && <p>user: {user.id}</p>}
      <Router>
        <Login path="/" setUser={setUser} />
        <Register path="register" setUser={setUser} />
        <Matches path="matches" user={user} />
      </Router>
    </>
  );
}

export default App;
