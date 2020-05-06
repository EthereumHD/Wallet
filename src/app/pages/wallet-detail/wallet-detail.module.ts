import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WalletDetailPage } from './wallet-detail.page';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: WalletDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WalletDetailPage]
})
export class WalletDetailPageModule { }
