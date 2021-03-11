
import Game from "./Game";
import ResManager from "./Manager/ResManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLauncher extends cc.Component {
    onLoad() {
        this.node.addComponent(Game);
        this.node.addComponent(ResManager);
    }
    start() {
        Game.instance.startStudy();
    }
    // update (dt) {}
}
