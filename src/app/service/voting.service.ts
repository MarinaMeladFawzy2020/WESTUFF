import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { VotingDetails } from '../Models/VotingDetails';

@Injectable({
  providedIn: 'root'
})
export class VotingService {
    constructor(private http: HttpClient) { }
    url: string = environment.host + environment.port + environment.text;

    addVoting(votingReq,AllvotingData) {

//console.log('map ',AllvotingData.files)
        let formData = new FormData();

        if(AllvotingData.files){
        AllvotingData.files.forEach((value: File, key: string) => {
          //console.log ('key ',key)
          //console.log ('value  ',value)
          formData.append(key, value, value.name);
        }
          );
        }


      //console.log(JSON.stringify(votingReq))
        formData.append("votingTopicDtoRequestBody",JSON.stringify(votingReq) );


        return this.http.post(this.url + '/voting/addVotingAnswer',  formData)
      }

      addQuestion(question) {
        return this.http.post(this.url + '/questionnaire/addQuestionAnswer',  question)
      }

      upload(categoryID,file) {

        // Create form data
        let formData = new FormData();

        // Store form name as "file" with file data
        formData.append("file", file, file.name);
        formData.append("medNetworkId",categoryID );

        // Make http post request over api
        // with formData as req
        return this.http.post(this.url+'/api/excel/save-all', formData)
    }
      editVoting(votingReq,AllvotingData) {



        let formData = new FormData();


        if(AllvotingData.files){
          AllvotingData.files.forEach((value: File, key: string) => {
            //console.log ('key ',key)
            //console.log ('value  ',value)
            formData.append(key, value, value.name);
          }
            );
          }


      //console.log(JSON.stringify(votingReq))
        formData.append("votingTopicDtoRequestBody",JSON.stringify(votingReq) );



        return this.http.post(this.url + '/voting/editVotingAnswer',  formData)
      }
      getQuestionDetailsWithAnswer(questionReq){
        return this.http.post(this.url + '/questionnaire/getQuestionAnswers',questionReq)

      }

      getQuestionStatisticsForEveryAnswer(questionReq){
        return this.http.get(this.url + '/questionnairestatistics/getstatisticsforeveryanswer',questionReq)

      }

      getQuestionnaireInfoById(questionnaireId){
        return this.http.get(this.url + '/api/get-questionaire-topic-by-id/'+questionnaireId)

      }
      editQuestionnaireInfo(questionnaire){
        return this.http.put(this.url + '/api/edit-questionaire-topic',questionnaire)

      }

      getAllVoting(pageNumber, limit, searchText){
        return this.http.post(this.url + '/voting/getAllVotingTopics',{pageNumber, limit, searchText})

      }
      getAllVotingParticipation(pageNumber, limit, searchText){
        return this.http.post(this.url + '/voting/numberOfParticipantsPerVoting',{pageNumber, limit, searchText})

      }

      getVotingDetailsWithAnswers(votingTopicId){
        return this.http.post<VotingDetails>(this.url + '/voting/getOneVotingTopic',{votingTopicId})


      }
      getVotingStatisticsWithAnswers(votingTopicId){
        return this.http.post(this.url + '/voting/getOneVotingTopic',{votingTopicId})


      }
      deleteVoting(id){

        return this.http.post(this.url + '/voting/deleteVotingAnswer',{id})

      }

      getQuestionAnswersStatistics(id){

        return this.http.post(this.url + '/questionnairestatistics/getstatisticsforeveryanswer',{id})

      }

      sendNotification(messageTitle,messageBody,topicId,expiryDate,file) {
              // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append("messageTitle", messageTitle);
    formData.append("messageBody", messageBody);
    formData.append("topicId", topicId);
    formData.append("expiryDate", expiryDate);
    formData.append("file", file, file.name);

        return this.http.post(this.url + '/Notification/SendPushNotification',formData )
      }

      activateDeActivateVoting(isActive,moduleTopicId) {
        return this.http.post(this.url + '/voting/changeVotingTopicActivateStatus', { isActive,moduleTopicId })
      }

}
