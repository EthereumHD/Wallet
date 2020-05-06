import { NgModule } from '@angular/core';
import { AddEhdEllipsisPipe } from "./add-ehd-ellipsis/add-ehd-ellipsis.pipe";
import { CoinDisplayPipe } from './coin-display/coin-display.pipe';
import { TimeDisplayPipe } from './time-display/time-display.pipe';

@NgModule({
	declarations: [AddEhdEllipsisPipe, CoinDisplayPipe, TimeDisplayPipe],
	imports: [],
	exports: [AddEhdEllipsisPipe, CoinDisplayPipe, TimeDisplayPipe]
})
export class PipesModule { }
