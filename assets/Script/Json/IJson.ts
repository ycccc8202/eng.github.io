export interface IJson {
    page: number;
    title: string;
    title_des: string;
    content: ISingleWord[];
}
export interface ISingleWord {
    title: string;
    voice: string;
    cn: string[];
    split: string[];
}

export interface IBoxLabel extends ISingleWord {
    bgColor: string;
    opacity: number;
    bold: boolean;
    fontSize: number;
    title_layout_active: boolean;
}