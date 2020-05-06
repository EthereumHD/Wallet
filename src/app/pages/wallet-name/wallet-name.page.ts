import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';


@Component({
    selector: 'app-wallet-name',
    templateUrl: './wallet-name.page.html',
    styleUrls: ['./wallet-name.page.scss'],
})
export class WalletNamePage implements OnInit {
    wallet: any = {};
    walletName = "";
    walletNameError = "";
    constructor(
        private global: GlobalService,
        private helper: HelperService,
        private navCtrl: NavController,
    ) {

    }

    ngOnInit() {
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
        this.walletName = this.wallet.name;
    }

    async checkWalletName() {
        this.walletNameError = "";
        if (!this.walletName) {
            let error = await this.helper.getTranslate('WALLET_NAME_EMPTY');

            this.walletNameError = error;
        }
    }

    doSave() {
        this.wallet.name = this.walletName;
        this.helper.saveWallet();
        this.navCtrl.pop();
    }


}
