const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

exports.match = functions.https.onRequest(async (req, res) => {
  // Grab user data.
  const user = JSON.parse(req.body);
  const { skills, interests } = user;
  console.dir('user', user);

  // Find matches.
  let matches = await admin
    .firestore()
    .collection('users')
    .where('interests', 'array-contains-any', skills)
    // .where('skills', 'array-contains-any', interests)  // only one array-contains-any condition is allowed per query
    .get()
    .then(querySnapshot =>
      querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))  // free tier limits to ECMAScript 2017
      // querySnapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }))
    );

  matches = matches
    // Apply second condition.
    .filter(match => match.skills.some(skill => interests.includes(skill)))
    // Filter out irrelevant skills.
    .map(match => ({
      ...match,
      interests: match.interests.filter(interest => skills.includes(interest)),
      skills: match.skills.filter(skill => interests.includes(skill)),
    }));

  console.dir(matches);

  // Send back matches.
  res.set('Access-Control-Allow-Origin', '*');
  res.json(matches);
});
