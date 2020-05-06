import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GlobalService } from '../../providers/global/global.service';
import { NativeService } from '../../providers/native/native.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Platform, NavController } from '@ionic/angular';
import { HttpService } from "../../providers/http/http.service";

@Component({
    selector: 'app-export-privatekey',
    templateUrl: './export-privatekey.page.html',
    styleUrls: ['./export-privatekey.page.scss'],
})
export class ExportPrivatekeyPage implements OnInit {
    privateKey = "";
    wallet: any = {};
    ifShowPasswordPrompt = false;

    constructor(
        private global: GlobalService,
        private native: NativeService,
        private helper: HelperService,
        private http: HttpService,
        private navCtrl: NavController,
    ) { }

    ngOnInit() {
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
        setTimeout(() => {
            this.ifShowPasswordPrompt = true;
        }, 500)
    }

    copyKeystore() {
        this.native.copy(this.privateKey);
        this.helper.toast("Copy Success!");
    }

    exportKeystoreToMiner() {
        this.ifShowPasswordPrompt = false;
        this.native.scan().then((res: any) => {
            console.log("Scan over...。。。" + JSON.stringify(res));
            // this.handleText(res.text);
            this.helper.handleText(res.text, (url) => {
                this.http.post(url, {
                    keystore: this.wallet.keystore
                }, {
                    ignoreError: true
                }).subscribe(res => {
                    console.log("keystore transmitted：" + res);
                })
            })
        })
    }

    cancelPrompt() {
        this.ifShowPasswordPrompt = false;
        this.navCtrl.pop();
    }

    confirmPrompt(privateKey) {
        this.ifShowPasswordPrompt = false;
        this.privateKey = privateKey;
    }

}
