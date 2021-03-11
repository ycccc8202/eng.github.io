import { IBoxLabel } from "../Json/IJson";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxLabel extends cc.Component {

    //#DC6363
    @property(cc.Label)
    label_cn: cc.Label = null;

    @property(cc.Label)
    label_split: cc.Label = null;

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    layout_title: cc.Node = null;

    @property(cc.Label)
    lab_title: cc.Label = null;
    @property(cc.Label)
    lab_voice: cc.Label = null;


    @property(cc.Node)
    img_line: cc.Node = null;

    config: IBoxLabel;

    // onLoad () {}

    start() {

    }

    setContent(config: IBoxLabel) {
        this.config = config;
        this.bg.color = cc.Color.BLACK.fromHEX(config.bgColor);
        this.bg.opacity = config.opacity;

        this.label_cn.string = "";
        this.label_split.string = "";
    
        if (config.cn) {
            this.label_cn.fontSize = config.fontSize;
            this.label_cn.lineHeight = config.fontSize;
            this.label_cn.string = config.cn.join("\n");
            this.label_cn.enableBold = config.bold;
        }
        if (config.split) {
            this.label_split.fontSize = config.fontSize;
            this.label_split.lineHeight = config.fontSize;
            this.label_split.string = config.split.join("\n");;
            this.label_split.enableBold = config.bold;
        }
        else {
            this.img_line.active = false;
            this.label_split.string = "";
        }

        // if (config.split == null) {
        //     this.img_line.active = false;
        //     this.label_split.string = "";
        // } else {
        //     this.label_split.fontSize = config.fontSize;
        //     this.label_split.lineHeight = config.fontSize;
        //     this.label_split.string = config.split.join("\n");;
        //     this.label_split.enableBold = config.bold;
        // }
        this.layout_title.active = config.title_layout_active;
        this.lab_title.string = config.title ? config.title : "";
        this.lab_voice.string = config.voice ? config.voice : "";
    }

    //控制英文显示隐藏
    activeENG(bool: boolean) {
        if (this.config.split == null) return;
        this.lab_title.enabled = this.lab_voice.enabled = bool;
        this.label_split.enabled = bool;
    }
    //控制英文显示隐藏
    activeCN(bool: boolean) {
        if (this.config.split == null) return;
        this.label_cn.enabled = bool;
    }
    // update (dt) {}
}
