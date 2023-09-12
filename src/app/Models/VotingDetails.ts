import { votingAnswers } from "./VotingAnswers";

export interface VotingDetails{
   id?:number
    title?:string
    description?: string
    expiryDate?: any;
    createdBy?:string
    publishDate?:any
    active?:boolean
    votingAnswer?:votingAnswers[]
    files?:Map<string, File>
    isExpanded?:boolean;
}