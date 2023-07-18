import { Pipe, PipeTransform } from '@angular/core';
import { GenericItem } from '../data.models';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform<T extends GenericItem>(items: T[], searchText: string): T[] {
    // return empty array if array is falsy
    if (!items) {
      return [];
    }

    // return the original array if search text is empty
    if (!searchText) {
      return items;
    }

    // convert the searchText to lower case
    searchText = searchText.toLowerCase();

    // retrun the filtered array
    return items.filter((item) => item.name.toLowerCase().includes(searchText));
  }
}
