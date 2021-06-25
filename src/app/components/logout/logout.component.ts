import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/UsersService';

@Component({
    selector: 'logout',
    template: ''
})
export class LogoutComponent implements OnInit {
    constructor(
        private usersService: UsersService,
        private router: Router
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.usersService.removeConnectedUserFromLocalStorage();
        }, 0);

        this.router.navigate(['/']);
    }
}
