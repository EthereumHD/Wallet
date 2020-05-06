import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../providers/helper/helper.service';
import { Platform, NavController } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GlobalService } from '../../providers/global/global.service';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../providers/native/native.service';
import { AlertController } from '@ionic/angular';
import {environment} from "../../../environments/environment";


@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    name = "";
    packageName = "";
    version = "1.0.0";
    newVersion = "1.0.0";
    DownloadLinks = "https://www.ehd.io/index.php/compeny/index/wallet.html?name=%E8%8A%82%E7%82%B9%E5%86%B7%E9%92%B1%E5%8C%85&ids=0";
    website = "https://www.ehd.io";
    constructor(
        private router: Router,
        private global: GlobalService,
        private storage: Storage,
        private helper: HelperService,
        private navCtrl: NavController,
        private platform: Platform,
        private native: NativeService,
        private alertController: AlertController,
        public activeRouter: ActivatedRoute,
    ) { }

    ngOnInit() {
        if (this.platform.is('cordova')) {
            this.native.getAppVersionInfo().subscribe(res => {
                console.log("Get version "+ JSON.stringify(res));
                this.version = res.versionNumber;
                this.name = res.name;
                this.packageName = res.packageName;
            })
        } else {
            this.version = '1.0.0';
            this.packageName = "io.ehd.www";
            this.name = "EHD";
        }

        this.getUpdate();

    }

    goWebsite(){
        this.native.openUrlBySystemBrowser(this.website);
    }

    async update() {
        // if (this.platform.is('android')) {
        //     window.open(`market://details?id=${this.packageName}`, '_system');
        // } else {
        //     window.open(`https://itunes.apple.com/cn/app/id1466591583?mt=8`);
        // }

        let confirm = await this.helper.getTranslate('CONFIRM');
        let tooltips = await this.helper.getTranslate('TOOLTIPS');
        let isLatestVersion = await this.helper.getTranslate('IS_LATEST_VERSION');
        if (this.version == this.newVersion) {
            const alert = await this.alertController.create({
                header: tooltips,
                message: isLatestVersion,
                buttons: [confirm]
            });
            await alert.present();
            return
        }
        if (this.platform.is('android')) {
            this.native.openUrlBySystemBrowser(this.DownloadLinks);
        } else {
            this.native.openUrlBySystemBrowser(this.DownloadLinks);
        }
    }

    async getUpdate() {
        let confirm = await this.helper.getTranslate('CONFIRM');
        let cancel = await this.helper.getTranslate('CANCEL');
        let confirmUpdate = await this.helper.getTranslate('CONFIRM_UPDATE');
        let discoverNewVersion = await this.helper.getTranslate('DISCOVER_NEW_VERSION');
        if (this.platform.is('cordova')) {
            this.newVersion = "1.1.0";
            if (this.version != this.newVersion) {
                const alert = await this.alertController.create({
                    header: confirmUpdate,
                    message: discoverNewVersion,
                    buttons: [
                        {
                            text: cancel,
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: (blah) => {
                                console.log('cancel');
                            }
                        }, {
                            text: confirm,
                            handler: () => {
                                this.native.openUrlBySystemBrowser(this.DownloadLinks);
                            }
                        }
                    ]
                });
                await alert.present();
            }
        }
    }
}
