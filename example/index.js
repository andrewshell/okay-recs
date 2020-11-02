const fs = require('fs');
const okayRecs = require('../index');

// Source of all user ratings in system.
const allUserRatings = JSON.parse(fs.readFileSync(__dirname + '/userRatings.json'));

// Subset of user ratings that you want recommendations and similar users for.
// Note: This example shows one user, but can work for multiple users at once.
const subUserRatings = {
    user10: allUserRatings['user10']
};

// Intermediate data structure used for userRecommendations.
// Should be cached.
const allProgramScores = okayRecs.programScores(allUserRatings);
fs.writeFileSync(__dirname + '/programScores.json', JSON.stringify(allProgramScores, null, 4));

// What programs are the users most likely to like?
const subUserRecommendations = okayRecs.userRecommendations(allProgramScores, subUserRatings);
fs.writeFileSync(__dirname + '/userRecommendations.json', JSON.stringify(subUserRecommendations, null, 4));

// What other users is this user similar to?
const subUserSimilarUsers = okayRecs.similarUsers(allUserRatings, subUserRatings);
fs.writeFileSync(__dirname + '/similarUsers.json', JSON.stringify(subUserSimilarUsers, null, 4));
