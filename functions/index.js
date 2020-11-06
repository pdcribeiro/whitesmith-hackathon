const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { object } = require('firebase-functions/lib/providers/storage');

admin.initializeApp();

exports.match = functions.https.onRequest(async (req, res) => {
  // Grab user data.
  const user = JSON.parse(req.body);
  const { skills, interests } = user;
  console.dir(user);

  // Find matches.
  let matches = await admin
    .firestore()
    .collection('users')
    .where('interests', 'array-contains-any', skills)
    // .where('skills', 'array-contains-any', interests)  // only one array-contains-any condition is allowed per query
    .get()
    .then(
      querySnapshot =>
        querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) // free tier limits to ECMAScript 2017
      // querySnapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id }))
    );
  console.dir(matches);

  // Get skill names.
  const skillMap = await admin
    .firestore()
    .collection('skills')
    .get()
    .then(querySnapshot =>
      querySnapshot.docs.reduce((skills, doc) => ({
        ...skills,
        [doc.id]: doc.data().name,
      }), {})
    );
  console.dir(skillMap);

  matches = matches
    // Apply second condition.
    .filter(match => match.skills.some(skill => interests.includes(skill)))
    // Filter out irrelevant skills.
    .map(match => ({
      ...match,
      interests: match.interests
        .filter(interest => skills.includes(interest))
        .map(interest => skillMap[interest]),
      skills: match.skills
        .filter(skill => interests.includes(skill))
        .map(skill => skillMap[skill]),
    }));

  console.dir(matches);

  // Send back matches.
  res.set('Access-Control-Allow-Origin', '*');
  res.json(matches);
});
