import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Difficulty, Question } from '../data.models';
import { QuizService } from '../quiz.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnDestroy {
  @Input({ required: true })
  question!: Question;
  @Input()
  correctAnswer?: string;
  @Input()
  userAnswer?: string;

  get changeVisible() {
    return QuestionComponent.changeVisible;
  }

  private static changeVisible: boolean = true;
  private destroyed$: Subject<void> = new Subject();

  constructor(private quizService: QuizService) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getButtonClass(answer: string): string {
    if (!this.userAnswer) {
      if (this.currentSelection == answer) return 'tertiary';
    } else {
      if (this.userAnswer == this.correctAnswer && this.userAnswer == answer)
        return 'tertiary';
      if (answer == this.correctAnswer) return 'secondary';
    }
    return 'primary';
  }

  @Output()
  change = new EventEmitter<string>();

  @Output() questionChange: EventEmitter<Question> = new EventEmitter();

  currentSelection!: string;

  buttonClicked(answer: string): void {
    this.currentSelection = answer;
    this.change.emit(answer);
  }

  changeQuestion(): void {
    QuestionComponent.changeVisible = false;

    this.quizService
      .getSingleQuestion(
        this.question.category,
        this.question.difficulty as Difficulty
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((newQuestion: Question) => {
        this.userAnswer = '';
        this.change.emit(this.userAnswer);
        this.questionChange.emit(newQuestion);
      });
  }
}
