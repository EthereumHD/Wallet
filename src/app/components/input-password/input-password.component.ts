import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-input-password',
    templateUrl: './input-password.component.html',
    styleUrls: ['./input-password.component.scss'],
})
export class InputPasswordComponent implements OnInit {
    ifEyeOpen = false;

    @Input() labelText: string = "";
    @Input() placeholder: string = "";
    @Input() ifHideEye = false;


    constructor() { }

    ngOnInit() { }

    toggleEyeOpen() {
        this.ifEyeOpen = !this.ifEyeOpen;
    }

}
