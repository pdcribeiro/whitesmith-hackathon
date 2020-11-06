import { Router } from '@reach/router';
import { useState } from 'react';

import Profile from './pages/Profile';
import Matches from './pages/Matches';

function App() {
  const [matches, setMatches] = useState([]);

  return (
    <Router>
      <Profile path="/" setMatches={setMatches} />
      <Matches path="matches" matches={matches} />
    </Router>
  );
}

export default App;
