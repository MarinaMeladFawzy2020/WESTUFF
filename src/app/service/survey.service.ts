import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  constructor(private http: HttpClient) { }
  url: string = environment.host + environment.port + environment.text;



  addSurvey(survey) {
    return this.http.post(this.url + '/survey/saveSurveyTopic', survey)
  }

  getAllSurvey(pageNumber, limit, searchText) {
    return this.http.post(this.url + '/survey/getAllSurveyTopic', { pageNumber, limit, searchText })
  }

  deleteSurvey(surveyId) {
    return this.http.post(this.url + '/survey/deleteSurveyTopic', { surveyId })
  }


  getAllSurveyStatistics(pageNumber, limit, searchText) {
    return this.http.post(this.url + '/surveyStatistics/numberOfParticipantsPerSurvey', { pageNumber, limit, searchText })
  }
  addQuestion(question) {
    return this.http.post(this.url + '/survey/addQuestionAnswer', question)
  }

  editQuestion(question) {
    return this.http.post(this.url + '/survey/editQuestionAnswer', question)
  }
  getQuestionDetailsWithAnswer(questionReq) {
    return this.http.post(this.url + '/survey/getQuestionAnswers', questionReq)

  }

  getQuestionStatisticsFeedBackById(id, pageNumber, limit, searchText) {
    return this.http.post(this.url + '/questionnaireStatistics/questionfeedbackbyid/', { id, pageNumber, limit, searchText })

  }

  getQuestionStatisticsForEveryAnswer(questionReq) {
    return this.http.get(this.url + '/questionnairestatistics/getstatisticsforeveryanswer', questionReq)

  }

  getSurveyInfoById(surveyId) {
    return this.http.post(this.url + '/survey/getSurveyTopicById', { surveyId })

  }
  editSurveyInfo(survey) {
    return this.http.put(this.url + '/survey/editSurveyTopic', survey)

  }

  getAllQuestionsTopicById(surveyId, pageNumber, limit, searchText) {
    return this.http.post(this.url + '/survey/getQuestionsBySurveyTopicId', { surveyId, pageNumber, limit, searchText })

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

  activateDeActivateSurvey(isActive,moduleTopicId) {
    return this.http.put(this.url + '/survey/changeSurveyTopicActivateStatus', { isActive,moduleTopicId })
  }

}
