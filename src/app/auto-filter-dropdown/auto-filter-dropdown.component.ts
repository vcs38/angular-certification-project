import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericItem } from '../data.models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-auto-filter-dropdown',
  templateUrl: './auto-filter-dropdown.component.html',
  styleUrls: ['./auto-filter-dropdown.component.css'],
})
export class AutoFilterDropdownComponent<T extends GenericItem> {
  @Input()
  items$: Observable<T[]>;

  @Input()
  placeholder: string;

  @Input()
  set item(it: T) {
    if (it) {
      this.itemControl.setValue(it.name);
    } else {
      this.itemControl.setValue('');
    }
  }

  @Output()
  itemChange: EventEmitter<T> = new EventEmitter<T>();

  itemControl = new FormControl<string>('');

  itemSelected(item: T) {
    this.itemControl.setValue(item.name);
    this.itemChange.emit(item);
  }

  reset(): void {
    this.itemControl.setValue('');
  }
}
