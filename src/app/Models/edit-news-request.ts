export class EditNewsRequest {
    id:any;
    newsCategoryId:number;
    title:any;
    description:any;
    //mediaName:any
    publishDate:Date;
    newsDate:Date;
    uploadMedia:boolean;
    showInSlider:boolean;
    active:boolean;
    files?:FileList

}
