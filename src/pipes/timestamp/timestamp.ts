import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TimestampPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    const prev = new Date();
    const date = new Date(value);

    const timestamp: number = Math.floor((prev.valueOf() - date.valueOf()) / 1000);

    let message = '';
    if (timestamp < 10) {
      message = 'just now';
    } else if (timestamp < 60) {
      message = 'a few seconds ago';
    } else if (timestamp < 119) {
      message = '1m';
    } else if (timestamp < 3600) {
      message = Math.floor(timestamp / 60) + 'm';
    } else if (timestamp < 7199) {
      message = 'an hour ago';
    } else if (timestamp < 86400) {
      message = Math.floor(timestamp / 3600) + 'h';
    } else if (timestamp < 172799) {
      message = 'yesterday';
    } else if (timestamp < 432000) {
      message = Math.floor(timestamp / 86400) + 'd';
    } else if (date.valueOf() > 100000) {
      message = date.toDateString();
    } else {
      message = '';
    }
    return message;
  }
}
