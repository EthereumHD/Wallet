import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
    @Input() title: string = "";
    @Input() desc: string = "";
    @Input() cancelText: string = "";
    @Input() confirmText: string = "";
    @Output() cancel = new EventEmitter<any>();
    @Output() confirm = new EventEmitter<any>();

    constructor() { }

    ngOnInit() { }

    confirmAlert() {
        this.confirm.emit();
    }

    cancelAlert() {
        this.cancel.emit();
    }

}
