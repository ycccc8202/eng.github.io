
export default class ProgressManager extends cc.Component {

    public static instance: ProgressManager = null;

    private progress: cc.ProgressBar = null;
    private label: cc.Label = null;

    onLoad() {

        if (ProgressManager.instance == null) {
            ProgressManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.progress = this.node.getComponent(cc.ProgressBar);
        this.label = this.node.getChildByName("label").getComponent(cc.Label);
    }
    setProgress(value:number,label:string = "") {
        this.progress.progress = value;
        this.label.string = label + (value * 100 ^ 0) + "%";
    }

    // update (dt) {}
}
