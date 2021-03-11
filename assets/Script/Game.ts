import ResBundles from "./Config/ResBundles";
import ProgressManager from "./Manager/ProgressManager";
import ResManager from "./Manager/ResManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    public static instance: Game = null;

    progress: cc.Node = null;

    onLoad() {

        if (Game.instance == null) {
            Game.instance = this;
        } else {
            this.destroy();
            return;
        }
        this.progress = this.node.getChildByName("ProgressBar");
        this.progress.addComponent(ProgressManager);
    }
    async startStudy() {
        cc.log("----------加载配置表------------");
        ProgressManager.instance.setProgress(0, "加载配置表")
        await ResManager.instance.loadJsons((loaded: number, total: number) => {
            cc.log(loaded, total);
            ProgressManager.instance.setProgress(loaded / total, "加载配置表")
        }).catch((e) => {
            cc.log(e);
        });
        ProgressManager.instance.setProgress(1, "加载配置表完成");
        await this.delay(500);
        cc.log("----------加载配置表 完成------------");
        cc.log("----------加载预制体------------");
        ProgressManager.instance.setProgress(0, "加载预制体");
        await ResManager.instance.asyncLoadBundle(ResBundles, (loaded, total) => {
            cc.log(loaded, total);
            ProgressManager.instance.setProgress(loaded / total, "加载预制体");
        });
        ProgressManager.instance.setProgress(1, "加载预制体完成");
        cc.log("----------加载预制体 完成------------");
        await this.delay(500);

        this.progress.destroy();

        this.enterStudyView();

    }

    delay(time: number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(0);
            }, time);
        })
    }
    //进入学习
    enterStudyView() {
        let studyView: cc.Node = cc.instantiate(ResManager.instance.getABAsset("Prefab", "StudyView"));
        studyView.parent = this.node;
    }
}
