import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
    constructor(private http: HttpClient) { }
    url: string = environment.host + environment.port + environment.text;

    getAllNotifications(pageNumber, limit, searchText,topicId) {
      return this.http.post(this.url + '/Notification/GetAllNotifications', { pageNumber, limit, searchText , topicId })
    }

    getAllTopic(){
      return this.http.get(this.url + '/Notification/GetAllAvailableTopics')
    }

    sendNotification(messageTitle,messageBody,topicId,expiryDate,publishDate,file,sendNow) {
      // Create form data
      //console.log('in out',(file))

    const formData = new FormData();
    // Store form name as "file" with file data
    formData.append("messageTitle", messageTitle);
    formData.append("messageBody", messageBody);
    formData.append("topicId", topicId);
    formData.append("expiryDate", expiryDate);

    if(file) {
      formData.append("file", file, file.name);
    }
    // else{
    //   formData.append("file" ,file);
    // }
    formData.append("publishDate", publishDate);
    formData.append("sendNow", sendNow);

    return this.http.post(this.url + '/Notification/SendPushNotificationPerTopic',formData )

    }

    editNotification(notification) {
      return this.http.post(this.url + '/Notification/UpdateUnPublishNotification', notification)
    }

    deleteNotification(notificationId){
      return this.http.post(this.url + '/Notification/DeleteUnPublishedNotification/',{notificationId})
    }

    // service for Topics
    addTopic(topic) {
      return this.http.post(this.url + '/Notification/AddPrtalTopic', topic)
    }

    editTopic(topic) {
      return this.http.post(this.url + '/Notification/UpdatePortalTopic', topic)
    }

    getAllTopics(pageNumber, limit, searchText) {
      return this.http.post(this.url + '/Notification/GetAllTopics', { pageNumber, limit, searchText})
    }

    // Renotify Per Topic
    renotifyNotificationPerTopic(notification) {
      return this.http.post(this.url + '/Notification/RenotifyPublishNotification', notification)
    }

    // Recall Per Topic
    recallPerTopicNotification(notificationId){
      return this.http.post(this.url + '/Notification/RecallPerTopic/',{notificationId})
    }
}
