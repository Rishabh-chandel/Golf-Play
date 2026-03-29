import Score from '../models/Score.js';

export const generateRandomDraw = () => {
  const numbers = new Set();
  while (numbers.size < 5) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNum);
  }
  // Shuffle using Fisher-Yates and sort
  const arr = Array.from(numbers);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.sort((a, b) => a - b);
};

export const generateAlgorithmicDraw = async (mode = 'most_frequent') => {
  // Aggregate all scores
  const allScores = await Score.find({});
  const frequencyMap = new Map();
  
  for (let i = 1; i <= 45; i++) {
    frequencyMap.set(i, 0);
  }

  allScores.forEach(doc => {
    doc.scores.forEach(s => {
      frequencyMap.set(s.value, frequencyMap.get(s.value) + 1);
    });
  });

  const numberEntries = Array.from(frequencyMap.entries()); // [number, frequency]

  if (mode === 'most_frequent') {
    numberEntries.sort((a, b) => b[1] - a[1]);
  } else {
    numberEntries.sort((a, b) => a[1] - b[1]);
  }

  // Take top numbers with some weighted randomness or just top 5
  // For weighted random:
  const getWeightedRandom = (entries) => {
    const totalWeight = entries.reduce((acc, curr) => acc + (curr[1] === 0 ? 1 : curr[1]), 0);
    let random = Math.random() * totalWeight;
    for (let entry of entries) {
      random -= (entry[1] === 0 ? 1 : entry[1]);
      if (random <= 0) return entry[0];
    }
    return entries[entries.length - 1][0];
  };

  const winningNumbers = new Set();
  while (winningNumbers.size < 5) {
    const chosen = mode === 'random' ? generateRandomDraw()[0] : getWeightedRandom(numberEntries);
    winningNumbers.add(chosen);
  }

  return Array.from(winningNumbers).sort((a, b) => a - b);
};

export const matchUserScores = (userScoreValues, winningNumbers) => {
  const matchCount = userScoreValues.filter(val => winningNumbers.includes(val)).length;
  const matchedNumbers = userScoreValues.filter(val => winningNumbers.includes(val));
  return { matchCount, matchedNumbers };
};
