import firebase from 'firebase';

const MATCH_URL = 'http://localhost:5001/whitesmith-hackaton/us-central1/match';

// export const auth = firebase.auth();
export const db = firebase.firestore();
export const functions = firebase.functions();

export async function getSkills() {
  return db
    .collection('skills')
    .get()
    .then(querySnapshot => [
      { id: '', name: 'select skill' },
      ...querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    ]);
}

export async function register(user) {
  const { username, ...rest } = user;
  const usernameAlreadyExists = (await login(username)) !== null;
  if (usernameAlreadyExists) throw new Error('username already exists');
  await db.collection('users').doc(username).set(rest);
  return { id: username, ...rest };
}

export async function login(username) {
  return db
    .collection('users')
    .doc(username)
    .get()
    .then(doc => (doc.exists ? { id: doc.id, ...doc.data() } : null));
}

export async function getMatches(user) {
  if (process.env.NODE_ENV === 'development')
    return fetch(MATCH_URL, {
      method: 'POST',
      body: JSON.stringify(user),
    }).then(response => response.json());
  else return functions.httpsCallable('match')(user);
}

export default firebase;
