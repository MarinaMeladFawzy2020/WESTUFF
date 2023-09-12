import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  constructor(private http: HttpClient) { }
  url: string = environment.host + environment.port + environment.text;



  addQuestion(question) {
    return this.http.post(this.url + '/questionnaire/addQuestionAnswer', question)
  }

  editQuestion(question) {
    return this.http.post(this.url + '/questionnaire/editQuestionAnswer', question)
  }
  getQuestionDetailsWithAnswer(questionReq) {
    return this.http.post(this.url + '/questionnaire/getQuestionAnswers', questionReq)

  }

  getQuestionStatisticsFeedBackById(id, pageNumber, limit, searchText) {
    return this.http.post(this.url + '/questionnaireStatistics/questionfeedbackbyid/', { id, pageNumber, limit, searchText })

  }


  getQuestionStatisticsForEveryAnswer(questionReq) {
    return this.http.get(this.url + '/questionnairestatistics/getstatisticsforeveryanswer', questionReq)

  }

  // from questionnaireId to id
  getQuestionnaireInfoById(id) {
    return this.http.post(this.url + '/questionnaire/getQuestionnaireTopicById', { id })

  }
  editQuestionnaireInfo(questionnaire) {
    return this.http.put(this.url + '/questionnaire/editQuestionnaireTopic', questionnaire)

  }


  // from questionnaireId to id
  getAllQuestionsTopicById(id, pageNumber, limit, searchText) {
    return this.http.post(this.url + '/questionnaire/getQuestionsByQuestionnaireTopicId', { id, pageNumber, limit, searchText })

  }

  getQuestionnaireFullDetails(id) {
    return this.http.post(this.url + '/questionnaire/getQuestionnaireFullDetails', { id })

  }


  deleteQuestions(questionId) {

    return this.http.post(this.url + '/questionnaire/deleteQuestionAnswers/', { questionId })

  }

  getQuestionAnswersStatistics(id) {

    return this.http.post(this.url + '/questionnairestatistics/getstatisticsforeveryanswer', { id })

  }

  sendNotification(messageTitle, messageBody, topicId, expiryDate, file) {
    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append("messageTitle", messageTitle);
    formData.append("messageBody", messageBody);
    formData.append("topicId", topicId);
    formData.append("expiryDate", expiryDate);
    formData.append("file", file, file.name);

    return this.http.post(this.url + '/Notification/SendPushNotification', formData)
  }

}
