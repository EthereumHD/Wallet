import { Component } from '@angular/core';
import { GlobalService } from '../../providers/global/global.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    constructor(
        private global: GlobalService
    ) { }


}
