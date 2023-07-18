import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matching',
})
export class MatchingPipe implements PipeTransform {
  transform(value: string, search: string): string {
    const indices: number[] = this.getIndicesOf(search, value);
    let transformed: string = '';
    let startIndex: number = 0;
    indices.forEach((index) => {
      const next: number = index + search.length;
      transformed += value.substring(startIndex, index);
      transformed += '<b>';
      transformed += value.substring(index, next);
      transformed += '</b>';
      startIndex = next;
    });
    transformed += value.substring(startIndex, value.length);

    return transformed;
  }

  private getIndicesOf(searchStr: string, str: string) {
    const searchStrLen: number = searchStr.length;
    if (searchStrLen == 0) {
      return [];
    }
    let startIndex: number = 0;
    let index: number;
    let indices: number[] = [];
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
    }
    return indices;
  }
}
