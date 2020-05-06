import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import * as ethers from "ethers";
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';

@Component({
    selector: 'app-wallet-create',
    templateUrl: './wallet-create.page.html',
    styleUrls: ['./wallet-create.page.scss'],
})
export class WalletCreatePage implements OnInit {
    password = "";
    password1 = "";
    walletName = "";
    walletNameError = "";
    ifEyeOpen = false;
    ifEyeOpen1 = false;
    passwordError = "";
    passwordError1 = "";

    constructor(
        private router: Router,
        private helper: HelperService,
        private global: GlobalService
    ) { }

    ngOnInit() {
    }

    toggleEyeOpen() {
        this.ifEyeOpen = !this.ifEyeOpen;
    }

    toggleEyeOpen1() {
        this.ifEyeOpen1 = !this.ifEyeOpen1;
    }
    async createWallet() {
        this.walletNameError = "";
        this.passwordError = "";
        this.passwordError1 = "";
        if (!this.walletName) {
            let message = await this.helper.getTranslate('WALLET_NAME_EMPTY');
            this.walletNameError = message;
            return
        }
        if (!this.password) {
            let message = await this.helper.getTranslate('PASSWORD_EMPTY');

            this.passwordError = message;
            return
        }
        if (!this.password1) {
            let message = await this.helper.getTranslate('PASSWORD_EMPTY');

            this.passwordError1 = message;
            return
        }
        if (this.password1 != this.password) {
            let message = await this.helper.getTranslate('PASSEORD_DIFFERENT');

            this.passwordError1 = message;
            return
        }
        let wallet = ethers.Wallet.createRandom();
        let navigationExtras: NavigationExtras = {
            state: {
                wallet: wallet,
                action: 'backup'
            }
        };
        this.global.walletName = this.walletName;
        this.global.paymentPassword = this.password;
        this.router.navigate(['export-mnemonic'], navigationExtras);
    }
    importWallet() {
        this.router.navigate(['wallet-import']);
    }

    checkWalletName() {
    }

    checkPassword() {

    }

    checkPassword1() {

    }

}
