import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../providers/global/global.service';
import { HelperService } from '../../../providers/helper/helper.service';
import { Web3Service } from '../../../providers/web3/web3.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpService } from "../../../providers/http/http.service";
import { NativeService } from '../../../providers/native/native.service';
import { Platform, Events, NavController } from '@ionic/angular';
import { NgZone } from "@angular/core";
import { AlertController } from '@ionic/angular';


@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.page.html',
    styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
    ifShowAlert = false;
    ifShowWalletList = false;
    wallet: any = {};
    amount = 0;
    amountInOther: any = '';
    amountInOtherInterger: any = '';
    amountInOtherFraction: any = '';
    amountInOtherDisplay: any = '';
    alertTitle = "";
    alertDesc = "";
    version = "";

    ifShowPasswordPrompt = false;
    cancelPrompt = null;
    confirmPrompt = null;


    constructor(
        private router: Router,
        private helper: HelperService,
        public global: GlobalService,
        private web3: Web3Service,
        private http: HttpService,
        private storage: Storage,
        private native: NativeService,
        private platform: Platform,
        private events: Events,
        private zone: NgZone,
        private alertController: AlertController
    ) {
        console.log("Wallet constructor...");
    }

    ngOnInit() {
        console.log("Wallet ngoninit..");
        this.forceUpdate();
    }

    async forceUpdate() {
        let confirm = await this.helper.getTranslate('CONFIRM');
        let cancel = await this.helper.getTranslate('CANCEL');
        let discoverNewVersion = await this.helper.getTranslate('DISCOVER_NEW_VERSION');
        let confirmUpdate = await this.helper.getTranslate('CONFIRM_UPDATE');
        if (this.platform.is('cordova')) {
            this.native.getAppVersionInfo().subscribe(res => {
                this.version = res.versionNumber;
            })
        } else {
            this.version = '1.1.0';
        }

        let data = {
            version : this.version,
            client : 'wallet'
        };
        this.http.post('', {
            version : this.version,
            client : 'wallet'
        }, {
            ignoreError: true
        }).subscribe(async res => {
                if(res.err_no == 0){
                    const alert = await this.alertController.create({
                        header: discoverNewVersion,
                        message: confirmUpdate,
                        buttons: [
                            {
                                text: cancel,
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: (blah) => {
                                    navigator['app'].exitApp();
                                }
                            }, {
                                text: confirm,
                                handler: () => {
                                    this.native.openUrlBySystemBrowser(res.data.url);
                                    navigator['app'].exitApp();
                                }
                            }
                        ]
                    });
                    await alert.present();
                }
        })
        // this.http.get('',data).subscribe( async res => {
        //     if(res.err_no == 0){
        //         const alert = await this.alertController.create({
        //             header: discoverNewVersion,
        //             message: confirmUpdate,
        //             buttons: [
        //                 {
        //                     text: cancel,
        //                     role: 'cancel',
        //                     cssClass: 'secondary',
        //                     handler: (blah) => {
        //                         navigator['app'].exitApp();
        //                     }
        //                 }, {
        //                     text: confirm,
        //                     handler: () => {
        //                         this.native.openUrlBySystemBrowser(res.data.url);
        //                         navigator['app'].exitApp();
        //                     }
        //                 }
        //             ]
        //         });
        //         await alert.present();
        //     }
        // });
    }

    async ionViewDidEnter() {
        console.log("wallet ngoninit +++++++++...");
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex || 0] || {};
        console.log(this.wallet);
        this.computeValue();
    }

    async computeValue() {
        await this.getWalletInfo("0x"+this.wallet.addr);
        this.http.get(this.global.api['getRateInfo']).subscribe(res => {
            let unit = this.global.settings.valueUnit || "USD";

            let value = res.rates.find(item => item.currency == unit);
            if (!value) {
                value = res.rates[0];
            }
            this.global.selectedRate = value;
            this.amountInOther = this.amount * value.rate;
            this.amountInOtherInterger = Math.floor(this.amountInOther);
            let mod = Math.floor(Math.pow(10, value.significand));
            let amountInOtherFraction: any = Math.floor(this.amountInOther * mod) % mod;
            amountInOtherFraction = amountInOtherFraction + "";
            while (amountInOtherFraction.length < value.significand) {
                amountInOtherFraction = amountInOtherFraction + '0';
            }
            this.amountInOtherFraction = amountInOtherFraction;
            this.amountInOtherDisplay = this.amountInOtherInterger + '.' + this.amountInOtherFraction;
        })
    }

    cancelAlert() {
        this.ifShowAlert = false;
    }

    confirmAlert() {
        this.ifShowAlert = false;
        this.native.openSettings('application');
    }

    scan() {
        this.native.scan().then((res: any) => {
            console.log("scan succeed。。。" + JSON.stringify(res));

            // this.handleText(res.text);
            this.helper.handleText(res.text, (url, method) => {
                if (method == 'import') {
                    this.ifShowPasswordPrompt = true;
                    this.cancelPrompt = () => {
                        this.ifShowPasswordPrompt = false;
                    };
                    this.confirmPrompt = () => {
                        this.ifShowPasswordPrompt = false;
                        setTimeout(() => {
                            this.http.post(url, {
                                keystore: this.wallet.keystore
                            }, {
                                ignoreError: true
                            }).subscribe(res => {
                                console.log("keystore transfered：" + res);
                            })
                        }, 100);
                    };
                } else if (method == 'transfer') {
                    let navigationExtras: NavigationExtras = {
                        state: {
                            address: url,
                        }
                    };
                    this.router.navigate(['ehd-send'], navigationExtras);
                }
            })
        })
    }

    goEhdSend() {
        this.router.navigate(['ehd-send']);
    }

    goEhdReceive() {
        this.router.navigate(['ehd-receive']);
    }

    confirmCallback() {
        this.ifShowAlert = false;
    }

    addWallet() {
        this.ifShowWalletList = false;
        this.router.navigate(['wallet-create']);
    }

    showWalletList() {
        this.ifShowWalletList = true;
    }

    closeWalletDialog() {
        this.ifShowWalletList = false;
        if(this.global.gWalletList.length == 0){
            location.reload();
        } else {
            this.ionViewDidEnter();
        }
    }

    goWalletDetail() {
        this.router.navigate(['wallet-detail']);
    }

    async copyAddr() {
        let wallet = '0x' + this.wallet.addr.replace('0x', '');
        this.native.copy(wallet);
        let message = await this.helper.getTranslate('COPY_WALLET_SUCCEED');
        this.helper.toast(message);
    }

    async getWalletInfo(addr) {
        this.amount = await this.web3.getEhdBalance(addr);
    }

    toggleWallet(index, wallet) {
        this.ifShowWalletList = false;
        if (this.wallet.name != wallet.name) {
            this.global.currentWalletIndex = index;
            this.storage.set('localwalletindex', this.global.currentWalletIndex);
            this.wallet = wallet;
            this.computeValue();
        }
    }


    async deleteWallet(index) {
        let confirm = await this.helper.getTranslate('CONFIRM');
        let cancel = await this.helper.getTranslate('CANCEL');
        let deleteWallet = await this.helper.getTranslate('DELETE_WALLET');
        let deleteWalletTitle = await this.helper.getTranslate('DELETE_WALLET_TITLE');

        const alert = await this.alertController.create({
            header: deleteWalletTitle,
            message: deleteWallet,
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
                        this.global.gWalletList.splice(index,1);
                        this.storage.set('localwallet', JSON.stringify(this.global.gWalletList));
                    }
                }
            ]
        });
        await alert.present();
    }



}
