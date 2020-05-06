import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Platform, NavController } from '@ionic/angular';

@Component({
    selector: 'app-backup-mnemonic',
    templateUrl: './backup-mnemonic.page.html',
    styleUrls: ['./backup-mnemonic.page.scss'],
})
export class BackupMnemonicPage implements OnInit {
    mnemonicList = [];
    backupList = [];
    wallet;

    constructor(
        private router: Router,
        private global: GlobalService,
        private storage: Storage,
        private helper: HelperService,
        private navCtrl: NavController,
        public activeRouter: ActivatedRoute,
    ) {
        if (this.router.getCurrentNavigation().extras.state) {
            this.wallet = this.router.getCurrentNavigation().extras.state.wallet;
            console.log(this.wallet.privateKey);

            console.log(this.wallet.mnemonic);
            let mnemonicList = this.wallet.mnemonic.split(" ");
            this.mnemonicList = this.shuffle(mnemonicList);
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
        }
    }

    shuffle(arr) {
        function randomsort(a, b) {
            return Math.random() > .5 ? -1 : 1;
        }
        arr.sort(randomsort);
        return arr;
    }

    ngOnInit() {
    }

    selectMnemonic(mnemonic) {
        let index = this.backupList.indexOf(mnemonic);
        if (index > -1) {
            this.backupList.splice(index, 1);
        } else {
            this.backupList.push(mnemonic);
        }
        console.log(this.backupList)
    }

    async verifyNmemonic() {
        let flag = true;
        let mnemonicList = this.wallet.mnemonic.split(' ');
        for (let i = 0; i < mnemonicList.length; i++) {
            if (mnemonicList[i] != this.backupList[i]) {
                flag = false;
                break;
            }
        }

        if (flag) {
            if (this.global.walletName) {
                this.wallet.name = this.global.walletName;
            }
            this.helper.addWallet(this.wallet, this.global.paymentPassword);
            this.global.walletName = "";
            this.navCtrl.navigateRoot('wallet');
        } else {
            let error = await this.helper.getTranslate('MNEMONIC_WRONG');
            this.helper.toast(error);
            this.backupList = [];
        }
    }

}
