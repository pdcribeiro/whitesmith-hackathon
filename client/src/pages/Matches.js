export default function Matches({ matches }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Skills</th>
          <th>Interests</th>
        </tr>
      </thead>
      <tbody>
        {matches.map(({ username, skills, interests }, index) => (
          <tr key={index}>
            <td>{username}</td>
            <td>{skills.join(', ')}</td>
            <td>{interests.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
