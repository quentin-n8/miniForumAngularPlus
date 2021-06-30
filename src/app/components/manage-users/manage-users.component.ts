import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormControlName } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DialogConfirmComponent } from 'src/app/dialogs/dialog-confirm.component';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/UsersService';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  filterControl: FormControl;

  connectedUser: User;
  connectedUserSubscription: Subscription;

  users: User[] = [];
  filteredUsers: User[] = [];
  usersSubscription: Subscription;

  editedUser?: User;
  editUsernameControl: FormControl;
  isAdmin: boolean;

  dialogRefSubscription: Subscription;
  
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    )  {}

  ngOnInit(): void {
    
    this.usersService.connectedUserSubject.subscribe((user: User) => {
        this.connectedUser = user;
    });

    this.usersService.emitConnectedUser();

    this.usersService.usersSubject.subscribe((users: User[]) => {
        this.users = users;
        this.filteredUsers = users;

        this.filterControl = this.formBuilder.control('');

        this.filterControl.valueChanges.subscribe(filterValue => {
            if (filterValue) {
                this.filteredUsers = this.users.filter(user => user.username.includes(filterValue) || user.topics.includes(filterValue) || user.messages.includes(filterValue) || user.id?.toString().includes(filterValue));
            } else {
                this.filteredUsers = this.users;
            }
        });
    });

    this.usersService.emitUsers();

    this.editUsernameControl = this.formBuilder.control(['', [Validators.minLength(3), Validators.maxLength(50)]]);
    
    }

   changeIsAdmin() {
       if(this.editedUser!.isAdmin === false) {
           this.editedUser!.isAdmin= true;
       }
       else if (this.editedUser!.isAdmin === true) {
           this.editedUser!.isAdmin= false;
       }
       else if (this.editedUser!.isAdmin === undefined && this.isAdmin === true) {
            this.editedUser!.isAdmin= false;
       }
       else if (this.editedUser!.isAdmin === undefined && this.isAdmin === false) {
            this.editedUser!.isAdmin= true;
       }
   } 

  onChangeEditedUser(user: User): void {
    this.editedUser = (this.editedUser === user) ? undefined : user;
    this.editUsernameControl.setValue(user.username);
    this.isAdmin = (this.editedUser?.admin === true) ? true : false;
  }

  onEditUser(user: User): void {
    if (this.editUsernameControl.valid) {
        user.username = this.editUsernameControl.value;
        user.isAdmin = this.editedUser?.isAdmin;
        user.connectedUser = this.connectedUser;
        this.usersService.updateUser(user).subscribe((user: User) => {
            this.usersService.users = this.usersService.users.map((userElt: User) => {
                if (userElt.id === user.id) {
                    userElt.username = user.username;
                }
                return userElt;
             });

             this.usersService.emitUsers();

             this.snackBar.open('L\'utilisateur a bien été modifié', 'Fermer', { duration: 3000 });

             this.editedUser = undefined;
        }, error => {
            this.snackBar.open('Une erreur est survenue. Veuillez vérifier votre saisie', 'Fermer', { duration: 3000 });
        });
    }
  }

  onDeleteUser(user: User): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
            title: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
            content: 'Cette action est irréversible.',
            action: 'Supprimer'
        },
        autoFocus: false
    });

    this.dialogRefSubscription = dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
            this.usersService.deleteUser(user).subscribe(response => {
                this.usersService.users = this.usersService.users.filter(UserElt => UserElt.id !== user.id);
                this.usersService.emitUsers();
    
                this.editedUser = undefined;
    
                this.snackBar.open('L\'utilisateur a bien été supprimé', 'Fermer', { duration: 3000 });
            }, error => {
                this.snackBar.open('Une erreur est survenue. Veuillez vérifier votre saisie', 'Fermer', { duration: 3000 });
            });
        }
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRefSubscription) {
        this.dialogRefSubscription.unsubscribe();
    }

    if (this.usersSubscription) {
        this.usersSubscription.unsubscribe();
    }
  }

  getErrorMessage(FormControl: FormControl): string|void {

    if (FormControl.hasError('required')) {
        return 'Ce champ est obligatoire';
    }

    if (FormControl.hasError('minlength')) {
        return 'Vous devez entrer au moins ' + FormControl.getError('minlength').requiredLength + ' caractères';
    }

    if (FormControl.hasError('maxlength')) {
        return 'Vous ne pouvez pas entrer plus de ' + FormControl.getError('maxlength').requiredLength + ' caractères';
    }

    }

}
