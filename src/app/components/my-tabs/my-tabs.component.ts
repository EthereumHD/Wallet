import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';

@Component({
    selector: 'app-my-tabs',
    templateUrl: './my-tabs.component.html',
    styleUrls: ['./my-tabs.component.scss'],
})
export class MyTabsComponent implements OnInit {
    @Input() tab: string = "";

    constructor(
        private router: Router,
        private navCtrl: NavController
    ) {
    }

    ngOnInit(
    ) { }

    toggleTab(url) {
        this.navCtrl.navigateRoot(url);
    }

}
