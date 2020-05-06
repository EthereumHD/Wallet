import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { TranslateService } from "@ngx-translate/core";


@Component({
    selector: 'app-language-toggle',
    templateUrl: './language-toggle.page.html',
    styleUrls: ['./language-toggle.page.scss'],
})
export class LanguageTogglePage implements OnInit {

    constructor(
        private router: Router,
        public global: GlobalService,
        private storage: Storage,
        private helper: HelperService,
        private navCtrl: NavController,
        private translate: TranslateService,
        public activeRouter: ActivatedRoute,
    ) { }

    ngOnInit() {
    }

    setLanguage(lang) {
        if (lang != this.global.settings.language) {
            this.global.settings.language = lang;
            this.storage.set('localsetting', JSON.stringify(this.global.settings));
        }
        this.translate.use(lang);
        this.navCtrl.pop();
    }

}
