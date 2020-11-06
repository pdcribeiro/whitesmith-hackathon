import { Redirect } from '@reach/router';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Talk from 'talkjs';

import { getMatches } from '../firebase';

export default function Matches({ user }) {
  const [matches, setMatches] = useState([]);
  const chatRef = useRef();

  useEffect(() => {
    if (user) {
      getMatches(user).then(setMatches);

      Talk.ready.then(() => {
        window.me = new Talk.User({
          id: user.id,
          name: user.id,
        });

        window.talkSession = new Talk.Session({
          appId: 'tjXlBV9p',
          me: window.me,
        });

        window.inbox = window.talkSession.createInbox();
        window.inbox.mount(chatRef.current);
      });
    }
  }, [user]);

  function handleClick(match) {
    const other = new Talk.User({
      id: match.id,
      name: match.id,
    });

    const conversation = window.talkSession.getOrCreateConversation(
      Talk.oneOnOneId(window.me, other)
    );
    conversation.setParticipant(window.me);
    conversation.setParticipant(other);

    window.inbox.select(conversation);
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Skills</th>
            <th>Interests</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => {
            const { id, skills, interests } = match;
            return (
              <tr key={index} onClick={() => handleClick(match)}>
                <td>{id}</td>
                <td>{skills.join(', ')}</td>
                <td>{interests.join(', ')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {user ? (
        <ChatContainer ref={chatRef}></ChatContainer>
      ) : (
        <Redirect to="/" noThrow />
      )}
    </>
  );
}

const ChatContainer = styled.div`
  height: 440px;
`;
