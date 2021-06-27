import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'bh3-dialog-confirm',
    templateUrl: 'dialog-confirm.component.html',
    styleUrls: ['dialog-confirm.component.css']
})
export class DialogConfirmComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, content: string, action: string }) { }
}
