export interface PictionaryGameConfiguration {
  wordLists: string;
  timer: number;
}

export const defaultPictionaryConfig: PictionaryGameConfiguration = {
  wordLists: 'pictionary_german',
  timer: 100,
};
export const POINTS_PER_ANSWER = 5;
export const LETTER_THRESHOLDS = [20, 10, 5];
export const ALWAYS_VISIBLE_LETTERS = [' ', '-'];
export const POINTS_PER_FOLLOWING_ANSWERS = 10;
