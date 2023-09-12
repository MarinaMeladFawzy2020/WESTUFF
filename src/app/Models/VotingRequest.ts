import { votingAnswersRequest } from "./VotingAnswerRequest";
import { votingAnswers } from "./VotingAnswers";

export interface VotingRequest{
    id:number
     title:string
     description: string
     expiryDate: any;
     publishDate:any
     active:boolean
     votingAnswer:votingAnswersRequest[]
 }