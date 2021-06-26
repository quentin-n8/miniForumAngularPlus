import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Topic } from '../models/Topic';

@Pipe({ name: 'topicInfos' })
export class TopicInfosPipe implements PipeTransform {
    transform(topic: Topic): string {
        const datePipe = new DatePipe('en');
        return `Posté le ${datePipe.transform(topic.date, 'dd/MM/yyyy')} à ${datePipe.transform(topic.date, 'hh:mm')} par ${topic.author.username}`;
    }
}