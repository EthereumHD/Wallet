import { NgModule } from '@angular/core';
import { AlertComponent } from "./alert/alert.component";
import { InputTextComponent } from "./input-text/input-text.component";
import { InputPasswordComponent } from "./input-password/input-password.component";
import { GeneratePrivatekeyComponent } from "./generate-privatekey/generate-privatekey.component";
import { MyTabsComponent } from "./my-tabs/my-tabs.component";
// import { DirectivesModule } from '../directives/directives.module';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [
		AlertComponent,
		InputTextComponent,
		InputPasswordComponent,
		GeneratePrivatekeyComponent,
		MyTabsComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		// DirectivesModule
	],
	exports: [
		AlertComponent,
		InputTextComponent,
		InputPasswordComponent,
		GeneratePrivatekeyComponent,
		MyTabsComponent,
	]
})
export class ComponentsModule { }
