import BoxLabel from "../Component/BoxLabel";
import PageTool from "../Component/PageTool";
import { IJson } from "../Json/IJson";
import ResManager from "../Manager/ResManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class StudyView extends cc.Component {

    @property(cc.Node)
    mainLayout: cc.Node = null;

    @property(cc.Label)
    lab_title: cc.Label = null;
    @property(cc.Label)
    lab_title_des: cc.Label = null;

    @property(cc.Prefab)
    prefab_boxLabel: cc.Prefab = null;

    @property(cc.Label)
    label_eng: cc.Label = null;
    @property(cc.Label)
    label_cn: cc.Label = null;
    @property(cc.Node)
    page_tool_node: cc.Node = null;


    boxLabels: cc.Node[] = [];

    page_tool: PageTool = null;

    private setting: { cn_show: boolean, eng_show: boolean } =
        {
            cn_show: true, eng_show: true
        };

    templete = [
        { bgColor: "#0", opacity: 0, bold: false, fontSize: 30, cn: null, split: null, title_layout_active: true, title: null, voice: null },
        { bgColor: "#0", opacity: 0, bold: false, fontSize: 30, cn: null, split: null, title_layout_active: true, title: null, voice: null },
        { bgColor: "#0", opacity: 0, bold: false, fontSize: 30, cn: null, split: null, title_layout_active: true, title: null, voice: null },
        { bgColor: "#0", opacity: 0, bold: false, fontSize: 30, cn: null, split: null, title_layout_active: true, title: null, voice: null },
        { bgColor: "#635353", opacity: 255, bold: true, fontSize: 50, cn: null, split: null, title_layout_active: false,title: null, voice: null },
        { bgColor: "#0", opacity: 0, bold: false, fontSize: 30, cn: null, split: null, title_layout_active: true, title: null, voice: null },
        { bgColor: "#0", opacity: 0, bold: false, fontSize: 30, cn: null, split: null, title_layout_active: true, title: null, voice: null },
        { bgColor: "#0", opacity: 0, bold: false, fontSize: 30, cn: null, split: null, title_layout_active: true, title: null, voice: null },
        { bgColor: "#0", opacity: 0, bold: false, fontSize: 30, cn: null, split: null, title_layout_active: true, title: null, voice: null },
    ]
    onLoad() {
        for (let i = 0; i < this.templete.length; i++) {
            let boxLabel: cc.Node = cc.instantiate(this.prefab_boxLabel);
            boxLabel.parent = this.mainLayout;
            this.boxLabels.push(boxLabel);
        }
        this.page_tool = this.page_tool_node.getComponent(PageTool);
        this.page_tool.setPage(1, ResManager.instance.getJsonCount(), this.pageChange.bind(this));
    }

    pageChange(page: number) {

        let json: IJson = ResManager.instance.json_map[page];
        this.lab_title.string = json.title;
        this.lab_title_des.string = json.title_des;

        for (let i = 0; i < this.templete.length; i++) {
            let config = this.templete[i];
            let index = i < 4 ? i : ((i == 4) ? -1 : i - 1);
            let content = json.content[index];
            if (index > -1) {
                config.title = content.title;
                config.voice = content.voice;
                config.cn = content.cn;
                config.split = content.split;
            } else {
                config.cn = json.title.split(",");
            }
        }
        for (let i = 0; i < this.boxLabels.length; i++) {
            let boxLabel: cc.Node = this.boxLabels[i];
            boxLabel.getComponent(BoxLabel).setContent(this.templete[i]);
        }
    }
    //英语点击
    click_eng() {

        this.setting.eng_show = !this.setting.eng_show;
        this.label_eng.string = this.setting.eng_show ? "隐藏英文" : "显示英文";
        this.syncSetting();
    }
    //中文点击
    click_cn() {
        this.setting.cn_show = !this.setting.cn_show;
        this.label_cn.string = this.setting.cn_show ? "隐藏中文" : "显示中文";
        this.syncSetting();
    }

    //同步设定
    syncSetting() {

        for (let i: number = 0; i < this.boxLabels.length; i++) {
            let boxLabel: cc.Node = this.boxLabels[i];
            boxLabel.getComponent(BoxLabel).activeCN(this.setting.cn_show);
            boxLabel.getComponent(BoxLabel).activeENG(this.setting.eng_show);
        }

    }
}
