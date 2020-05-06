import { Injectable } from '@angular/core';
// import * as Web3 from 'web3';
import Web3 from 'web3';

import * as sha from 'sha.js';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { Buffer } from 'safe-buffer';
import * as EthereumTx from 'ethereumjs-tx';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { GlobalService } from '../global/global.service';
import { environment } from '../../../environments/environment';
import { BigNumber } from 'bignumber.js';
// import * as Secp from 'secp256k1';

declare var Buffer;
@Injectable({
    providedIn: 'root'
})
export class Web3Service {
    config = {
        provider: '',
        pledgeContractAddr: '0x0000000000000000000000000000000000000081',
        pledgeContractAbi: null
    };

    public web3;
    private pledgeContract;

    constructor(
        private http: HttpClient,
        private global: GlobalService
    ) {
        this.config.provider = environment.appServerUrl + '/rpc.php';
        this.web3 = new Web3(this.config.provider);

        this.http.get('assets/json/pledge.abi.json').subscribe((abi: any) => {
            this.pledgeContract = new this.web3.eth.Contract(abi, this.config.pledgeContractAddr);
            return this.pledgeContract;
        })

    }

    async isEhdAddr(addr) {
        if (!addr) {
            return -1;
        }
        addr = addr.toLowerCase();
        if (!addr.startsWith('0x')) {
            return -2;
        }
		let result = await this.web3.utils.isAddress(addr);
        return result ? 0 : -2;
    }

    async getBlockHeight() {
        let height = await this.web3.eth.getBlockNumber();
        return height;
    }

    initContract(name, abi, addr) {
        if (this[name]) {
            return this[name];
        } else {
            this[name] = new this.web3.eth.Contract(abi, addr);
            return this[name];
        }
    }

    async getEhdBalance(userAddr, pending = false) {
		let value;
		try{
			value = await this.web3.eth.getBalance(userAddr, pending ? 'pending' : 'latest');
		}catch(e){
			console.log(e)
		}
        value = this.web3.utils.fromWei(value, 'ether');
        return value;
    }

    getMortage(from) {
        return new Promise((resolve, reject) => {
            this.pledgeContract.methods.mortgageOf(from).call({ from: from }, (err, result) => {
                if (err) {
                    resolve(0);
                } else {
                    let value = this.web3.utils.fromWei(result + "", 'ether');
                    resolve(value);
                }
            });
        })
    }

    getTotalMortgage() {
        return new Promise((resolve, reject) => {
            this.pledgeContract.methods.totalMortgage().call({ }, (err, result) => {
                if (err) {
                    resolve(0);
                } else {
                    let value = this.web3.utils.fromWei(result + "", 'ether');
                    resolve(value);
                }
            });
        })
    }

    async pledge(type, from, amount, privateKey, callback) {
        amount = this.web3.utils.toWei(amount + "", 'ether');
        let gasPrice = await this.web3.eth.getGasPrice();
        if (!gasPrice || gasPrice == '0') {
            gasPrice = this.web3.utils.toWei(20, 'gwei');
        }
        let params = type == 'mortgage' ? [from, amount] : [amount];
        let tx = await this.generateEhdTx(from, this.config.pledgeContractAddr, '0x0', gasPrice, privateKey, 'pledgeContract', type, params);
        const serializedTx = tx.serialize();
        this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), callback);
    }

    async transferEhd(from, to, value, gasPrice, privateKey, callback) {
        value = this.web3.utils.toWei(value, 'ether');
        gasPrice = this.web3.utils.toWei(gasPrice + "", 'gwei');
        let tx = await this.generateEhdTx(from, to, value, gasPrice, privateKey);
        const serializedTx = tx.serialize();
        this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), callback);
        // this.web3.eth.sendSignedTransaction(tx.rawTransaction, callback);

        // this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
        //     if (!err)
        //     {
        //         console.log('Txn Sent and hash is '+hash);
        //     }
        //     else
        //     {
        //         console.error(err);
        //     }
        // })
    }
    // 获取 tx（交易hash）
    async generateEhdTx(
        from,
        to,
        value,
        gasPrice,
        privateKey,
        contractName = "",
        funcname = "",
        params = null
    ) {
        let data = "";
        if (params) {
            var thisobj = this[contractName].methods[funcname];
            data = thisobj.apply(thisobj, params).encodeABI();
        }

        var nonce = await this.web3.eth.getTransactionCount(from, 'pending');
        console.log("Nonce为" + nonce);
        let gasLimit = await this.web3.eth.estimateGas({
            "from": from,
            "nonce": nonce,
            "to": to,
            "data": data
        });

        let chainId = await this.web3.eth.net.getId();
        console.log("chainId:", chainId);
        const txParams = {
            from: from,
            nonce: nonce,
            gas: this.convert10to16(gasLimit),
            gasPrice: this.convert10to16(gasPrice),
            to: to,
            data: data,
            value: this.convert10to16(value),
            chainId: chainId
        };

        const tx = new EthereumTx(txParams);
        let privateKeyBuffer = Buffer.from(privateKey, 'hex');
        tx.sign(privateKeyBuffer);
        return tx;
    }

    async getTxDetail(tx) {
        let result = await this.web3.eth.getTransaction(tx);
        result.value = this.web3.utils.fromWei(result.value, 'ether');
        result.gasPrice = this.web3.utils.fromWei(result.gasPrice, 'ether');
        return result
    }

    computeSha256Hash(str) {
        const sha256 = sha('sha256');
        const msgHash = sha256.update(str, 'utf8').digest('hex');
        return msgHash;
    }

    strToBase64(str) {
        let strBase64 = new Buffer(str, "hex").toString('base64');
        return strBase64;
    }

    base64ToStr(base64) {
        let str = new Buffer(base64, "base64").toString("hex");
        return str;
    }

    strToBuffer(str, type) {
        if (type === 'hex') {
            return Buffer.from(str, 'hex');
        } else {
            return Buffer.from(str);
        }
    }

    floatMultiple(f1, f2) {
        let m1 = new this.web3.BigNumber(f1),
            m2 = new this.web3.BigNumber(f2);
        return m1.mul(m2);
    }

    bufferToStr(buf, type) {
        if (type) {
            return buf.toString(type);
        } else {
            return buf.toString();
        }
    }

    convert10to16(n) {
        if (typeof n != 'string') {
            n = n.toString();
        }
        if (n.startsWith('0x')) {
            return n;
        }
        return this.web3.utils.toHex(n);
    }

}




