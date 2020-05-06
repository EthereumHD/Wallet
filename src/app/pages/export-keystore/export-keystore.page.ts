import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GlobalService } from '../../providers/global/global.service';
import { NativeService } from '../../providers/native/native.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Platform, NavController } from '@ionic/angular';
import { HttpService } from "../../providers/http/http.service";

@Component({
    selector: 'app-export-keystore',
    templateUrl: './export-keystore.page.html',
    styleUrls: ['./export-keystore.page.scss'],
})
export class ExportKeystorePage implements OnInit {
    keystore = "";
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
        // this.keystore = this.wallet.keystore;

        setTimeout(() => {
            this.ifShowPasswordPrompt = true;
        }, 500)
    }

    async copyKeystore() {
        this.native.copy(this.keystore);
        let error = await this.helper.getTranslate('KEYSTORE_COPYIED_SUCCRRF');
        this.helper.toast(error);
    }
    cancelPrompt() {
        this.ifShowPasswordPrompt = false;

        this.navCtrl.pop();
    }
    confirmPrompt(privateKey) {
        this.ifShowPasswordPrompt = false;
        console.log(typeof this.wallet.keystore);
        if (typeof this.wallet.keystore == 'object') this.keystore = JSON.stringify(this.wallet.keystore);
        else this.keystore = this.wallet.keystore
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

}
