import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from "./components/components.module";
import { IonicStorageModule } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppVersion } from '@ionic-native/app-version/ngx';
import { Network } from '@ionic-native/network/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { AuthGuardService } from './providers/auto-guard/auth-guard.service';
import { FormsModule } from '@angular/forms';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }

        }),
        BrowserModule, FormsModule, HttpClientModule, ComponentsModule, IonicModule.forRoot({
            mode:"ios"
        }), AppRoutingModule, IonicStorageModule.forRoot()
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Vibration,
        Clipboard,
        AppVersion,
        InAppBrowser,
        AppMinimize,
        Network,
        AuthGuardService,
        QRScanner,
        OpenNativeSettings,
        Keyboard,
        BarcodeScanner,
        HTTP,
        TranslateService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
