import { Component, OnDestroy } from '@angular/core';
import { Category, Difficulty, Question } from '../data.models';
import { Observable, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { QuizService } from '../quiz.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css'],
})
export class QuizMakerComponent implements OnDestroy {
  categories$: Observable<Category[]>;
  subCategories$: Observable<Category[]>;
  questions$!: Observable<Question[]>;
  mainCategory: Category;
  subCategory: Category;

  private destroyed$: Subject<void> = new Subject();

  constructor(private quizService: QuizService) {
    this.categories$ = quizService.getCategories();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  createQuiz(difficulty: string): void {
    this.questions$ = this.quizService.createQuiz(
      (this.subCategory?.id || this.mainCategory.id)!.toString(),
      difficulty as Difficulty
    );
  }

  mainCategoryChanged(category: Category): void {
    this.mainCategory = category;
    this.subCategory = null;
    this.subCategories$ = this.quizService.getSubCategoryForCategory(
      category.id
    );
    this.quizService
      .getFirstSubCategoryForCategory(category.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((category: Category | null) => (this.subCategory = category));
  }
}
