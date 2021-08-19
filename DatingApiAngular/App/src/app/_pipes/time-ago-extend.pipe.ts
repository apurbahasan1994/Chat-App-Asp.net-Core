import { Pipe, PipeTransform } from '@angular/core';
import { TimeAgoPipe } from 'time-ago-pipe';

@Pipe({
  name: 'timeAgoExtend',
  pure: false
})
export class TimeAgoExtendPipe extends TimeAgoPipe {

}
