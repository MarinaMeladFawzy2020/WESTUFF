import { QuestionnaireAnswersDto } from "./QuestionaireAnswerDto";

export interface StatisticsForEveryAnswer{
    questionnaireQuestionId:number
    numberOfQuestionFeedback: number

    questionnaireAnswerDtos: QuestionnaireAnswersDto[]
   
}