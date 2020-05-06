import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../providers/global/global.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
    selector: 'app-wallet-admin',
    templateUrl: './wallet-admin.page.html',
    styleUrls: ['./wallet-admin.page.scss'],
})
export class WalletAdminPage implements OnInit {
    wallet: any = {};
    constructor(
        private global: GlobalService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
    }

    exportWalletKeystore() {
        this.router.navigate(['export-keystore']);
    }

    exportWalletMnemonic() {
        this.router.navigate(['export-mnemonic']);
    }

    changeWalletName() {
        this.router.navigate(['wallet-name']);
    }

    exportPrivateKey() {
        this.router.navigate(['export-privatekey']);
    }

}
