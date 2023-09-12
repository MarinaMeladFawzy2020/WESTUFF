import { EditvotingAnswersRequest } from "./EditVotingAnswersRequest";

export interface EditVotingRequest{
    id:number
     title:string
     description: string
     expiryDate: any;
     publishDate:any
     active:boolean
     votingAnswer:EditvotingAnswersRequest[]
 }