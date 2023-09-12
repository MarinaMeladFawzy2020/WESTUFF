import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { MaterialModule } from './material-module';
import { BranchManagerComponent } from './branch-manager/branch-manager.component';
import { BranchComponent } from './branch/branch.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { VotingModuleComponent } from './voting-module/voting-module.component';
import { UserRoleGuard } from './service/user-role.guard';
import { UserListComponent } from './user-list/user-list.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { HomeComponent } from './home/home.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SendNotificationComponent } from './notification/send-notification/send-notification.component';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';
import { NotificationComponent } from './notification/notification.component';
import { MedicalComponent } from './medical-page/medical/medical.component';
import { EditComponent } from './questions/edit/edit.component';
import { QuestionModalComponent } from './questions/question-modal/question-modal.component';
import { QuestionsComponent } from './questions/questions.component';
import { AddQuestionsComponent } from './questions/add-questionnaire/add-questionnaire.component';
import { QuestionsListComponent } from './questions/questionnaire-list/questionnaire-list.component';
import { QuestionslistComponent } from './questions/questionslist/questionslist.component';
import { QuestionsStatisticsComponent } from './questions/questions-statistics/questions-statistics.component'
import { QuestionnaireStatisticsComponent } from './questions/questionnaire-statistics/questionnaire-statistics.component';
import { VotingListComponent } from './voting-module/voting-list/voting-list.component';
import { VotingModalComponent } from './voting-module/voting-modal/voting-modal.component';
import { VotingStatisticsComponent } from './voting-module/voting-statistics/voting-statistics.component';
import { VotingsListStatisticsComponent } from './voting-module/votings-list-statistics/votings-list-statistics.component'
import { QuestionStatisticsFeedbackComponent } from './questions/question-statistics-feedback/question-statistics-feedback.component';
import { DatePipe } from '@angular/common';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { AllMedicalFilesComponent } from './medical-page/all-medical-files/all-medical-files.component';
import { NotificationTopicComponent } from './notification-topic/notification-topic.component';
import { AddTopicComponent } from './notification-topic/add-topic/add-topic.component';
import { ListTopicComponent } from './notification-topic/list-topic/list-topic.component';


import { ChartModule } from 'angular-highcharts';
import { SurveyComponent } from './survey/survey.component';
import { AddSurveyComponent } from './survey/add-survey/add-survey.component';
import { SurveyListComponent } from './survey/survey-list/survey-list.component';
import { SurveyStatisticsComponent } from './survey/survey-statistics/survey-statistics.component';
import { EditSurveyPageComponent } from './survey/edit-survey-page/edit-survey-page.component';
import { ViewSurveyStatisticsComponent } from './survey/view-survey-statistics/view-survey-statistics.component';
import { SurveyQuestionsModalComponent } from './survey/edit-survey-page/survey-questions-modal/survey-questions-modal.component';
import { MedicalPageComponent } from './medical-page/medical-page.component';
import { BannerComponent } from './banner/banner.component';
import { AddBannerComponent } from './banner/add-banner/add-banner.component';
import { ListBannerComponent } from './banner/list-banner/list-banner.component';
import { ModalBannerComponent } from './banner/modal-banner/modal-banner.component';
import { OfferCategoryComponent } from './offer-category/offer-category.component';
import { OffersComponent } from './offers/offers.component';
import { AddOfferCategoryComponent } from './offer-category/add-offer-category/add-offer-category.component';
import { ListOfferCategoryComponent } from './offer-category/list-offer-category/list-offer-category.component';
import { ListOfferComponent } from './offers/list-offer/list-offer.component';
import { AddOfferComponent } from './offers/add-offer/add-offer.component';
import { ModalOfferComponent } from './offers/modal-offer/modal-offer.component';
import { MedicalinfoComponent } from './medicalinfo/medicalinfo.component';
import { MedicalinfoListComponent } from './medicalinfo/medicalinfo-list/medicalinfo-list.component';
import { AddMedicalinfoComponent } from './medicalinfo/add-medicalinfo/add-medicalinfo.component';
import { ModalMedicainfoComponent } from './medicalinfo/modal-medicainfo/modal-medicainfo.component';
import { MedicalTopicCategoryComponent } from './medical-topic-category/medical-topic-category.component';
import { AddMedicalTopicCategoryComponent } from './medical-topic-category/add-medical-topic-category/add-medical-topic-category.component';
import { ListMedicalTopicCategoryComponent } from './medical-topic-category/list-medical-topic-category/list-medical-topic-category.component';
import { QuestionaireOverAllFeedbackComponent } from './questions/questionaire-over-all-feedback/questionaire-over-all-feedback.component';
import { CorrespondenceCategoryComponent } from './correspondence-category/correspondence-category.component';
import { AddCorrespondenceCategoryComponent } from './correspondence-category/add-correspondence-category/add-correspondence-category.component';
import { ListCorrespondenceCategoryComponent } from './correspondence-category/list-correspondence-category/list-correspondence-category.component';
import { CorrespondenceComponent } from './correspondence/correspondence.component';
import { AddCorrespondenceComponent } from './correspondence/add-correspondence/add-correspondence.component';
import { ListCorrespondenceComponent } from './correspondence/list-correspondence/list-correspondence.component';
import { ModalCorrespondenceComponent } from './correspondence/modal-correspondence/modal-correspondence.component';
import { NewsCategoryComponent } from './news-category/news-category.component';
import { AddNewsCategoryComponent } from './news-category/add-news-category/add-news-category.component';
import { ListNewsCategoryComponent } from './news-category/list-news-category/list-news-category.component';
import { InitiativesComponent } from './initiatives/initiatives.component';
import { AddInitiativesComponent } from './initiatives/add-initiatives/add-initiatives.component';
import { ListInitiativesComponent } from './initiatives/list-initiatives/list-initiatives.component';
import { ModalInitiativesComponent } from './initiatives/modal-initiatives/modal-initiatives.component';
import { JobsComponent } from './jobs/jobs.component';
import { AddJobsComponent } from './jobs/add-jobs/add-jobs.component';
import { ListJobsComponent } from './jobs/list-jobs/list-jobs.component';
import { ModalJobsComponent } from './jobs/modal-jobs/modal-jobs.component';
import { AddNewsComponent } from './news/add-news/add-news.component';
import { NewsListComponent } from './news/news-list/news-list.component';
import { NewsComponent } from './news/news.component';
import { EditNewsComponent } from './news/edit-news/edit-news.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { ComplaintListComponent } from './complaints/complaint-list/complaint-list.component';
import { ComplaintEditComponent } from './complaints/complaint-edit/complaint-edit.component';
import { CategoryListComponent } from './complaints-category/category-list/category-list.component';
import { CategoryAddComponent } from './complaints-category/category-add/category-add.component';
import { CategoryEditComponent } from './complaints-category/category-edit/category-edit.component';
import { ComplaintsCategoryComponent } from './complaints-category/complaints-category.component';
import { SubCategoryListComponent } from './complaints-category/sub-category-list/sub-category-list.component';
import { ComplaintSearchComponent } from './complaints/complaint-search/complaint-search.component';
import { ComplaintFeedbackComponent } from './complaints/complaint-feedback/complaint-feedback.component';




export function jwtTokenGetter() {
  if (localStorage.getItem("token") != null)
    return localStorage.getItem("token");
  else {
    return null;
  }
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    BranchManagerComponent,
    BranchComponent,
    VotingModuleComponent,
    UserListComponent,
    EditUserComponent,
    HomeComponent,
    UserManagementComponent,
    SendNotificationComponent,
    NotificationListComponent,
    NotificationComponent,
    MedicalComponent,
    EditComponent,
    QuestionModalComponent,
    QuestionsStatisticsComponent,
    MedicalComponent,
    QuestionsComponent,
    AddQuestionsComponent,
    QuestionsListComponent,
    QuestionslistComponent,
    QuestionnaireStatisticsComponent,
    VotingListComponent,
    VotingModalComponent,
    VotingStatisticsComponent,
    VotingsListStatisticsComponent,
    QuestionStatisticsFeedbackComponent,
    AllMedicalFilesComponent,
    NotificationTopicComponent,
    AddTopicComponent,
    ListTopicComponent,
    SurveyComponent,
    AddSurveyComponent,
    SurveyListComponent,
    SurveyStatisticsComponent,
    EditSurveyPageComponent,
    ViewSurveyStatisticsComponent,
    SurveyQuestionsModalComponent,
    MedicalPageComponent,
    BannerComponent,
    AddBannerComponent,
    ListBannerComponent,
    ModalBannerComponent,
    OfferCategoryComponent,
    OffersComponent,
    AddOfferCategoryComponent,
    ListOfferCategoryComponent,
    ListOfferComponent,
    AddOfferComponent,
    ModalOfferComponent,
    MedicalinfoComponent,
    MedicalinfoListComponent,
    AddMedicalinfoComponent,
    ModalMedicainfoComponent,
    MedicalTopicCategoryComponent,
    AddMedicalTopicCategoryComponent,
    ListMedicalTopicCategoryComponent,
    QuestionaireOverAllFeedbackComponent,
    CorrespondenceCategoryComponent,
    AddCorrespondenceCategoryComponent,
    ListCorrespondenceCategoryComponent,
    CorrespondenceComponent,
    AddCorrespondenceComponent,
    ListCorrespondenceComponent,
    ModalCorrespondenceComponent,
    NewsCategoryComponent,
    AddNewsCategoryComponent,
    ListNewsCategoryComponent,
    InitiativesComponent,
    AddInitiativesComponent,
    ListInitiativesComponent,
    ModalInitiativesComponent,
    JobsComponent,
    AddJobsComponent,
    ListJobsComponent,
    ModalJobsComponent,
    ListNewsCategoryComponent,
    NewsComponent,
    AddNewsComponent,
    NewsListComponent,
    EditNewsComponent,
    ComplaintsComponent,
    ComplaintListComponent,
    ComplaintEditComponent,
    CategoryListComponent,
    CategoryAddComponent,
    CategoryEditComponent,
    ComplaintsCategoryComponent,
    SubCategoryListComponent,
    ComplaintSearchComponent,
    ComplaintFeedbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SelectDropDownModule,
    MaterialModule,
    ChartModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          //console.log('tokenGetter')
          return localStorage.getItem("token");
        },
        // whitelistedDomains: ['192.168.129.128'],
        // blacklistedRoutes: ['http://192.168.129.128/ControlPanelRestServices/authenticateCpUser']
        whitelistedDomains: [environment.whiteDomain],
        blacklistedRoutes: [environment.blackRoutes]
      }
    }),
  ],

  providers: [UserRoleGuard, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
