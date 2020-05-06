import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../../components/components.module';
import { WalletPage } from './wallet.page';

import { PipesModule } from '../../../pipes/pipes.module';
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
    {
        path: '',
        component: WalletPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ComponentsModule,
        IonicModule,
        PipesModule,
        TranslateModule,
        RouterModule.forChild(routes)
    ],
    declarations: [WalletPage]
})
export class WalletPageModule { }
