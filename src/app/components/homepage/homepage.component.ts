import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Topic } from 'src/app/models/Topic';
import { User } from 'src/app/models/User';
import { TopicsService } from 'src/app/services/TopicsService';
import { UsersService } from 'src/app/services/UsersService';

@Component({
    selector: 'homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
    form!: FormGroup;
    filterControl!: FormControl;

    connectedUser!: User;
    connectedUserSubscription!: Subscription;

    topics?: Topic[];
    topicsSubscription?: Subscription;

    editMode?: Topic;
    editTopicControl!: FormControl;

    constructor(
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private topicsService: TopicsService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.usersService.connectedUserSubject.subscribe((user: User) => {
            this.connectedUser = user;            

            this.form = this.formBuilder.group({
                title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
                content: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(3000)]],
            });

            this.filterControl = this.formBuilder.control('');
        });

        this.usersService.emitConnectedUser();

        this.topicsService.topicsSubject.subscribe((topics: Topic[]) => this.topics = topics);
        this.topicsService.emitTopics();

        this.editTopicControl = this.formBuilder.control(['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]);
    }

    onChangeEditMode(topic: Topic): void {
        this.editMode = this.editMode === topic ? undefined : topic;
        this.editTopicControl.setValue(topic.title);
    }

    onEditTopic(topic: Topic) {
        if (this.editTopicControl.valid) {
            this.topicsService.updateTopic(topic, this.editTopicControl.value).subscribe((topic: Topic) => {
                this.topicsService.topics = this.topicsService.topics.map(topicElt => {
                    if (topicElt.id === topic.id) {
                        topicElt.title = topic.title;
                    }

                    return topicElt;
                 });

                 this.topicsService.emitTopics();

                 this.snackBar.open('Le titre du sujet a bien été modifié', 'Fermer', { duration: 3000 });

                 this.editMode = undefined;
            }, error => {
                this.snackBar.open('Une erreur est survenue. Veuillez vérifier votre saisie', 'Fermer', { duration: 3000 });
            });
        }
    }

    onSubmit(): void {
        if (this.form.valid) {
            const topic: Topic = {
                title: this.form.value.title,
                date: new Date().getTime(),
                user: this.connectedUser,
                content: this.form.value.content,
            };

            this.topicsService.createNewTopic(topic).subscribe((topic: Topic) => {
                this.topicsService.topics.push(topic);
                this.topicsService.emitTopics();

                this.snackBar.open('Votre sujet a bien été posté', 'Fermer', { duration: 3000 });

                this.form.reset();

                Object.keys(this.form.controls).forEach(formControlName => {
                    this.form.controls[formControlName].setErrors(null);
                  });
            }, error => {
                this.snackBar.open('Une erreur est survenue. Veuillez vérifier votre saisie', 'Fermer', { duration: 3000 });
            });
        }
    }

    getErrorMessage(formControlName: string | null, formControlParam?: FormControl): string|void {
        const formControl = formControlName !== null ? this.form.controls[formControlName] : formControlParam;

        if (formControl!.hasError('required')) {
            return 'Ce champ est obligatoire';
        }

        if (formControl!.hasError('minlength')) {
            return 'Vous devez entrer au moins ' + formControl!.getError('minlength').requiredLength + ' caractères';
        }

        if (formControl!.hasError('maxlength')) {
            return 'Vous ne pouvez pas entrer plus de ' + formControl!.getError('maxlength').requiredLength + ' caractères';
        }
    }
}
