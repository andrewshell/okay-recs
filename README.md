# Okay Recommendations

## User Recommendations

Takes a structure of users and what they've rated various programs and find
a list of other programs they might like based on similar ratings.

Rating is the average (mean) score of people who rated movies similar to you.
Confidence is the number of users that contributed to that rating.

## Similar Users

Takes a structure of users and what they've rated various programs and find
a list of other users with similar ratings.

Rating is the sum of scores (2 points for exact match, 1 point for close match)
Confidence is the number of program matches that contributed to that rating.

## Example:

There is a full example in example folder.

```js
const okayRecs = require('okay-recs');

// Source of all user ratings in system.
const allUserRatings = {
    "user0": {
        "https://www.metacritic.com/tv/112263": 1,
        "https://www.metacritic.com/tv/24": 4,
        "https://www.metacritic.com/tv/30-rock": 3,
        "https://www.metacritic.com/tv/alias": 2,
        "https://www.metacritic.com/tv/archer": 2,
        "https://www.metacritic.com/tv/arrested-development": 2,
        "https://www.metacritic.com/tv/band-of-brothers": 3,
        ...
    },
    "user1": {
        "https://www.metacritic.com/tv/3rd-rock-from-the-sun": 2,
        "https://www.metacritic.com/tv/adventure-time": 4,
        "https://www.metacritic.com/tv/archer": 1,
        "https://www.metacritic.com/tv/arrested-development": 3,
        "https://www.metacritic.com/tv/better-call-saul": 4
        ...
    },
    ...
};

// Subset of user ratings that you want recommendations and similar users for.
// Note: This example shows one user, but can work for multiple users at once.
const subUserRatings = {
    user10: allUserRatings['user10']
};

// Sum of scores of people who gave program 1 a rating of x gave to program 2
// Intermediate structure for user recommendations. Should be cached.
const allProgramScores = okayRecs.programScores(allUserRatings);

// What programs are the users most likely to like?
const subUserRecommendations = okayRecs.userRecommendations(allProgramScores, subUserRatings);

// What other users is this user similar to?
const subUserSimilarUsers = okayRecs.similarUsers(allUserRatings, subUserRatings);
```

### Output

```js
// subUserRecommendations
{
    "user10": [
        {
            "idprogram": "https://www.metacritic.com/tv/what-we-do-in-the-shadows-2019",
            "rating": 4,
            "confidence": 16
        },
        {
            "idprogram": "https://www.metacritic.com/tv/gentleman-jack",
            "rating": 4,
            "confidence": 13
        },
        {
            "idprogram": "https://www.metacritic.com/tv/the-first",
            "rating": 4,
            "confidence": 11
        },
        {
            "idprogram": "https://www.metacritic.com/tv/shangri-la-2019",
            "rating": 4,
            "confidence": 11
        },
        {
            "idprogram": "https://www.metacritic.com/tv/immigration-nation",
            "rating": 4,
            "confidence": 7
        },
        ...
}

// subUserSimilarUsers
{
    "user10": [
        {
            "screenname": "user23",
            "rating": 31,
            "confidence": 28
        },
        {
            "screenname": "user85",
            "rating": 31,
            "confidence": 24
        },
        {
            "screenname": "user65",
            "rating": 30,
            "confidence": 22
        },
        {
            "screenname": "user123",
            "rating": 29,
            "confidence": 22
        },
        {
            "screenname": "user139",
            "rating": 29,
            "confidence": 21
        },
        {
            "screenname": "user14",
            "rating": 29,
            "confidence": 20
        },
        ...
    ]
}
```
