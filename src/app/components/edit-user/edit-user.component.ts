import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/UsersService';

@Component({
    selector: 'edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit, OnDestroy {
    form!: FormGroup;
    connectedUser?: User;
    connectedUserSubscription?: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.connectedUserSubscription = this.usersService.connectedUserSubject.subscribe((user: User) => {
            this.connectedUser = user;

            this.form = this.formBuilder.group({
                username: [user.username, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
                password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
                passwordConfirm: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
                oldPassword: ['', Validators.required]
            });
        });

        this.usersService.emitConnectedUser();
    }

    onSubmit(): void {
        if (this.form.valid) {
            const user: User = {
                id: this.connectedUser?.id,
                username: this.form.value.username,
                password: this.form.value.password,
                passwordConfirm: this.form.value.passwordConfirm,
                oldPassword: this.form.value.oldPassword
            }
    
            this.usersService.updateUser(user).subscribe((user: User) => {
                this.usersService.connectedUser = user;
                this.usersService.emitConnectedUser();

                this.snackBar.open('Votre compte a bien été modifié', 'Fermer', { duration: 3000 });
                
                this.router.navigate(['/']);
            }, error => {
                this.snackBar.open('Une erreur est survenue. Veuillez vérifier votre saisie', 'Fermer', { duration: 3000 });
            });
        }
    }

    ngOnDestroy(): void {
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
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
