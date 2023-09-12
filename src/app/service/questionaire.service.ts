import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionaireService {
    constructor(private http: HttpClient) { }
    url: string = environment.host + environment.port + environment.text;



      getAllQuestionaire(pageNumber, limit, searchText) {
        return this.http.post(this.url + '/questionnaire/getAllQuestionnaireTopic', { pageNumber, limit, searchText })
      }

      getAllQuestionaireStatistics(pageNumber, limit, searchText) {
        return this.http.post(this.url + '/questionnaireStatistics/numberofparticipantsperquestionnaire', { pageNumber, limit, searchText})
      }
      addQuestionaire(questionaire) {
        //console.log('dfddddddddddd',this.url + '/questionnaire/saveQuestionnaireTopic')
        return this.http.post(this.url + '/questionnaire/saveQuestionnaireTopic', questionaire)
      }

      // from questionnaireId to id
      deleteQuestionnaire(id) {
        return this.http.post(this.url + '/questionnaire/deleteQuestionnaireTopic' , {id})
      }


      getFeedbacksByQuestionnaireTopicId(id,pageNumber, limit, searchText) {
        return this.http.post(this.url + '/questionnaire/getFeedbacksByQuestionnaireTopicId', {id, pageNumber, limit, searchText})
      }


      activateDeActivateQuestionaire(isActive,moduleTopicId) {
        return this.http.post(this.url + '/questionnaire/ChangeQuestionnaireTopicActivateStatus', { isActive,moduleTopicId })
      }
}
