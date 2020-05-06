import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService } from '../../providers/helper/helper.service';
import { GlobalService } from '../../providers/global/global.service';


@Component({
    selector: 'app-generate-privatekey',
    templateUrl: './generate-privatekey.component.html',
    styleUrls: ['./generate-privatekey.component.scss'],
})
export class GeneratePrivatekeyComponent implements OnInit {
    ifEyeOpen = false;
    promptError = "";
    paymentPassword: string = "";
    ifShowLoading = false;

    @Input() cancelText: string = "";
    @Input() confirmText: string = "";
    @Input() promptDesc: string = "";
    @Output() cancel = new EventEmitter<any>();
    @Output() confirm = new EventEmitter<any>();

    constructor(
        private helper: HelperService,
        private global: GlobalService,
    ) { }

    ngOnInit() {
        this.paymentPassword = "";
    }

    toggleEyeOpen() {
        this.ifEyeOpen = !this.ifEyeOpen;
    }

    cancelPrompt() {
        this.cancel.emit();
    }

    confirmPrompt() {
        let keystore = this.global.gWalletList[this.global.currentWalletIndex].keystore;
        this.promptError = "";
        if (!this.paymentPassword) {
            this.promptError = "";
            return;
        }
        this.ifShowLoading = true;
        setTimeout(() => {
            let ret = this.helper.decryptPrivateKey(keystore, this.paymentPassword);
            if (ret.flag) {
                this.ifShowLoading = false;
                this.paymentPassword = '';
                this.confirm.emit(ret.privateKey);
                return;
            } else {
                this.ifShowLoading = false;
                this.promptError = "";
            }
        }, 100);
    }

}
