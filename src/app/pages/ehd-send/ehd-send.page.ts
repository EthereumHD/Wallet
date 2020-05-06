import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Web3Service } from '../../providers/web3/web3.service';
import { NativeService } from '../../providers/native/native.service';

@Component({
    selector: 'app-ehd-send',
    templateUrl: './ehd-send.page.html',
    styleUrls: ['./ehd-send.page.scss'],
})
export class EhdSendPage implements OnInit {
    range = 25;
    wallet: any = {};
    amount = 0;
    pledge: any = '';
    current = 0;
    receiveAddress = "";
    payAmount: any = "";
    min = 1;
    max = 100;
    amountError = "";
    addressError = "";
    ifShowPasswordPrompt = false;
    ifShowAlert = false;
    alertTitle = "";
    alertDesc = "";
    constructor(
        private router: Router,
        // private clipboard: Clipboard,
        private helper: HelperService,
        private global: GlobalService,
        private storage: Storage,
        private web3: Web3Service,
        private native: NativeService
    ) { }

    async ngOnInit() {
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
        console.log(this.global.gWalletList, this.global.currentWalletIndex);
        this.amount = await this.web3.getEhdBalance(this.wallet.addr);
        this.getCurrent();
        let state = this.router.getCurrentNavigation();
        if (state) {
            let obj = state.extras.state;
            this.receiveAddress = obj.address;
        }
    }

    scan() {
        this.native.scan().then(async (res: any) => {
            console.log("SCAN RESULT：", res);
            this.receiveAddress = res.text;
            // this.helper.handleText(res.text, async (url, method) => {
            //     alert('url' + JSON.stringify(url));
            //     alert('method' + JSON.stringify(method));
            //     if (method == 'transfer') {
            //         let result = await this.web3.isEhdAddr(url);
            //         if (result == 0) {
            //             this.receiveAddress = res.text;
            //         } else {
            //             let message = await this.helper.getTranslate('UNKNOWN_RESULT');
            //             this.helper.toast(message);
            //         }
            //     }
            //
            // })
        }, res => {
            // if (res == 1) {

            // } else if (res == 0) {
            //     this.ifShowAlert = true;
            //     this.alertTitle = "";
            //     this.alertDesc = "";
            // } else {
            //     this.helper.toast("");
            // }
        })
    }

    cancelPrompt() {
        this.ifShowPasswordPrompt = false;
    }
    confirmPrompt(privateKey) {
        console.log("Private key...", privateKey);
        this.ifShowPasswordPrompt = false;
        this.transfer(privateKey);
    }

    cancelAlert() {
        this.ifShowAlert = false;
    }

    confirmAlert() {
        this.ifShowAlert = false;
        this.native.openSettings('application');
    }

    async getCurrent() {
        this.amount = await this.web3.getEhdBalance(this.wallet.addr);
        this.pledge = await this.web3.getMortage(this.wallet.addr);
        this.current = this.amount - parseFloat(this.pledge);
    }

    async checkAmount() {
        this.amountError = "";
        let amount = +this.payAmount;
        if (amount <= 0) {
            let message = await this.helper.getTranslate('AMOUNT_ILLEGAL');
            this.amountError = message;
            return;
        }
        console.log(`${amount}, ${this.range}, ${this.current}`);
        if (amount + this.range * 21000 / 1000000000 > this.current) {
            let message = await this.helper.getTranslate('BALANCE_INFFICIENT');
            this.amountError = message;
            return;
        }
    }
    async checkAddr() {
        this.addressError = "";
        let result = await this.web3.isEhdAddr(this.receiveAddress.toLowerCase());
        if (result == -1) {
            let message = await this.helper.getTranslate('ADDRESS_EMPTY');
            this.addressError = message;
        } else if (result == -2) {
            let message = await this.helper.getTranslate('ADDRESS_ERROR');
            this.addressError = message;
        }
        let address = this.receiveAddress.toLowerCase();
        if (address == '0x0000000000000000000000000000000000000081') {
            let message = await this.helper.getTranslate('ADDRESS_ERROR');
            this.addressError = message;
        }

    }

    changeRange(e) {
    }

    async transferConfirm() {
        await this.checkAmount();
        if (this.amountError) {
            return;
        }

        await this.checkAddr();
        if (this.addressError) {
            return;
        }
        this.ifShowPasswordPrompt = true;
    }

    async transfer(privatekey) {
        let address = this.receiveAddress.toLowerCase().replace('ehd', '0x');
        let myAddress = `0x${this.wallet.addr}`;
        let value = this.payAmount.toString();
        this.web3.transferEhd(myAddress, address, value, this.range, privatekey, async (err, tx) => {
            if (err === null) {
                this.payAmount = "";
                this.receiveAddress = "";
                let navigationExtras = {
                    state: {
                        tx: tx,
                        status: 1,
                        time: (new Date()).getTime()/1000
                    }
                };
                this.router.navigate(['transaction-result'], navigationExtras);
            } else {
                let message = await this.helper.getTranslate('TRANSACTION_FAILED');
                if (err.message.toLowerCase().indexOf('insufficient funds for gas') > -1) {
                    message = await this.helper.getTranslate('BALANCE_INFFICIENT');
                } else if (err.message.toLowerCase().indexOf('replacement transaction underpriced') > -1) {
                    message = await this.helper.getTranslate('NONCE_ERROR');
                } else {
                    message = message + ': ' + err.message;
                }
                this.helper.toast(message)
            }
        })
    }

}
