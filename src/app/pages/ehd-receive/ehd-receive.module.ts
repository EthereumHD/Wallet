import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EhdReceivePage } from './ehd-receive.page';
import { ComponentsModule } from '../../components/components.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: EhdReceivePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    NgxQRCodeModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EhdReceivePage]
})
export class EhdReceivePageModule { }
