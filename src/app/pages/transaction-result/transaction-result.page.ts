import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Web3Service } from "../../providers/web3/web3.service";
import { NativeService } from "../../providers/native/native.service";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {HelperService} from "../../providers/helper/helper.service";
import {Clipboard} from "@ionic-native/clipboard/ngx";
import { environment } from '../../../environments/environment';


@Component({
    selector: 'app-transaction-result',
    templateUrl: './transaction-result.page.html',
    styleUrls: ['./transaction-result.page.scss'],
})
export class TransactionResultPage implements OnInit {
    status = 0;
    tx = "";
    detail: any = {};
    miningFee: any = '';
    time = '';
    commonUrl: any = environment.appServerUrl + '/#/';

    constructor(
        private router: Router,
        private helper: HelperService,
        private activatedRoute: ActivatedRoute,
        private web3: Web3Service,
        private native: NativeService
    ) {
        let state = this.router.getCurrentNavigation().extras.state;
        if (state) {
            this.status = state.status || 0;
            this.tx = state.tx || "";
            this.time = state.time || Date.now();

            if (this.tx) {
                this.getDetailByTx();
            }
        }
    }

    getValue(){
        let to = this.detail.to;
        let input = this.detail.input;
        if(to == "0x0000000000000000000000000000000000000081"){

            let str16 = input.substring(input.indexOf("0000000000000000000000000000000000000000000000"), input.length);

            let str10 = Number((parseInt(str16,16)/1000000000000000000).toFixed(4));

            return str10;
        }
    }


    async getDetailByTx() {
        this.detail = await this.web3.getTxDetail(this.tx);
        let newValue = await this.getValue();

        if (this.detail.value == 0) {
            this.detail.value = newValue;
        }

        this.miningFee = this.detail.gas * this.detail.gasPrice;


        // this.detail.from = this.detail.from.replace(/^0x/, 'ehd');
        // this.detail.to = this.detail.to.replace(/^0x/, 'ehd');
    }

    // async copyAddr() {
    //     // let wallet = '0x' + this.wallet.addr.replace('0x', '');
    //     let trade = '0x' + this.detail.hash.replace('0x', '');
    //     this.native.copy(trade);
    //     let message = await this.helper.getTranslate('COPY_WALLET_SUCCEED');
    //     this.helper.toast(message);
    // }

    goHashPage() {
        if (this.status != 1) {
            let url = this.commonUrl + this.tx;
            this.native.openUrlBySystemBrowser(url);
        }
    }

    goHash(hash) {
        if (this.status != 1) {
            let url = this.commonUrl + "txhash/" + this.tx;
            this.native.openUrlBySystemBrowser(url);
        }
    }

    goAddress(addr) {
        if (this.status != 1) {
            let url = this.commonUrl + "address/" + addr;
            this.native.openUrlBySystemBrowser(url);
        }
    }

    goHeight(height) {
        if (this.status != 1) {
            let url = this.commonUrl + "block/" + height;
            this.native.openUrlBySystemBrowser(url);
        }
    }

    ngOnInit() {

    }


}
