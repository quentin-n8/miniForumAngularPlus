import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './routes';
import { RouterModule } from '@angular/router';

import { HomepageComponent } from './components/homepage/homepage.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { LogoutComponent } from './components/logout/logout.component';
import { TopicComponent } from './components/topic/topic.component';

import { UsersService } from './services/UsersService';
import { TopicsService } from './services/TopicsService';
import { MessagesService } from './services/MessagesService';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    declarations: [
        AppComponent,
        HomepageComponent,
        EditUserComponent,
        LoginComponent,
        SignInComponent,
        LogoutComponent,
        TopicComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),
        HttpClientModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatSnackBarModule
    ],
    providers: [
        UsersService,
        TopicsService,
        MessagesService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
