import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/UsersService';

@Component({
    selector: 'sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
    form!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)], this.uniqueNameValidator()],
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
                if (this.form.value.rememberMe) {
                    this.usersService.saveConnectedUserToLocalStorage(user);
                } else {
                    this.usersService.connectedUser = user;
                    this.usersService.emitConnectedUser();
                }

                this.snackBar.open('Votre compte a bien été créé', 'Fermer', { duration: 3000 });
    
                this.router.navigate(['/']);
            }, error => {
                this.snackBar.open('Une erreur est survenue. Veuillez vérifier votre saisie', 'Fermer', { duration: 3000 });
            });
        }
    }

    uniqueNameValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return new Observable<ValidationErrors | null>(observer => {
                this.usersService.getUsers().subscribe((users: User[]) => {
                    if (users.find(user => user.username === control.value)) {
                        observer.next({uniqueName: {value: control.value}});
                    } else {
                        observer.next(null);
                    }

                    observer.complete();
                });
            });
        };
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

        if (this.form.controls[formControlName].hasError('uniqueName')) {
            return 'Ce nom d\'utilisateur est déjà utilisé';
        }
    }
}
