import { QUESTION_POOL, Question } from "@/data/question_pool";

export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generateTestSet(domain: string): Question[] {
  // 1. Get Aptitude Pool
  const aptitudePool = QUESTION_POOL.filter((q: Question) => q.domain === "aptitude");
  const aptEasy = shuffle(aptitudePool.filter((q: Question) => q.difficulty === "easy")).slice(0, 3);
  const aptMod = shuffle(aptitudePool.filter((q: Question) => q.difficulty === "moderate")).slice(0, 2);

  // 2. Get Domain Tech Pool
  const techPool = QUESTION_POOL.filter((q: Question) => q.domain === domain || (domain === "ai-ml" && q.domain === "ai-ml")); 
  const techSet = shuffle(techPool).slice(0, 15);

  // 3. Combine in order: 5 Aptitude (fixed start) + 15 Tech
  // DO NOT shuffle the final array to preserve the 1-5 aptitude requirement.
  return [...aptEasy, ...aptMod, ...techSet] as Question[];
}
