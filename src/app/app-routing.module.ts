import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BranchManagerComponent } from './branch-manager/branch-manager.component';
import { BranchComponent } from './branch/branch.component';
import { VotingModuleComponent } from './voting-module/voting-module.component';
import { UserRoleGuard } from './service/user-role.guard';
import { config } from 'src/config';
import { UserListComponent } from './user-list/user-list.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { HomeComponent } from './home/home.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';
import { NotificationComponent } from './notification/notification.component';
import { MedicalComponent } from './medical-page/medical/medical.component';
import { QuestionsComponent } from './questions/questions.component';
import { EditComponent } from './questions/edit/edit.component';
import { QuestionslistComponent } from './questions/questionslist/questionslist.component';
import { QuestionsStatisticsComponent } from './questions/questions-statistics/questions-statistics.component';
import { QuestionStatisticsFeedbackComponent } from './questions/question-statistics-feedback/question-statistics-feedback.component';
import { VotingListComponent } from './voting-module/voting-list/voting-list.component';
import { VotingsListStatisticsComponent } from './voting-module/votings-list-statistics/votings-list-statistics.component';
import { NotificationTopicComponent } from './notification-topic/notification-topic.component';
import { SurveyComponent } from './survey/survey.component';
import { EditSurveyPageComponent } from './survey/edit-survey-page/edit-survey-page.component';
import { ViewSurveyStatisticsComponent } from './survey/view-survey-statistics/view-survey-statistics.component';
import { MedicalPageComponent } from './medical-page/medical-page.component';
import { BannerComponent } from './banner/banner.component';
import { OfferCategoryComponent } from './offer-category/offer-category.component';
import { OffersComponent } from './offers/offers.component';
import { MedicalinfoComponent } from './medicalinfo/medicalinfo.component';
import { MedicalTopicCategoryComponent } from './medical-topic-category/medical-topic-category.component';
import { CorrespondenceCategoryComponent } from './correspondence-category/correspondence-category.component';
import { CorrespondenceComponent } from './correspondence/correspondence.component';
import { NewsCategoryComponent } from './news-category/news-category.component';
import { NewsComponent } from './news/news.component';
import { InitiativesComponent } from './initiatives/initiatives.component';
import { JobsComponent } from './jobs/jobs.component';
import { ComplaintsCategoryComponent } from './complaints-category/complaints-category.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { ComplaintEditComponent } from './complaints/complaint-edit/complaint-edit.component';
import { CategoryEditComponent } from './complaints-category/category-edit/category-edit.component';


const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'branch-manager',component:BranchManagerComponent},
  {path:'home',component:HomeComponent},
  {path:'branch-manager/edit-branches',component:BranchComponent},
  {path:'management',component:UserManagementComponent,canActivate: [UserRoleGuard],data: { title: 'User Management',roles: config.authRoles.UserManagement}},
  {path:'edituser',component:EditUserComponent},
  {path:'notification',component:NotificationComponent,canActivate: [UserRoleGuard],data: { title: 'Notification',roles: config.authRoles.Notification}},
  {path:'medical',component:MedicalPageComponent,canActivate: [UserRoleGuard],data: { title: 'Medical',roles: config.authRoles.Medical}},
  {path:'edit',component:EditComponent},
  {path:'questionaire',component:QuestionsComponent,canActivate: [UserRoleGuard],data: { title: 'Questions',roles: config.authRoles.Questionaire}},
   {path:'questionslist',component:QuestionslistComponent},
   {path:'questions-statistics',component:QuestionsStatisticsComponent},
   {path:'questionstatisticsfeedback',component:QuestionStatisticsFeedbackComponent},
  {path:'voting', canActivate: [UserRoleGuard],
  component:VotingModuleComponent ,data: { title: 'Admin',roles: config.authRoles.Voting}},
  {path:'votingStatisticsById',component:VotingsListStatisticsComponent},
  {path:'topics',component:NotificationTopicComponent,canActivate: [UserRoleGuard],data: { title: 'NotificationTopic',roles: config.authRoles.NotificationTopic}},
  {path:'editsurvey',component:EditSurveyPageComponent},
  {path:'survey',component:SurveyComponent,canActivate: [UserRoleGuard],data: { title: 'Survey',roles: config.authRoles.Survey}},
  {path:'viewsurvey',component:ViewSurveyStatisticsComponent},
  {path:'banner',component:BannerComponent,canActivate: [UserRoleGuard],data: { title: 'Banner',roles: config.authRoles.Banner}},
  {path:'offerCategory',component:OfferCategoryComponent,canActivate: [UserRoleGuard],data: { title: 'Benefit',roles: config.authRoles.Benefit}},
  {path:'offers',component:OffersComponent,canActivate: [UserRoleGuard],data: { title: 'Benefit',roles: config.authRoles.Benefit}},
  {path:'medicalinfo',component:MedicalinfoComponent,canActivate: [UserRoleGuard],data: { title: 'Medical',roles: config.authRoles.Medical}},
  {path:'medicalTopicCategory',component:MedicalTopicCategoryComponent,canActivate: [UserRoleGuard],data: { title: 'Medical',roles: config.authRoles.Medical}},
  {path:'correspondenceCategory',component:CorrespondenceCategoryComponent,canActivate: [UserRoleGuard],data: { title: 'Correspondence',roles: config.authRoles.Correspondence}},
  {path:'correspondence',component:CorrespondenceComponent,canActivate: [UserRoleGuard],data: { title: 'Correspondence',roles: config.authRoles.Correspondence}},
  {path:'intitiatives',component:InitiativesComponent,canActivate: [UserRoleGuard],data: { title: 'Initiatives',roles: config.authRoles.Initiatives}},
  {path:'jobs',component:JobsComponent,canActivate: [UserRoleGuard],data: { title: 'Jobs',roles: config.authRoles.Jobs}},

  {path:'news',component:NewsComponent,canActivate: [UserRoleGuard],data: { title: 'News',roles: config.authRoles.News}},
  {path:'newsCategory',component:NewsCategoryComponent,canActivate: [UserRoleGuard],data: { title: 'News',roles: config.authRoles.News}},

  {path:'complaintCategory',component:ComplaintsCategoryComponent,data: { title: 'complaintCategory',roles: config.authRoles.ComplaintCategory}},
  {path:'complaintCategoryById',component:CategoryEditComponent},

  {path:'complaints',component:ComplaintsComponent,data: { title: 'complaints',roles: config.authRoles.Complaints}},
  {path:'complaintById',component:ComplaintEditComponent},


  {path:'**',redirectTo:'/'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
