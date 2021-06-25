import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from './models/User';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    connectedUser?: User;

    constructor() { }

    ngOnInit(): void {
        
    }

    ngOnDestroy(): void {

    }
}
