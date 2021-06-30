import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from '../models/Message';

@Injectable()
export class MessagesService {
    apiUrl = 'http://localhost:8080/api/message/';
    
    constructor(private httpClient: HttpClient) { }

    postNewMessage(message: Message): Observable<Message> {
        return this.httpClient.post<Message>(this.apiUrl, message);
    }

    getMessages(): Observable<Message[]> {
        return this.httpClient.get<Message[]>(this.apiUrl, { observe: 'body' });
    }

    getMessage(id: number): Observable<Message> {
        return this.httpClient.get<Message>(this.apiUrl + id, { observe: 'body' });
    }

    updateMessage(message: Message, content: string): Observable<Message> {
        return this.httpClient.patch<Message>(this.apiUrl + message.id, { content });
    }

    deleteMessage(message: Message): Observable<any> {
        return this.httpClient.delete(this.apiUrl + message.id);
    }

}