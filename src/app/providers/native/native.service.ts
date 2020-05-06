import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { HelperService } from '../helper/helper.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
// import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
// import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Vibration } from "@ionic-native/vibration/ngx";
import { Platform } from '@ionic/angular';
import { GlobalService } from '../global/global.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

declare let ImagePicker;

/**
 * Cordova插件（手机硬件）调用工具类
 */
@Injectable({
    providedIn: 'root'
})
export class NativeService {
    private AppVersionInfo: object = null;

    constructor(private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private appVersion: AppVersion,
        // private socialSharing: SocialSharing,
        private minimize: AppMinimize,
        // private photoLibrary: PhotoLibrary,
        private iab: InAppBrowser,
        private network: Network,
        private vibration: Vibration,
        private qrScanner: QRScanner,
        private global: GlobalService,
        private clipboard: Clipboard,
        private barcodeScanner: BarcodeScanner,
        private openNativeSettings: OpenNativeSettings,
        public helper: HelperService) {
    }

    /**
     * 设置状态栏样式
     * https://ionicframework.com/docs/native/status-bar
     */
    setStatusBarStyle(): void {
        // if (this.helper.isMobile()) {
        //     // this.statusBar.overlaysWebView(false);
        //     // this.statusBar.styleLightContent();
        //     this.statusBar.styleDefault(); // 使用黑色字体
        //     this.statusBar.backgroundColorByHexString('#fff'); // 设置背景色
        // }
    }

    copy(str) {
        this.clipboard.copy(str);
    }

    /**
     * 隐藏启动页
     * https://ionicframework.com/docs/native/splash-screen
     */
    hideSplashScreen(): void {
        if (this.helper.isMobile()) {
            this.splashScreen.hide();
        }
    }

    openSettings(setting) {
        this.openNativeSettings.open(setting);
    }

    scan() {
		//return;
		//if(this.requestCameraPermission()){
			return this.barcodeScanner.scan({
				showTorchButton: true
			}).then(barcodeData => {
				console.log('Barcode data', barcodeData);
				return barcodeData;
			}).catch(err => {
				console.log('Error', err);
				return {
					text: ''
				}
			});
		//}
        

        // return new Promise((resolve, reject) => {
        //     // Optionally request the permission early
        //     this.qrScanner.prepare()
        //         .then((status: QRScannerStatus) => {
        //             console.log("权限状态：" + JSON.stringify(status));
        //             if (status.authorized) {
        //                 console.log("获取权限成功......");
        //                 // camera permission was granted
        //                 // start scanning
        //                 let scanSub = this.qrScanner.scan().subscribe((text: string) => {
        //                     console.log('Scanned something', text);

        //                     this.qrScanner.hide(); // hide camera preview
        //                     scanSub.unsubscribe(); // stop scanning

        //                     resolve(text);
        //                 });

        //             } else if (status.denied) {
        //                 reject(1);
        //                 // camera permission was permanently denied
        //                 // you must use QRScanner.openSettings() method to guide the user to the settings page
        //                 // then they can grant the permission from there
        //             } else {
        //                 reject(0);
        //                 // permission was denied, but not permanently. You can ask for permission again at a later time.
        //             }
        //         })
        //         .catch((e: any) => console.log('Error is', () => {
        //             reject(e);
        //         }));
        // })

    }

    /**
     * 最小化app
     */
    appMinimize() {
        this.minimize.minimize();
    }

    /**
     * 通过系统浏览器打开url
     */
    openUrlBySystemBrowser(url: string): void {
        this.iab.create(url, '_system');
    }

    /**
     * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
     */
    getNetworkType(): string {
        this.helper.assertIsMobile();
        return this.network.type;
    }

    /**
     * 判断是否有网络
     */
    isConnecting(): boolean {
        return this.getNetworkType() !== 'none';
    }


    /**
     * 获取app名称，包名，版本号
     * https://ionicframework.com/docs/native/app-version
     */
    getAppVersionInfo() {
        this.helper.assertIsMobile();
        if (this.AppVersionInfo) {
            return of(this.AppVersionInfo);
        }
        const appInfo = {
            appName: '', // app name,如现场作业
            packageName: '', // app包名/id,如com.kit.ionic2tabs
            versionNumber: '', // app版本号,如0.0.1
            name: '' // ionic2tabs
        };
        return Observable.create(observer => {
            Promise.all([
                this.appVersion.getAppName(),
                this.appVersion.getPackageName(),
                this.appVersion.getVersionNumber()
            ]).then(result => {
                appInfo.appName = result[0];
                appInfo.packageName = result[1];
                appInfo.versionNumber = result[2];
                appInfo.name = result[1].split('.').pop();
                this.AppVersionInfo = appInfo;
                observer.next(appInfo);
            }).catch(err => {
                LoggerService.error(err, 'NativeService.getAppVersionInfo');
                observer.error(false);
            });
        });
    }


    /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   */
    getVersionNumber(): Observable<string> {
        return Observable.create(observer => {
            if (this.helper.isMobile()) {
                this.appVersion.getVersionNumber().then((value: string) => {
                    observer.next(value);
                }).catch(err => {
                    console.log(err, '获得app版本号失败');
                    observer.error(false);
                });
            } else {
                observer.next('1.0.7');
            }
        });
    }

	/**
	 * 获得app name,如现场作业
	 * @description  对应/config.xml中name的值
	 */
    getAppName(): Observable<string> {
        return Observable.create(observer => {
            if (this.helper.isMobile()) {
                this.appVersion.getAppName().then((value: string) => {
                    observer.next(value);
                }).catch(err => {
                    console.log(err, '获得app name失败');
                    observer.error(false);
                });
            } else {
                observer.next('Mobbi');
            }
        });
    }

	/**
	 * 获得app包名/id,如com.kit.ionic2tabs
	 * @description  对应/config.xml中id的值
	 */
    getPackageName(): Observable<string> {
        return Observable.create(observer => {
            if (this.helper.isMobile()) {
                this.appVersion.getPackageName().then((value: string) => {
                    observer.next(value);
                }).catch(err => {
                    console.log(err, '获得app包名失败');
                    observer.error(false);
                });
            } else {
                observer.next('com.mobbi.italy');
            }
        });
    }

    vibrate() {
        console.log("密码错误");
        this.vibration.vibrate(this.global.vibrationDuration);
    }

    /**
     * 获取照片 - 风格同微信获取照片
     * https://github.com/giantss/cordova-plugin-ImagePicker
     */
    getPictures(options = {}) {
        this.helper.assertIsMobile();
        const ops = {
            maximumImagesCount: 9,
            width: 1920,
            height: 1440,
            quality: 100,
            ...options
        };
        return Observable.create(observer => {
            ImagePicker.getPictures(result => {
                observer.next(result.images);
            }, err => {
                err === '已取消' ? console.log(err) : LoggerService.error(err, 'NativeService.getPictures');
                observer.error(false);
            }, ops);
        });
    }

    /**
     * 保存图片到本地相册
     * @param url 图片url或base64
     */
    savePicture(url: string) {
        this.helper.assertIsMobile();
        // return Observable.create(observer => {
        // 	// 请求权限
        // 	this.photoLibrary.requestAuthorization({ read: true, write: true }).then(() => {
        // 		// 获取app包名作为相册名称
        // 		this.getAppVersionInfo().subscribe(appInfo => {
        // 			// 执行保存操作
        // 			this.photoLibrary.saveImage(url, appInfo.name).then(res => {
        // 				observer.next(res);
        // 			}).catch(err => {
        // 				Logger.error(err, 'NativeService.savePicture');
        // 				observer.error(false);
        // 			});
        // 		});
        // 	}).catch(err => {
        // 		Logger.error(err, 'NativeService.savePicture');
        // 		observer.error(false);
        // 	});
        // });
    }

    /**
     * 调用系统分享功能  https://ionicframework.com/docs/native/social-sharing/
     * 注意：同时只能分享一种类型
     * @param message 分享文本
     * @param file 分享文件，如图片
     */
    share(message: string = null, file: string | string[] = null) {
        this.helper.assertIsMobile();
        // this.socialSharing.share(message, null, file);
    }
	
	async requestCameraPermission() {
	    /* if (Platform.OS == 'ios') return true;
	    //申请相机权限
	    try {
	        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
	            title: '申请摄像头权限',
	            message: '一个很牛逼的应用想借用你的摄像头'
	        });
	        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
	            console.log('现在你获得摄像头权限了');
	            return true;
	        } else {
	            console.log('用户并不屌你');
	            return false;
	        }
	    } catch (err) {
	        console.warn(err);
	        return false;
	    } */
	}
}
