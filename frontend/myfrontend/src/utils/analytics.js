export function parseScoresFromTopZones(topZones) {
    let scores = [];
    topZones.forEach((zone) => {
      let { busyness_scores, ...rest } = zone;
      busyness_scores.forEach((score) => {
        scores.push({
          ...rest,
          datetime: score[0],
          busyness_score: score[1],
          combined_score: score[1] + rest.demographic_score,
        });
      });
    });
    scores = scores
      .sort((a, b) => b.combined_score - a.combined_score)
      .map((item, ind) => ({
        key: ind + 1,
        ...item,
      }));
    return scores;
  }
  
  export function getDateArray(startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }