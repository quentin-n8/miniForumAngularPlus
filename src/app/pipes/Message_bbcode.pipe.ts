import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../models/Message';

@Pipe({
  name: 'message_bbcode'
})
export class Message_bbcodePipe implements PipeTransform {

  transform(message: Message): string {

    message.content= message.content.replace("[b]","<b>");
    message.content= message.content.replace("[/b]","</b>");
    message.content= message.content.replace("[i]","<i>");
    message.content= message.content.replace("[/i]","</i>");
    message.content= message.content.replace("[u]","<u>");
    message.content= message.content.replace("[/u]","</u>");

    return message.content;
  }

}
