# BingeWorthy Recommendations

Takes a structure of users and what they've rated various programs and returns
a structure with average rating of people with similar taste.

Confidence is the number of users that contributed to that rating.

I put this in a repo so we can track any changes we want to make and have
issues to talk about changes. Feel free to copy into your own project.

## Example:

```js
const userRatings = {
    "davewiner": {
        "https://www.metacritic.com/tv/112263": 1,
        "https://www.metacritic.com/tv/24": 4,
        "https://www.metacritic.com/tv/30-rock": 3,
        "https://www.metacritic.com/tv/alias": 2,
        "https://www.metacritic.com/tv/archer": 2,
        "https://www.metacritic.com/tv/arrested-development": 2,
        "https://www.metacritic.com/tv/band-of-brothers": 3,
    },
    "andrewshell": {
        "https://www.metacritic.com/tv/3rd-rock-from-the-sun": 2,
        "https://www.metacritic.com/tv/adventure-time": 4,
        "https://www.metacritic.com/tv/archer": 1,
        "https://www.metacritic.com/tv/arrested-development": 3,
        "https://www.metacritic.com/tv/better-call-saul": 4
    }
};

const recs = require('./bingerec')(userRatings);

console.dir(recs);
```

### Sample Output

```json
{
    "davewiner": [
        {
            "idprogram": "https://www.metacritic.com/tv/what-we-do-in-the-shadows-2019",
            "rating": 4,
            "confidence": 73
        },
        {
            "idprogram": "https://www.metacritic.com/tv/the-first",
            "rating": 4,
            "confidence": 50
        }
    ],
    "andrewshell": [
        {
            "idprogram": "https://www.metacritic.com/tv/what-we-do-in-the-shadows-2019",
            "rating": 4,
            "confidence": 74
        },
        {
            "idprogram": "https://www.metacritic.com/tv/year-of-the-rabbit",
            "rating": 4,
            "confidence": 48
        }
    ]
}
```
