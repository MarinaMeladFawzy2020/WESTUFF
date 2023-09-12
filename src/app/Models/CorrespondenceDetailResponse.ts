export class CorrespondenceDetailResponse{
    id?:number =0;
    title?: string = '';
    isActive?: boolean =false;
    correspondenceCategoryCustom?: CorrespondenceCategoryCustom;
    fileURL?:any;
    addedDate?:any= null;
    createdBy?:string = ''
    uploadedFile?:any
}

export class CorrespondenceCategoryCustom{
    id?: number = 0;
    englishName?: string ='';
    arabicName?: string ='';

}
