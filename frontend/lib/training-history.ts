export interface SessionSummary {
  topic: string;
  difficulty: string;
  accuracy: number;
  timeTaken: number;
  date: string;
}

const STORAGE_KEY = "skillsprint_training_history";

export const getTrainingHistory = (): SessionSummary[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const saveSessionMetrics = (session: SessionSummary) => {
  if (typeof window === "undefined") return;
  const history = getTrainingHistory();
  history.push(session);
  // Keep only last 5 global sessions
  if (history.length > 5) {
    history.shift();
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const calculateTrend = (history: SessionSummary[]) => {
  if (history.length < 2) return 0;
  const latest = history[history.length - 1].accuracy;
  const previous = history[history.length - 2].accuracy;
  return latest - previous; // Positive means improving
}

export const analyzeWeaknesses = (): string => {
  const history = getTrainingHistory();
  if (history.length === 0) return "Not enough data. Start a new session.";
  
  // Find topic with lowest average accuracy
  const weakData: { [key: string]: { sum: number, count: number } } = {};
  history.forEach(h => {
    if (!weakData[h.topic]) weakData[h.topic] = { sum: 0, count: 0 };
    weakData[h.topic].sum += h.accuracy;
    weakData[h.topic].count += 1;
  });

  let weakest = { topic: "", avg: 100 };
  Object.keys(weakData).forEach(k => {
    const avg = weakData[k].sum / weakData[k].count;
    if (avg < weakest.avg) {
      weakest = { topic: k, avg };
    }
  });

  if (weakest.avg < 60) {
    return `Critical anomaly detected in [${weakest.topic}] (Avg: ${Math.round(weakest.avg)}%). Focus next operation here.`;
  }
  return `Foundation stable. All domains operating within acceptable parameters.`;
}

export const recommendDifficulty = (accuracy: number, currentDifficulty: string): { newDifficulty: string, action: string, direction: "UP" | "DOWN" | "STAY" } => {
  let nextDiff = currentDifficulty || "Medium";
  let dir: "UP" | "DOWN" | "STAY" = "STAY";
  let action = "Retry Same Level";

  const diffMap: {[key:string]: number} = { "Easy": 1, "Medium": 2, "Hard": 3 };
  const val = diffMap[nextDiff] || 2;

  if (accuracy > 80) {
    if (val < 3) {
      nextDiff = Object.keys(diffMap).find(k => diffMap[k] === val + 1) || "Hard";
      dir = "UP";
      action = "Try Harder Mode";
    }
  } else if (accuracy < 50) {
    if (val > 1) {
      nextDiff = Object.keys(diffMap).find(k => diffMap[k] === val - 1) || "Easy";
      dir = "DOWN";
      action = "Practice Weak Area";
    }
  }

  return { newDifficulty: nextDiff, action, direction: dir };
};
