

export interface votingAnswers{
    id:number
    title:string
    responseCount:number;
    mediaUrl?:any;
    uploadFiles:boolean
    mediaName?:string
    // three added for video
    fullDescription:string
    videoUrl?:any;
    uploadVideos:boolean
    videoName?:string
   
}