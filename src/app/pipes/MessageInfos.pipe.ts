import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../models/Message';

@Pipe({ name: 'messageInfos' })
export class MessageInfosPipe implements PipeTransform {
    transform(message: Message): string {
        const datePipe = new DatePipe('en');
        return `Par ${message.author!.username}, le ${datePipe.transform(message.date, 'dd/MM/yyyy')} à ${datePipe.transform(message.date, 'hh:mm')}`;
    }
}