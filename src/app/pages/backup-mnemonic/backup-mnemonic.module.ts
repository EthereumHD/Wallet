import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";

import { IonicModule } from '@ionic/angular';

import { BackupMnemonicPage } from './backup-mnemonic.page';

const routes: Routes = [
  {
    path: '',
    component: BackupMnemonicPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BackupMnemonicPage]
})
export class BackupMnemonicPageModule { }
