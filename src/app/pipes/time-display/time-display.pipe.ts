import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeDisplay'
})
export class TimeDisplayPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        // 判断交易是否再进行中
        if (!value) {
            value = Date.now(); // 当前时间默认13位
        }else {
            value = value * 1000; // 因为传过来的是10位，需要13位
        }
        let time = new Date(value);
        let year = time.getFullYear();
        let date = ('00' + time.getDate()).slice(-2);
        let month = ('00' + (time.getMonth() + 1)).slice(-2);
        let hour = ('00' + time.getHours()).slice(-2);
        let minute = ('00' + time.getMinutes()).slice(-2);
        let second = ('00' + time.getSeconds()).slice(-2);

        return [year, month, date].join('.') + ' ' + [hour, minute, second].join(':');
    }

}
