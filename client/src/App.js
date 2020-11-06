import { Router } from '@reach/router';

import Profile from './pages/Profile';
import Matches from './pages/Matches';

function App() {
  return (
    <Router>
      <Profile path="/" />
      <Matches path="matches" />
    </Router>
  );
}

export default App;
