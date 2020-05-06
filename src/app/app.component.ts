import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { GlobalService } from './providers/global/global.service';
// import { Web3Service } from './providers/web3/web3.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private global: GlobalService,
        private navCtrl: NavController,
        // private web3: Web3Service,
        private storage: Storage,
        private keyboard: Keyboard,
        private translate: TranslateService,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.keyboard.onKeyboardWillShow().subscribe(() => {
                //keyboard显示
                document.body.classList.add('keyboard-is-open');
            });

            this.keyboard.onKeyboardWillHide().subscribe(() => {
                //keyboard显示
                document.body.classList.remove('keyboard-is-open');
            });

            //获取本地存储的钱包，如果没有则前往创建钱包页
            this.storage.get("localwallet").then(res => {
                if (res) {
                    try {
                        this.global.gWalletList = JSON.parse(res);
                        if (this.global.gWalletList.length == 0) {
                            this.navCtrl.navigateRoot('/wallet-create');
                        } else {
                            this.storage.get("localwalletindex").then(res => {
                                this.global.currentWalletIndex = +res || 0;
                                this.navCtrl.navigateRoot('wallet');
                                // this.global.currentWallet = this.global.gWalletList[this.global.currentWalletIndex];
                            })
                        }
                    } catch (e) {
                        this.global.gWalletList = [];
                        this.navCtrl.navigateRoot('/wallet-create');
                    }
                } else {
                    this.navCtrl.navigateRoot('/wallet-create');
                }
            });

            this.storage.get("localsetting").then(res => {
                if (res) {
                    try {
                        let setting = JSON.parse(res);
                        this.global.settings = setting;
                    } catch (e) {
                        console.log("获取配置出错...");
                    }
                }
                let lang = this.global.settings.language;
                if (lang !== 'cn' && lang !== 'en') {
                    lang = 'en';
                }
                this.translate.setDefaultLang(lang);
                this.translate.use(lang);
                console.log("Setting language as:" + lang);
            })


        });
    }
}
