import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../providers/global/global.service';
import { HttpService } from '../../providers/http/http.service';
import { Web3Service } from '../../providers/web3/web3.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HelperService } from '../../providers/helper/helper.service';

@Component({
    selector: 'app-wallet-detail',
    templateUrl: './wallet-detail.page.html',
    styleUrls: ['./wallet-detail.page.scss'],
})
export class WalletDetailPage implements OnInit {
    allTransactionList = [];
    pageno = 1;
    pageSize = 10;
    type = 0;
    wallet: any = {};
    amount: any = "";
    amountInOther: any = "";
    amountInOtherDisplay: any = "";
    blockHeight: any = "";
    more = false;
    loading = true;

    constructor(
        private global: GlobalService,
        private http: HttpService,
        private web3: Web3Service,
        private helper: HelperService,
        private router: Router
    ) { }

    ngOnInit() {

    }

    async ionViewDidEnter() {
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
        this.blockHeight = await this.web3.getBlockHeight();
        this.getTransactionList();

        this.amount = await this.web3.getEhdBalance(this.wallet.addr);
        this.http.get(this.global.api['getRateInfo']).subscribe(res => {
            let unit = this.global.settings.valueUnit || "USD";

            let value = res.rates.find(item => item.currency == unit);
            if (!value) {
                value = res.rates[0];
            }
            this.global.selectedRate = value;
            this.amountInOther = this.amount * value.rate;
            let amountInOtherInterger = Math.floor(this.amountInOther);
            let mod = Math.floor(Math.pow(10, value.significand));
            let amountInOtherFraction: any = Math.floor(this.amountInOther * mod) % mod;
            amountInOtherFraction = amountInOtherFraction + "";
            while (amountInOtherFraction.length < value.significand) {
                amountInOtherFraction = amountInOtherFraction + '0';
            }
            this.amountInOtherDisplay = amountInOtherInterger + '.' + amountInOtherFraction;
        })
    }

    goTransferPage() {
        this.router.navigate(['ehd-send']);
    }

    goReceivePage() {
        this.router.navigate(['ehd-receive']);
    }

    async getTransactionList() {
        let pledge = await this.helper.getTranslate('PLEDGE_CONTRACT_MINING'),
            drawback = await this.helper.getTranslate('DRAWBACK_CONTRACT_MINING');
        let finished = await this.helper.getTranslate('FINISHED');
        let pending = await this.helper.getTranslate('TRSACTION_PACKAGING');

        this.loading = true;
        let url = this.global.api['getTransList'];
        return this.http.post(url, {
            addr: '0x' + this.wallet.addr.replace('0x', ''),
            txType: this.type,
            pageIndex: this.pageno,
            pageSize: this.pageSize
        }).subscribe(res => {
            if (res.err_no == 0) {
                this.loading = false;
                if (res.transactions) {
                    res.transactions.forEach(item => {
                        if (item.tx_type == 1 || item.tx_type == 2) {
                            item.displayValue = this.web3.web3.utils.fromWei(item.value, 'ether');
                        } else {
                            item.displayValue = this.web3.web3.utils.fromWei(item.tx_type_ext, 'ether');
                        }
                        let height = this.blockHeight - item.block_number;
                        if (item.block_number == -2) {
                            item.blockHeight = pending;
                        } else if (height < 12) {
                            item.blockHeight = height + "/12";
                        } else {
                            item.blockHeight = finished;
                        }
                        if (item.tx_type == 3) {
                            item.to = pledge;
                        } else if (item.tx_type == 4) {
                            item.to = drawback;
                        }
                    });
                    if (this.pageno == 1) {
                        this.allTransactionList = res.transactions || [];
                    } else {
                        this.allTransactionList = this.allTransactionList.concat(res.transactions || []);
                    }
                    this.more = (this.allTransactionList.length < res.count);
                    console.log(this.allTransactionList.length, res.count);
                } else {
                    this.allTransactionList = [];
                }
            }
        })
    }

    goResultPage(transaction) {
        let status = (transaction.blockHeight == "packaging" || transaction.blockHeight == "打包中") ? 1 : 0;
        let time = transaction.timestamp == 0 ? (new Date()).getTime()/1000 :transaction.timestamp;
        let navigationExtras = {
            state: {
                tx: transaction.tx_hash,
                status: status,
                time: time
            }
        };
        this.router.navigate(['transaction-result'], navigationExtras);
    }

    toggleType(type) {
        if (this.type != type) {
            this.type = type;
            this.pageno = 1;
            this.getTransactionList();
        }
    }

    async getMore(infiniteScroll) {
        if (!this.more) {
            infiniteScroll.target.complete();
            return false;
        }
        this.pageno++;
        this.loading = true;
        await this.getTransactionList();
        this.loading = false;
        infiniteScroll.target.complete();

    }

}
