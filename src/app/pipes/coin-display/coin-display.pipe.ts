import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'coinDisplay'
})
export class CoinDisplayPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
		if(value==0) return 0;
        value = +value;
        let interger = Math.floor(value);
        let fraction = Math.floor(value * 10000) % 10000;
        let f = ('0000' + fraction).slice(-4);
        console.log(value, interger, fraction, f)
        return interger + '.' + f;
    }

}
