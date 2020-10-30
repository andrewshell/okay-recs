const fs = require('fs');
const userRecommendations = require('../index');
const userRatings = JSON.parse(fs.readFileSync(__dirname + '/userRatings.json'));

const recs = userRecommendations(userRatings);

fs.writeFileSync(__dirname + '/userRecommendations.json', JSON.stringify(recs, null, 4));
