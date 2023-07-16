import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, last, map, Observable, shareReplay, tap } from 'rxjs';
import {
  Category,
  Difficulty,
  ApiQuestion,
  Question,
  Results,
  Parts,
} from './data.models';
import { UtilitiesService } from './utilities.service';

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private API_URL = 'https://opentdb.com/';
  private latestResults!: Results;
  private readonly pattern: string = ':';
  // we implement a cache menism to fetch categories once
  private _cache$: Observable<Category[]>;

  constructor(
    private http: HttpClient,
    private utilitiesService: UtilitiesService
  ) {}

  getCategories(): Observable<Category[]> {
    // If no cache available we fetch the data via http request and create the cache.
    // This will trigger http request only once thanks to shareReplay operator
    if (!this._cache$) {
      this._cache$ = this.requestCategories().pipe(shareReplay(CACHE_SIZE));
    }

    return this._cache$.pipe(
      map((categories: Category[]) => this.getUniqueCategories(categories))
    );
  }

  /**
   * Returns sub categories for selected main category
   *
   *
   * @param selectedCategoryId - The ID of the selected main category
   * @returns The sub categories for the selected category
   *
   */
  getSubCategoryForCategory(
    selectedCategoryId: number
  ): Observable<Category[]> {
    return this._cache$.pipe(
      // Filter with only categories starting with the same name as the selected main category
      map((categories: Category[]) =>
        this.getCategoriesStartingWithSelectedCategory(
          categories,
          selectedCategoryId
        )
      ),
      // Rename subcategories by removing the first part of the name (the main catgory)
      map((categories) => this.getSecondPartOfCategoriesName(categories))
    );
  }

  createQuiz(
    categoryId: string,
    difficulty: Difficulty
  ): Observable<Question[]> {
    return this.http
      .get<{ results: ApiQuestion[] }>(
        `${
          this.API_URL
        }/api.php?amount=5&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`
      )
      .pipe(
        map((res) => {
          const quiz: Question[] = res.results.map((q) => ({
            ...q,
            all_answers: [...q.incorrect_answers, q.correct_answer].sort(() =>
              Math.random() > 0.5 ? 1 : -1
            ),
          }));
          return quiz;
        })
      );
  }

  computeScore(questions: Question[], answers: string[]): void {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.correct_answer == answers[index]) score++;
    });
    this.latestResults = { questions, answers, score };
  }

  getLatestResults(): Results {
    return this.latestResults;
  }

  private requestCategories() {
    return this.http
      .get<{ trivia_categories: Category[] }>(this.API_URL + 'api_category.php')
      .pipe(map((res) => res.trivia_categories));
  }

  /**
   * Returns unqiue categories by name start (everything before ':')
   *
   *
   * @param categories - All the categories
   * @returns The categories unique by name property
   *
   */
  private getUniqueCategories(categories: Category[]): Category[] {
    return (
      categories
        // Rename all categories by removing ': xxxx'
        .map((category) => ({
          ...category,
          name: this.utilitiesService.splitStringWithPatternAndGetPart(
            category.name,
            Parts.FISRT,
            this.pattern
          ),
        }))
        // Filter to remove doublons
        .filter(
          (cat1: Category, index: number, categoriesArray: Category[]) =>
            categoriesArray.findIndex(
              (cat2: Category) => cat2.name === cat1.name
            ) === index
        )
    );
  }

  /**
   * Returns categories starting with the same name as the selected category
   *
   *
   * @param categories - All the categories
   * @param selectedCategoryId - The id of the selected main category
   * @returns The categories starting with the same name as the selected category if found or an empty array if not found
   *
   */
  private getCategoriesStartingWithSelectedCategory(
    categories: Category[],
    selectedCategoryId: number
  ): Category[] {
    // Get the selected main category
    const category: Category | undefined = categories.find(
      (c) => c.id === selectedCategoryId
    );
    // If the main category was found, we filter with categories starting with the same name as the selected main catgory
    // If the main category was not found, we return an empty array
    return category
      ? categories.filter(
          (c) =>
            c.name.startsWith(
              this.utilitiesService.splitStringWithPatternAndGetPart(
                category.name,
                Parts.FISRT,
                this.pattern
              )
            ) && c.name.includes(this.pattern)
        )
      : [];
  }

  /**
   * Returns the categories renamed for subcategories
   *
   *
   * @param categories - The categories we want to rename
   * @returns The categories renamed
   *
   */
  private getSecondPartOfCategoriesName(categories: Category[]): Category[] {
    // We rename the category by removing the main category 'xxx: '
    return categories.map((c) => ({
      ...c,
      name: this.utilitiesService.splitStringWithPatternAndGetPart(
        c.name,
        Parts.LAST,
        this.pattern
      ),
    }));
  }
}
