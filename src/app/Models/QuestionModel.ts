import { Answers } from "./QuestionAnswers";

export interface Question{
    questionId:number
    title:string
    questionnaireId?: number
    hasFeedback?: boolean
    questionAnswers: Answers[]
    surveyId?:number
    shortDescription?:string
    isMultiSelect?:boolean
   
}