export interface Category {
  id: number;
  name: string;
}

export interface ApiQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
  category: string;
  difficulty: string;
}

export interface Results {
  questions: Question[];
  answers: string[];
  score: number;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export enum Parts {
  FISRT = 0,
  LAST = 1,
}

export interface GenericItem {
  id: number;
  name: string;
}
