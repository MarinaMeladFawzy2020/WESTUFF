import { QuestionaireOverallFeedbacksModel } from "./ExportQusetionaireOverAllFeedbacksModel";
import { QuestionaireQuestionsModel } from "./ExportQusetionaireQuestionModel";

export interface QuestionaireFullDetailsModel{

    title: any
    description: any,
    expiryDate: any,
    publishDate: any,
    overallFeedback: boolean,
    id:any,
    addingDate: any,
    createdBy: any,
    overallFeedbacks:QuestionaireOverallFeedbacksModel[], 
      
    questions:QuestionaireQuestionsModel[],
    published: boolean,
    deleted: boolean,
    active: boolean

}