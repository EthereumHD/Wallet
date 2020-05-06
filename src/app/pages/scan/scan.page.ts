import { Component, OnInit } from '@angular/core';
import { Events, NavController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';


@Component({
    selector: 'app-scan',
    templateUrl: './scan.page.html',
    styleUrls: ['./scan.page.scss'],
})

export class ScanPage implements OnInit {
    light: boolean = false;
    isShow: boolean = false;
    showIcon = false;

    ifShowAlert = false;
    alertTitle: string;
    alertDesc: string;
    alertCancelText: string;
    alertConfirmText: string;
    confirmAlert: any;
    cancelAlert: any;

    constructor(
        private navCtrl: NavController,
        private events: Events,
        // private global: GlobalProvider,
        private openSetting: OpenNativeSettings,
        private qrScanner: QRScanner) {
    }

    ngOnInit() {
        this.qrScanner.prepare().then((status: QRScannerStatus) => {
            if (status.authorized) {
                let scanSub = this.qrScanner.scan().subscribe((text: string) => {
                    this.events.publish('qrscanner:result', text);
                    scanSub.unsubscribe();
                    this.ifShowAlert = false;
                    setTimeout(() => {
                        this.navCtrl.pop();
                    }, 100);
                });
                this.qrScanner.show();
            } else if (status.denied) {
                this.permisionPopUp();
                // this.nativeService.alert('', () => {
                // this.qrScanner.openSettings();
                // });
            } else {
                this.permisionPopUp();
                // this.nativeService.alert('', () => {
                // this.qrScanner.openSettings();
                // });
            }
        }).catch((e: any) => {
            console.log("catch.........");
            this.permisionPopUp();
        });
    }

    permisionPopUp() {
        this.createAlert("", "", "", "", () => {
            this.navCtrl.pop();
        }, () => {
            this.navCtrl.pop();
            this.qrScanner.openSettings();
            // this.openSetting.open('application_details');
        });
        // let promises = [
        //     this.global.getTranslate('PERMISIONCAMERA'),
        //     this.global.getTranslate("GETPERMISIONCAMERA"),
        //     this.global.getTranslate("DENY"),
        //     this.global.getTranslate("ALLOW")
        // ];
        // Promise.all(promises)
        //     .then((text: any) => {
        //         this.createAlert(text[0], text[1], text[2], text[3], () => {
        //             console.log("");
        //             this.navCtrl.pop();
        //         }, () => {
        //             console.log("")
        //             this.navCtrl.pop();
        //             this.qrScanner.openSettings();
        //             // this.openSetting.open('application_details');
        //         });
        //     })
    }

    createAlert(title, message, cancelText: any = '', confirmText: any = '', cancelAlert = null, confirmAlert = () => { }) {
        this.alertTitle = title;
        this.alertDesc = message;
        this.alertCancelText = cancelText;
        this.alertConfirmText = confirmText;
        this.confirmAlert = () => {
            confirmAlert();
            this.closeAlert();
        };
        this.cancelAlert = () => {
            this.closeAlert();
            cancelAlert();
        };
        this.ifShowAlert = true;
    }

    closeAlert() {
        this.ifShowAlert = false;
    }

    ionViewWillEnter() {
        (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView'); // tslint:disable-line
        this.isShow = true;
        this.showIcon = true;
    }

    ionViewWillLeave() {
        (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView'); // tslint:disable-line
        this.qrScanner.hide();
        this.qrScanner.destroy();
        this.showIcon = false;
        this.events.unsubscribe('qrscanner:result');
    }

    toggleLight() {
        this.light ? this.qrScanner.disableLight() : this.qrScanner.enableLight();
        this.light = !this.light;
    }

    close() {
        this.navCtrl.pop();
    }

}
