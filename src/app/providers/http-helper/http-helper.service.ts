import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { LoggerService } from '../logger/logger.service';
import { HelperService } from '../helper/helper.service';
import { GlobalService } from '../global/global.service';

export declare interface RequestSetting {
    /**
     * 是否使用默认api
     */
    useDefaultApi?: boolean;
    /**
     * 请求结果是否需要缓存
     */
    needCache?: boolean;
    /**
     * 是否显示loading
     */
    showLoading?: boolean;
	/**
	 * 是否忽略错误
	 */
    ignoreError?: boolean;
}

/**
 * http工具类
 */
@Injectable({
    providedIn: 'root'
})
export class HttpHelperService {
    static requestCount = 0; // 记录未完成的请求数量,当请求数为0关闭loading,当不为0显示loading

    constructor(public helper: HelperService) {
    }

    static getDefaultSetting(setting) {
        const defaultSetting: RequestSetting = {
            useDefaultApi: true,
            needCache: false,
            showLoading: false,
            ignoreError: false
        };
        return setting ? { ...defaultSetting, ...setting } : defaultSetting;
    }

    static getCacheData(options) {
        const cacheKey = HttpHelperService.getCacheKey(options);
        return StorageService.sessionStorage.get(cacheKey) || null;
    }

    static setCacheData(options, data: any) {
        const cacheKey = HttpHelperService.getCacheKey(options);
        StorageService.sessionStorage.set(cacheKey, data);
    }

    static getCacheKey(options) {
        const strParams = JSON.stringify(options.params);
        const strBody = JSON.stringify(options.body);
        return options.url + strParams + strBody;
    }

    requestBefore(options, setting: RequestSetting) {
        this.showLoading(setting);
        if (this.helper.isMobile && GlobalService.showLog) {
            console.log("Before request:" + JSON.stringify(options));
        } else {
            LoggerService.log('Before request:', '#3880ff', 'options:', options);
        }
    }

    requestSuccess(options) {
        this.hideLoading();
        if (this.helper.isMobile && GlobalService.showLog) {
            console.log("Request succeed for:" + options.url);
        } else {
            LoggerService.log('Request succeed:', '#10dc60', 'options:', options);
        }
    }

    requestError(options) {
        this.hideLoading();
        if (this.helper.isMobile && GlobalService.showLog) {
            console.log("Request error for:" + options.url);
        } else {
            LoggerService.log('Request failed:', '#f04141', 'options:', options);
        }
    }

    private showLoading(setting: RequestSetting) {
        ++HttpHelperService.requestCount;
        setting.showLoading && this.helper.showLoading();
    }

    private hideLoading() {
        --HttpHelperService.requestCount === 0 && this.helper.hideLoading();
    }

}
