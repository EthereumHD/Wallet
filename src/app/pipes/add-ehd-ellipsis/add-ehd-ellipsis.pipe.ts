import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'addEhdEllipsis'
})
export class AddEhdEllipsisPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        //console.log(value)
        if (!value) {
            return '';
        }
        value = value.replace('0x', '');
        return '0x' + value.slice(0, 8) + '...' + value.slice(-8);
    }
}
