import { Component, OnInit } from '@angular/core';
import * as ethers from "ethers";
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { NativeService } from '../../providers/native/native.service';

@Component({
    selector: 'app-wallet-import',
    templateUrl: './wallet-import.page.html',
    styleUrls: ['./wallet-import.page.scss'],
})
export class WalletImportPage implements OnInit {
    mnemonic = "";
    password = "";
    password1 = "";
    passwordError = "";
    passwordError1 = "";
    ifEyeOpen1 = false;
    ifEyeOpen = false;
    mnemonicError = "";
    type = 'mnemonic';
    keystore = "";
    keystoreError = "";
    rate = 0;
    ifShowLoading = false;

    constructor(
        private router: Router,
        private helper: HelperService,
        private global: GlobalService,
        private navCtrl: NavController,
        private native: NativeService
    ) { }

    toggleEyeOpen() {
        this.ifEyeOpen = !this.ifEyeOpen;
    }

    toggleEyeOpen1() {
        this.ifEyeOpen1 = !this.ifEyeOpen1;
    }

    toggleImportType(type) {
        this.type = type;
    }

    ngOnInit() {
    }

    scan() {
        this.native.scan().then(async (res: any) => {
            console.log("SCAN RESULT：", res);
            this.keystore = res.text;
        }, res => {
            // if (res == 1) {

            // } else if (res == 0) {
            //     this.ifShowAlert = true;
            //     this.alertTitle = "";
            //     this.alertDesc = "";
            // } else {
            //     this.helper.toast("");
            // }
        })
    }

    importMnemonic() {
        let result = this.checkMnemonic();
        if (!result) {
            return null;
        } else {
            return this.importMnemonicWallet();
        }
    }
    async importKeystore() {
        let result = await this.checkKeystore();
        if (!result) {
            return Promise.resolve(null);
        }

        if (!this.password) {
            let error = await this.helper.getTranslate('PASSWORD_EMPTY');
            this.passwordError = error;
            return Promise.resolve(null);
        }

        let json = this.keystore;

        this.ifShowLoading = true;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 50)
        }).then(async () => {
            let wallet = this.helper.decryptPrivateKey(this.keystore, this.password);
            setTimeout(() => {
                this.ifShowLoading = false;
            }, 0);
            if (wallet.flag) {
                this.keystoreError = "";
                return wallet;
            } else {
                let error = await this.helper.getTranslate('KEYSTORE_ERROR');
                this.keystoreError = error;
                return null;
            }
        })
    }

    importMnemonicWallet() {
        let mnemonic = this.mnemonic.replace(/^\s+|\s+$/, '');
        mnemonic = mnemonic.replace(/\s{2,}/g, ' ');
        let wallet = ethers.Wallet.fromMnemonic(mnemonic);
        return wallet;
    }
    async checkMnemonic() {
        if (!this.mnemonic) {
            let error = await this.helper.getTranslate('MNEMONIC_EMPTY');
            this.mnemonicError = error
        }
        let mnemonic = this.mnemonic.replace(/^\s+|\s+$/, '');
        let mnemonicList = mnemonic.split(/\s+/);
        if (mnemonicList.length !== 24) {
            let error = await this.helper.getTranslate('MNEMONIC_LENGTH_ERROR');
            this.mnemonicError = error
        }

        if (this.mnemonicError) {
            return false;
        }

        if (!this.password) {
            let error = await this.helper.getTranslate('PASSWORD_EMPTY');
            this.passwordError = error;
            return false;
        }
        if (!this.password1) {
            let error = await this.helper.getTranslate('PASSWORD_EMPTY');
            this.passwordError1 = error;
            return false;
        }
        if (this.password1 != this.password) {
            let error = await this.helper.getTranslate('PASSEORD_DIFFERENT');
            this.passwordError1 = error;
            return false;
        }
        this.mnemonicError = "";
        return true;
    }
    async checkKeystore() {
        console.log("check keystore...");
        this.keystoreError = "";
        this.passwordError = "";

        if (!this.keystore) {
            let error = await this.helper.getTranslate('KEYSTORE_EMPTY');
            this.keystoreError = error
        }
        if (this.keystoreError) {
            return false;
        }
        return true;
    }

    async checkPassword() {
        if (!this.password) {
            let error = await this.helper.getTranslate('PASSWORD_EMPTY');
            this.passwordError = error
        } else {
            this.passwordError = "";
        }
    }

    async checkPassword1() {
        if (!this.password1) {
            let error = await this.helper.getTranslate('PASSWORD_EMPTY');

            this.passwordError1 = error;
            return
        }
        if (this.password && this.password1 != this.password) {
            let error = await this.helper.getTranslate('PASSEORD_DIFFERENT');

            this.passwordError1 = error
        }
        this.passwordError1 = "";
    }
    async importWallet() {
        this.mnemonicError = "";
        this.passwordError = "";
        this.passwordError1 = "";

        let wallet;

        new Promise((resolve, reject) => {
            if (this.type == 'mnemonic') {
                wallet = this.importMnemonic();
                resolve(wallet);
            } else if (this.type == 'keystore') {
                this.importKeystore().then(resolve)
            }
        }).then(async (wallet: any) => {
            console.log("Wallet import succeed...", wallet);
            if (!wallet) {
                return;
            }
            if (this.global.gWalletList.find(item => item.address == wallet.address)) {
                if (this.type == 'keystore') {
                    let error = await this.helper.getTranslate('KEYSTORE_REPLICATE');

                    this.keystoreError = error;
                } else {
                    let error = await this.helper.getTranslate('MNEMONIC_REPLICATE');
                    this.mnemonicError = error;
                }
                return;
            }
            this.helper.addWallet(wallet, this.password);
            // this.router.navigate(['tabs']);
            this.navCtrl.navigateRoot('wallet');
        })
    }

}
