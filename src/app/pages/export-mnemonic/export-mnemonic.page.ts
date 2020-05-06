import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GlobalService } from '../../providers/global/global.service';
import { NativeService } from '../../providers/native/native.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Platform, NavController } from '@ionic/angular';

@Component({
    selector: 'app-export-mnemonic',
    templateUrl: './export-mnemonic.page.html',
    styleUrls: ['./export-mnemonic.page.scss'],
})
export class ExportMnemonicPage implements OnInit {
    action = "";
    enabled = false;
    wallet;
    ifEyeOpen = false;

    mnemonicList = [];

    ifShowPasswordPrompt = false;
    paymentPassword = "";
    promptDesc = "";
    promptError = "";
    ifShowLoading = false;

    askForPassword = false;

    constructor(
        private router: Router,
        public activeRouter: ActivatedRoute,
        private global: GlobalService,
        private native: NativeService,
        private helper: HelperService,
        private navCtrl: NavController,
    ) {
        if (this.router.getCurrentNavigation().extras.state) {
            this.wallet = this.router.getCurrentNavigation().extras.state.wallet;
            this.action = this.router.getCurrentNavigation().extras.state.action;
            console.log(this.wallet.privateKey);

            this.mnemonicList = this.wallet.mnemonic.split(" ");

            // console.log(Buffer)
            // try {
            //     var key = Buffer.from(this.wallet.privateKey.replace('0x', ''), 'hex');
            //     console.log(key)
            //     this.keystore = JSON.stringify(EthereumWallet.fromPrivateKey(key).toV3("123456", {
            //         n: 1024
            //     }));
            //     console.log(this.keystore)
            // } catch (e) {
            //     console.log(e.message)
            // }

            // this.wallet.encrypt("123456").then(res => {
            //     console.log("aaaaaa" + res)
            //     this.keystore = res;
            // }).catch(e => {
            //     console.log("sdfsdfds")
            // })
        } else {
            this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
            this.askForPassword = true;
        }
    }

    async ngOnInit() {
        let error = await this.helper.getTranslate('EXPORT_NEED_PASSEORD');
        this.promptDesc = error;
        setTimeout(() => {
            this.enabled = true;
        }, 3000);

        if (this.askForPassword) {
            setTimeout(() => {
                this.ifShowPasswordPrompt = true;
            }, 500);
        }
    }

    toggleEyeOpen() {
        this.ifEyeOpen = !this.ifEyeOpen;
    }

    goNext() {
        if (this.enabled) {
            let navigationExtras: NavigationExtras = {
                state: {
                    wallet: this.wallet,
                }
            };
            this.router.navigate(['backup-mnemonic'], navigationExtras);
        }
    }

    cancelPrompt() {
        this.ifShowPasswordPrompt = false;
        setTimeout(() => {
            this.navCtrl.pop();
        }, 50);
    }

    async confirmPrompt() {
        this.promptError = "";
        if (!this.paymentPassword) {
            let error = await this.helper.getTranslate('PASSWORD_EMPTY');
            this.promptError = error;
            return;
        }
        this.ifShowLoading = true;
        setTimeout(async () => {
            let ret = this.helper.decryptPrivateKey(this.wallet.keystore, this.paymentPassword);
            if (ret.flag) {
                this.ifShowPasswordPrompt = false;
                this.ifShowLoading = false;
                this.wallet = this.helper.generateMnemonicWallet(ret.privateKey);
                this.mnemonicList = this.wallet.mnemonic.split(" ");
                return;
            } else {
                this.ifShowLoading = false;
                let error = await this.helper.getTranslate('PASSEORD_ERROR');
                this.promptError = error;
            }
        }, 100);
    }

}
