

const { ccclass, property } = cc._decorator;

@ccclass
export default class PageTool extends cc.Component {

    public static instance: PageTool = null;

    @property(cc.Label)
    label_page: cc.Label = null;

    currPage: number;
    totalPage: number;

    private handler: Function;

    onLoad() {

    }

    setPage(currPage: number, totalPage: number, handler: Function) {
        this.currPage = currPage;
        this.totalPage = totalPage;
        this.handler = handler;
        this.updatePage();
    }

    click_prePage() {
        this.currPage--;
        if (this.currPage < 1) {
            this.currPage = 1;
        } else {
            this.updatePage();
        }
    }
    click_nextPage() {
        this.currPage++;
        if (this.currPage > this.totalPage) {
            this.currPage = this.totalPage;
        } else {
            this.updatePage();
        }
    }
    updatePage() {
        this.label_page.string = `${this.currPage}/${this.totalPage}`;
        this.handler && this.handler(this.currPage);
    }
    // update (dt) {}
}
