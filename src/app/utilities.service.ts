import { Injectable } from '@angular/core';
import { Parts } from './data.models';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  /**
   * Returns the desired part of a string spliited with a pattern.
   *
   *
   * @param s - The string to split
   * @param part - The part of the string we want
   * @param patternToSplit - The pattern to split in the string
   * @returns The desired part if found or an empty string if not found
   *
   */
  splitStringWithPatternAndGetPart(
    s: string,
    part: Parts,
    patternToSplit: string
  ): string {
    const splittedString = s.split(patternToSplit);
    switch (part) {
      case Parts.FISRT:
        return splittedString[0];
      case Parts.LAST:
        return splittedString.length > 0 ? splittedString[1] : '';
    }
  }
}
