import { Component } from '@angular/core';
import { Category, Difficulty, Question } from '../data.models';
import { Observable, switchMap, take, tap } from 'rxjs';
import { QuizService } from '../quiz.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css'],
})
export class QuizMakerComponent {
  categories$: Observable<Category[]>;
  subCategories$: Observable<Category[]>;
  questions$!: Observable<Question[]>;
  mainCategoriesDropdown = new FormControl<Category['id']>(0);
  subCategoriesDropdown = new FormControl<Category['id']>(0);

  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getCategories();
    this.subCategories$ = this.mainCategoriesDropdown.valueChanges.pipe(
      // we get the id of the main category
      switchMap(
        (newValue: number | null): Observable<Category[]> =>
          // we return an observable of subcategories for the main category
          this.quizService.getSubCategoryForCategory(newValue!)
      ),

      tap((categories: Category[]) => {
        if (categories.length) {
          // if there is a subcategory we select the first item of the list
          this.subCategoriesDropdown.patchValue(categories[0].id);
        } else {
          this.subCategoriesDropdown.reset();
        }
      })
    );
  }

  createQuiz(difficulty: string): void {
    this.questions$ = this.quizService.createQuiz(
      (this.subCategoriesDropdown.value ||
        this.mainCategoriesDropdown.value)!.toString(),
      difficulty as Difficulty
    );
  }
}
