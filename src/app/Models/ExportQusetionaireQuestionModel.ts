import { QuestionaireAnswersModel } from "./ExportQusetionaireAnswersModel";

export interface QuestionaireQuestionsModel{


          id: any,
          title: any,
          isMultiSelect: boolean,
          shortDescription: any,
          hasFeedback: boolean,
          answers : QuestionaireAnswersModel[]
          numberOfFeedback: any
       
}