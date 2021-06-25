import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/UsersService';

@Component({
    selector: 'sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {
    form!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            passwordConfirm: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            rememberMe: false
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            const user: User = {
                username: this.form.value.username,
                password: this.form.value.password,
                passwordConfirm: this.form.value.passwordConfirm
            }
    
            this.usersService.createNewUser(user).subscribe((user: User) => {
                this.usersService.connectedUser = user;
                this.usersService.emitConnectedUser();
    
                this.router.navigate(['/']);
            }, error => {
                console.log(error);
            });
        }
    }

    ngOnDestroy(): void {

    }

    getErrorMessage(formControlName: string): string|void {
        if (this.form.controls[formControlName].hasError('required')) {
            return 'Ce champ est obligatoire';
        }

        if (this.form.controls[formControlName].hasError('minlength')) {
            return 'Vous devez entrer au moins ' + this.form.controls[formControlName].getError('minlength').requiredLength + ' caractères';
        }

        if (this.form.controls[formControlName].hasError('maxlength')) {
            return 'Vous ne pouvez pas entrer plus de ' + this.form.controls[formControlName].getError('maxlength').requiredLength + ' caractères';
        }
    }
}
