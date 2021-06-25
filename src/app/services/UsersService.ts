import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/User';

@Injectable()
export class UsersService {
    apiUrl = 'http://localhost:8080/api/user/';

    users: User[] = [];
    usersSubject = new Subject<User[]>();

    connectedUser!: User;
    connectedUserSubject = new Subject<User>();

    constructor(private httpClient: HttpClient) { }

    emitUsers(): void {
        this.usersSubject.next(this.users);
    }

    emitConnectedUser(): void {
        this.connectedUserSubject.next(this.connectedUser);
    }

    createNewUser(user: User): Observable<User> {
        return this.httpClient.post<User>(this.apiUrl, user);
    } 
}