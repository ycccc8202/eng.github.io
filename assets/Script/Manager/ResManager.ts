import { IJson } from "../Json/IJson";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ResManager extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    static instance: ResManager = null;


    json_map: { [key: string]: IJson } = {};


    /////////////////////////////////////////////////////////////


    //ab包数量统计
    totalAB: number = 0;
    loadedAB: number = 0;
    //ab包内资源数量统计
    total: number = 0;
    loaded: number = 0;


    assetBundles: { [key: string]: cc.AssetManager.Bundle } = {};

    progressCallback: Function = null;
    completeCallback: Function = null;

    allAssetsInBundleLoaded: boolean = false;

    onLoad() {
        if (ResManager.instance == null) {
            ResManager.instance = this;
        } else {
            this.destroy();
            return;
        }
    }
    loadJsons(json_progress: Function) {
        return new Promise((resolve, reject) => {
            if (~location.href.indexOf("7456")) {
                console.log("加载内置json配置");
                cc.assetManager.loadBundle("Jsons", (err, bundle: cc.AssetManager.Bundle) => {

                    bundle.load("lover_1", cc.JsonAsset, (err, json: cc.JsonAsset) => {
                        if (err) {
                            return reject("文件加载失败:" + err);
                        }
                        this.json_map[1] = json.json;
                        json_progress(this.getJsonCount(), 2);
                    })
                    bundle.load("lover_2", cc.JsonAsset, (err, json: cc.JsonAsset) => {
                        if (err) {
                            return reject("文件加载失败:" + err);
                        }
                        this.json_map[2] = json.json;
                        json_progress(this.getJsonCount(), 2);
                    })
                })
                let interval = setInterval(() => {
                    if (this.getJsonCount() == 2) {
                        cc.log("本地 json 加载完成");
                        clearInterval(interval);
                        resolve(null);
                    }
                }, 500);
            } else {
                console.log("加载远程json配置");
                // let json_url: string = Config.defalut_json_remote_url;
                // let lesson_url = Utils.get_urlparam("lesson_url");
                // if (lesson_url) json_url = lesson_url;
                // cc.assetManager.loadRemote(json_url + "?" + Math.random(), cc.JsonAsset, (err, asset: cc.JsonAsset) => {
                //     if (err) {
                //         return reject();
                //     }
                //     resolve(asset.json);
                // })
            }
        })
    }

    asyncLoadBundle(bundles: any, progressCallback?: Function) {
        return new Promise((resolve, reject) => {
            this.preloadBundles(bundles, progressCallback);
            let interval = setInterval(() => {
                if (this.allAssetsInBundleLoaded) {
                    clearInterval(interval);
                    resolve(0);
                }
            }, 500);
        })
    }
    preloadBundles(bundles: any, progressCallback?: Function, completeCallback?: Function) {
        this.progressCallback = progressCallback;
        this.completeCallback = completeCallback;
        for (let key in bundles) {
            this.totalAB++;
            this.total += bundles[key].urls.length;
        }
        cc.log("ab:", this.totalAB, this.total);

        for (let key in bundles) {
            this.loadBundle(key, () => {
                this.loadedAB++;
                if (this.loadedAB == this.totalAB) {
                    cc.log("bundles 加载完成");
                    this.loadAssetsInBundle(bundles);
                }
            });
        }
        //cc.assetManager.loadBundle()
    }
    //读取bundle
    loadBundle(abName: string, complete?: Function) {
        cc.log("loadbundle:", abName);
        cc.assetManager.loadBundle(abName, (err, bundle) => {
            if (err) {
                cc.log("加载失败bundle:", abName);
                this.assetBundles[abName] = null;
            } else {
                cc.log("加载成功bundle:", abName);
                this.assetBundles[abName] = bundle;
                cc.log("bundle:", bundle);
            }
            complete && complete();
        })
    }
    //读取bundle里的资源
    loadAssetsInBundle(bundles: any) {
        for (let key in bundles) {
            let urls: string[] = bundles[key].urls;
            let assetType: typeof cc.Asset = bundles[key].assetType;

            for (let i = 0; i < urls.length; i++) {
                this.loadRes(key, urls[i], assetType);
            }
        }
    }
    loadRes(abName: string, url: string, type: typeof cc.Asset) {
        let bundle: cc.AssetManager.Bundle = this.assetBundles[abName];
        bundle.load(url, type, (err, asset) => {
            this.loaded++;
            if (err) {
                cc.log("加载bundle内资源失败:", url);
            } else {
                cc.log("加载bundle内资源成功:", url, asset);
            }
            if (this.progressCallback) {
                this.progressCallback(this.loaded, this.total);
            }

            if (this.loaded >= this.total) {
                this.allAssetsInBundleLoaded = true;
                this.completeCallback && this.completeCallback();
            }
        });
    }

    getJsonCount() {
        return Object.keys(this.json_map).length;
    }


    //获取AB包内的资源
    getABAsset<T extends cc.Asset>(abName: string, resUrl: string): T {
        if (this.assetBundles[abName]) {
            return this.assetBundles[abName].get(resUrl);
        }
        return null;
    }
}
