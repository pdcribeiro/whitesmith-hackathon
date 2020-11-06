import { useState } from 'react';

import { login } from '../firebase';

export default function Login({ setUser, navigate }) {
  const [username, setUsername] = useState('');

  async function handleLogin() {
    const user = await login(username);
    if (user) {
      setUser(user);
      navigate('/matches');
    }
  }

  return (
    <>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button type="submit" onClick={handleLogin}>
        Login
      </button>
      <button type="button" onClick={() => navigate('/register')}>
        Register
      </button>
    </>
  );
}
