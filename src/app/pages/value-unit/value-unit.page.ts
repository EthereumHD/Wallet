import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { HttpService } from "../../providers/http/http.service";


@Component({
    selector: 'app-value-unit',
    templateUrl: './value-unit.page.html',
    styleUrls: ['./value-unit.page.scss'],
})
export class ValueUnitPage implements OnInit {
    rateList = [];
    constructor(
        private router: Router,
        public global: GlobalService,
        private storage: Storage,
        private helper: HelperService,
        private navCtrl: NavController,
        public activeRouter: ActivatedRoute,
        private http: HttpService
    ) { }

    ngOnInit() {
        this.http.get(this.global.api['getRateInfo']).subscribe(res => {
            this.rateList = res.rates;
        })
    }

    toggleValueUnit(unit) {
        if (unit != this.global.settings.valueUnit) {
            this.global.settings.valueUnit = unit;
            this.storage.set('localsetting', JSON.stringify(this.global.settings));
        }
        this.navCtrl.pop();
    }

}
