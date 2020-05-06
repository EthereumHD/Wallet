import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

@Injectable({
    providedIn: 'root'
})

// let projectName = 'EHD'
export class GlobalService {
    public gWalletList = [];
    vibrationDuration = 100;
    paymentPassword = "";
    walletName = "";
    currentWalletIndex = -1;
    maxWalletNum = 100; // 最大值钱包显示数量
    selectedRate: any = {};

    // currentWallet = {};

    static errorCode = {};
    static showLog = false;
    static projectName = "EHD";

    projectName = GlobalService.projectName;

    settings: any = {
        valueUnit: 'USD',
        language: 'en'
    };

    api = {
        'getRateInfo': `/poc/get_exchange_rate`,
        "getTransList": "/transaction/get_by_addr_and_type",
    };

    errorKey = {
        10001: 'VERIFYCODEERROR',
    };

    constructor(
        private storage: Storage
    ) { }
}
