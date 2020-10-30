/*  The MIT License (MIT)
    Copyright (c) 2014-2020 Andrew Shell

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

    structured listing: http://scripting.com/listings/pagepark.html
    */

module.exports = userRecommendations;

function ratingKey(rating) {
    if (1 < rating) {
        return 'likes';
    }
    return 'dislikes';
}

function userRecommendations(userRatings) {

    const scores = {};

    Object.keys(userRatings).forEach((screenname) => {
        const idprograms = Object.keys(userRatings[screenname]);
        if (2 > idprograms.length) {
            return;
        }

        idprograms.forEach((idsrc) => {
            idprograms.forEach((iddest) => {
                if (idsrc === iddest) {
                    return;
                }

                const rating = ratingKey(userRatings[screenname][idsrc]);

                if (!scores[idsrc]) {
                    scores[idsrc] = {};
                }

                if (!scores[idsrc][rating]) {
                    scores[idsrc][rating] = {};
                }

                if (!scores[idsrc][rating][iddest]) {
                    scores[idsrc][rating][iddest] = { score: 0, count: 0 };
                }

                scores[idsrc][rating][iddest].score += userRatings[screenname][iddest];
                scores[idsrc][rating][iddest].count++;
            });
        });
    });

    return Object.keys(userRatings).reduce((userrecs, screenname) => {
        const user = userRatings[screenname], recs = {};

        Object.keys(user).forEach((idsrc) => {
            const rating = ratingKey(userRatings[screenname][idsrc]);

            if (scores[idsrc][rating]) {
                Object.keys(scores[idsrc][rating]).forEach((iddest) => {
                    // Already rated
                    if (user[iddest]) {
                        return;
                    }

                    if (!recs[iddest]) {
                        recs[iddest] = { idprogram: iddest, score: 0, count: 0 };
                    }

                    recs[iddest].score += scores[idsrc][rating][iddest].score;
                    recs[iddest].count += scores[idsrc][rating][iddest].count;
                });
            }
        });

        userrecs[screenname] = Object.values(recs).sort((a, b) => {
            const amean = a.score / a.count,
                bmean = b.score / b.count;

            if (amean === bmean) {
                return a.count - b.count;
            }

            return amean - bmean;
        }).reverse().map((rec) => {
            return {
                idprogram: rec.idprogram,
                rating: rec.score / rec.count,
                confidence: rec.count
            }
        });

        return userrecs;
    }, {});

}
