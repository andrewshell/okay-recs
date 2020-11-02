/*  The MIT License (MIT)
    Copyright (c) 2020 Andrew Shell

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
    */

module.exports = {
    setRatingKey,
    programScores,
    similarUsers,
    userRecommendations,
}

let ratingKey = function(rating) {
    return rating;
}

function setRatingKey(newRatingKey) {
    if ('function' === typeof newRatingKey) {
        ratingKey = newRatingKey;
    }
}

function programScores(allUserRatings) {

    const allProgramScores = {};

    Object.keys(allUserRatings).forEach((screenname) => {
        const idprograms = Object.keys(allUserRatings[screenname]);
        if (2 > idprograms.length) {
            return;
        }

        idprograms.forEach((idSrc) => {
            idprograms.forEach((idDest) => {
                if (idSrc === idDest) {
                    return;
                }

                const rating = ratingKey(allUserRatings[screenname][idSrc]);

                if (!allProgramScores[idSrc]) {
                    allProgramScores[idSrc] = {};
                }

                if (!allProgramScores[idSrc][rating]) {
                    allProgramScores[idSrc][rating] = {};
                }

                if (!allProgramScores[idSrc][rating][idDest]) {
                    allProgramScores[idSrc][rating][idDest] = { score: 0, count: 0 };
                }

                allProgramScores[idSrc][rating][idDest].score += allUserRatings[screenname][idDest];
                allProgramScores[idSrc][rating][idDest].count++;
            });
        });
    });

    return allProgramScores;
}

function userRecommendations(allProgramScores, subUserRatings) {

    return Object.keys(subUserRatings).reduce((userrecs, screenname) => {
        const user = subUserRatings[screenname], recs = {};

        Object.keys(user).forEach((idSrc) => {
            const rating = ratingKey(subUserRatings[screenname][idSrc]);

            if (allProgramScores[idSrc][rating]) {
                Object.keys(allProgramScores[idSrc][rating]).forEach((idDest) => {
                    // Already rated
                    if (user[idDest]) {
                        return;
                    }

                    if (!recs[idDest]) {
                        recs[idDest] = { idprogram: idDest, score: 0, count: 0 };
                    }

                    recs[idDest].score += allProgramScores[idSrc][rating][idDest].score;
                    recs[idDest].count += allProgramScores[idSrc][rating][idDest].count;
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

function similarUsers(allUserRatings, subUserRatings) {

    return Object.keys(subUserRatings).reduce((usersims, nameDest) => {
        const userDest = subUserRatings[nameDest], sims = {};

        Object.keys(allUserRatings).forEach((nameSrc) => {
            if (nameSrc === nameDest) {
                // Don't rank self
                return;
            }

            if (!sims[nameSrc]) {
                sims[nameSrc] = { screenname: nameSrc, score: 0, count: 0 };
            }

            Object.keys(allUserRatings[nameSrc]).forEach((idSrc) => {
                if (!userDest[idSrc]) {
                    // user didn't rate this program
                    return;
                }

                if (userDest[idSrc] === allUserRatings[nameSrc][idSrc]) {
                    // Perfect match
                    sims[nameSrc].score += 2;
                }

                if (1 === Math.abs(userDest[idSrc] - allUserRatings[nameSrc][idSrc])) {
                    // Close match
                    sims[nameSrc].score += 1;
                }

                sims[nameSrc].count++;
            });
        });

        usersims[nameDest] = Object.values(sims).sort((a, b) => {
            if (a.score === b.score) {
                return a.count - b.count;
            }

            return a.score - b.score;
        }).reverse().map((sim) => {
            return {
                screenname: sim.screenname,
                rating: sim.score,
                confidence: sim.count
            }
        });

        return usersims;
    }, {});

}
