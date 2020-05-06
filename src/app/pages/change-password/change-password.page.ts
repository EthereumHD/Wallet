import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../providers/helper/helper.service';
import { GlobalService } from '../../providers/global/global.service';
import { Platform, NavController } from '@ionic/angular';


@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.page.html',
    styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
    password = "";
    password1 = "";
    password2 = "";

    ifEyeOpen = false;
    ifEyeOpen1 = false;
    ifEyeOpen2 = false;

    passwordError = "";
    passwordError1 = "";
    passwordError2 = "";

    ifShowLoading = false;

    wallet: any = {};

    constructor(
        private helper: HelperService,
        private navCtrl: NavController,
        private global: GlobalService,
    ) { }

    ngOnInit() {
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
    }

    toggleEyeOpen() {
        this.ifEyeOpen = !this.ifEyeOpen;
    }

    toggleEyeOpen1() {
        this.ifEyeOpen1 = !this.ifEyeOpen1;
    }

    toggleEyeOpen2() {
        this.ifEyeOpen2 = !this.ifEyeOpen2;
    }

    async checkPassword() {
        this.passwordError = "";
        if (!this.password) {
            let error = await this.helper.getTranslate('ORIGINAL_PASSWORD_EMPTY');
            this.passwordError = error;
        }
    }

    async checkPassword1() {
        this.passwordError1 = "";
        if (!this.password1) {
            let error = await this.helper.getTranslate('NEW_PASSWORD_EMPTY');
            this.passwordError1 = error;
        } else if (!/^[\da-zA-Z]{6,18}$/.test(this.password1) || /^[\d]+$/.test(this.password1) || /^[a-zA-Z]+$/.test(this.password1)) {
            let error = await this.helper.getTranslate('PASSWORD_RULE');
            this.passwordError1 = error;
        }
    }

    async checkPassword2() {
        this.passwordError2 = "";
        if (!this.password2) {
            let error = await this.helper.getTranslate('NEW_PASSWORD_EMPTY');
            this.passwordError2 = error;
        } else if (this.password2 != this.password1) {
            let error = await this.helper.getTranslate('PASSEORD_DIFFERENT');
            this.passwordError2 = error;
        }
    }
    async changePassword() {
        await this.checkPassword();
        if (this.passwordError) {
            return;
        }

        await this.checkPassword1();
        if (this.passwordError1) {
            return;
        }

        await this.checkPassword2();
        if (this.passwordError2) {
            return;
        }

        this.ifShowLoading = true;

        setTimeout(async () => {
            let ret = this.helper.decryptPrivateKey(this.wallet.keystore, this.password);
            if (ret.flag) {
                this.ifShowLoading = false;
                let privateKey = ret.privateKey;
                let keystore = this.helper.exportKeystore(privateKey, this.password1);
                this.wallet.keystore = keystore;
                this.helper.saveWallet();
                setTimeout(async () => {
                    let error = await this.helper.getTranslate('CHANGE_PASSWORD_SUCCEED');

                    this.helper.toast(error);
                }, 50);
                setTimeout(() => {
                    this.navCtrl.pop();
                }, 1000)
            } else {
                this.ifShowLoading = false;
                let error = await this.helper.getTranslate('PASSWORD_ERROR');
                this.passwordError = error;
            }
        }, 50)
    }

}
