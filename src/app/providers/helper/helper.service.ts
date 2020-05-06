import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Storage } from "@ionic/storage";
import { GlobalService } from "../global/global.service";

import { Observable } from 'rxjs';
import * as Wallet from 'ethereumjs-wallet';
import * as ethers from 'ethers';
import { TranslateService } from "@ngx-translate/core";

// import { Buffer } from 'safe-buffer';

declare var cordova;
declare var window;
/**
 * 帮助类：存放和业务有关的公共方法
 */
@Injectable({
    providedIn: 'root'
})
export class HelperService {
    readonly IsMobile: boolean = false;
    private AlertIsExist = false;
    private LoadingIsExist = false;
    private Loading = null;
    private win: any = window;

    readPermitted = false;

    constructor(public platform: Platform,
        public alertController: AlertController,
        public loadingController: LoadingController,
        private storage: Storage,
        private global: GlobalService,
        private translateService: TranslateService,
        public toastController: ToastController) {
        this.IsMobile = this.platform.is('cordova');

        console.log("Helper construction...");
    }

    addWallet(w, password) {
        if (!w.keystore) {
            w.keystore = JSON.stringify(this.exportKeystore(w.privateKey.replace('0x', ''), password));
        }
        let wallet = {
            name: w.walletName || this.global.projectName + '-wallet-' + w.address.slice(-4),
            addr: w.address,
            keystore: w.keystore
        };
        this.global.gWalletList.unshift(wallet);
        this.global.currentWalletIndex = 0;
        this.saveWallet();
    }

    async getTranslate(key) {
        let value: string = await new Promise((resolve, reject) => {
            this.translateService.get(key).subscribe((value) => {
                resolve(value)
            })
        });
        return value;
    }

    async handleText(res, callback) {
        // this.native.scan().then((res: any) => {
        console.log("扫描结果：" + res);
        if (!res) {
            return;
        }
        res = res.toLowerCase();
        //获取scheme, 对象，方法，参数
        let matches = res.match(/(.+)\:\/\/([^/]+)\/([^/]+)\/([^/]+)/);
        if (!res) {
            return;
        }
        let scheme = matches[1],
            object = matches[2],
            method = matches[3],
            params = matches[4];
        console.log(`scheme:${scheme}, object:${object}, method:${method},params:${params}`);
        if (scheme == 'poc') {
            if (object == 'account') {
                if (method == 'import') {
                    let url = decodeURIComponent(params);
                    callback && callback(url, method);
                } else if (method == 'transfer') {
                    let url = decodeURIComponent(params);
                    callback && callback(url, method);
                }
            }
        }
        // let addr = "";
        // let str = res.slice('transfer://'.length);
        // //转账
        // let index = str.indexOf('?');
        // if (index == -1) {
        //     addr = str.toLowerCase();
        // } else {
        //     addr = "ehd" + str.toLowerCase().slice(0, index);
        // }
        // let params: NavigationExtras = {
        //     state: {
        //         address: addr
        //     }
        // };
        // this.router.navigate(['ehd-send'], params);

    }

    saveWallet() {
        // this.currentWallet = w;
        this.storage.set('localwalletindex', this.global.currentWalletIndex);
        //缓存钱包列表，否则钱包将丢失
        this.storage.set('localwallet', JSON.stringify(this.global.gWalletList));
    }

    generateMnemonicWallet(privateKey) {
        let wallet = new ethers.Wallet(privateKey);
        return wallet;
    }

    exportKeystore(privateKey, password) {
        if (typeof privateKey == 'string') {
            privateKey = Buffer.from(privateKey, 'hex');
        }
        console.log(privateKey)
        let wallet = Wallet.fromPrivateKey(privateKey);
        //生成keystore
        let keystore = wallet.toV3(password, {
            n: 1024
        });
        return keystore;
    }

    /**
     * decryptPrivateKey: 根据keystore和密码，还原钱包
     * @param keystore
     * @param password
     */
    decryptPrivateKey(keystore, password) {
        let privateKey = null, publicKey = null;
        try {
            let wallet = Wallet.fromV3(keystore, password, true)
            privateKey = wallet.getPrivateKey().toString('hex');
            publicKey = wallet.getPublicKey().toString('hex');
            console.log(privateKey, publicKey)
            if (privateKey) {
                return {
                    flag: true,
                    address: wallet.getAddress().toString('hex'),
                    privateKey: privateKey,
                    publicKey: publicKey,
                    keystore: keystore
                };
            } else {
                return {
                    flag: false
                }
            }
        } catch (e) {
            console.log("catch......");
            return {
                flag: false
            }
        }
    }



    /**
     * 是否真机环境
     */
    isMobile(): boolean {
        return this.IsMobile;
    }

    /**
     * 是否真机环境
     */
    isNotMobile(): boolean {
        return !this.isMobile();
    }


    /**
     * 是否android真机环境
     */
    isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
    }

    /**
     * 是否ios真机环境
     */
    isIos(): boolean {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    }


    /**
     * 断言是否真机环境
     */
    assertIsMobile(): void {
        if (this.isNotMobile()) {
            this.toast('请使用真机调试');
            throw new Error('请使用真机调试');
        }
    }

    convertAddr(addr) {
        // return '0x' + addr.replace('0x', '');
        return '0x' + addr;
    }

    /**
     * tip 开发中
     */
    tipDev() {
        this.toast('开发中');
    }

    /**
     * alert弹框，默认只有确定按钮，当存在取消回调函数则会显示取消按钮
     * 注：如果存在打开的alert则不再打开
     * @param header 需要显示的title
     * @param message 需要显示的内容
     * @param okBackFun 成功回调
     * @param cancelBtnFun 失败回调
     */
    alert(header = '', message = '', okBackFun = null, cancelBtnFun = null): void {
        // alertController.create是异步方法，所以使用AlertIsExist标志是否打开
        if (this.AlertIsExist) {
            console.log('alert已经存在，禁止重复打开');
            setTimeout(() => { // alert关闭的可能性比较多，不止点击确定或取消按钮
                this.AlertIsExist = false;
            }, 10000);
            return;
        }
        this.AlertIsExist = true;
        const buttons = [{
            text: '确定', handler: () => {
                this.AlertIsExist = false;
                okBackFun && okBackFun();
            }
        }];
        if (cancelBtnFun) {
            const cancelBtn = {
                text: '取消',
                role: 'cancel',
                handler: () => {
                    this.AlertIsExist = false;
                    cancelBtnFun();
                }
            };
            buttons.unshift(cancelBtn);
        }
        this.alertController.create({
            header: header,
            message: message,
            backdropDismiss: false,
            buttons: buttons
        }).then(alert => alert.present());
    }

    hideAlert() {
        this.alertController.dismiss();
        this.AlertIsExist = false;
    }

    /**
     * 显示提示信息
     * 建议优先调用 NativeService.toast
     */
    toast(message: string = '操作成功', duration: number = 2500, position: 'top' | 'bottom' | 'middle' = 'middle'): void {
        const opts = {
            message, duration,
            color: 'dark',
            position,
            showCloseButton: true,
            cssClass: 'toast',
            closeButtonText: '✖'
        };
        this.toastController.create(opts).then(toast => toast.present());
    }

    /**
     * 统一调用此方法显示loading
     */
    showLoading(message: string = ''): void {
        if (this.LoadingIsExist) {
            return;
        }
        this.LoadingIsExist = true;
        this.loadingController.create({
            spinner: 'bubbles', // dots https://ionicframework.com/docs/api/spinner
            duration: 50000,
            message
        }).then(loading => {
            // loadingController.create异步方法，调用loading.present()前有可能已经调用hideLoading方法
            if (this.LoadingIsExist) {
                loading.present();
                this.Loading = loading;
            } else {
                loading.dismiss();
            }
        });
    }

    /**
     * 关闭loading
     */
    hideLoading(): void {
        this.LoadingIsExist = false;
        if (this.Loading) {
            this.Loading.dismiss();
            this.Loading = null;
        }
    }

}
