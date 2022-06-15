from django.urls import include, path
from . import views
from . views import loginView,indexView,textView,textCampaignmodule,publicReview_View,campaignView,studentView,studentListView,test_View,profileView,teamView,interviewTempView,aifeedbackView,reviewView,page_view,registerView,forgotView,resentPassword,resendActivationView,update_reviews_view,studentReviewView,formView,workspaceView,smtpView,videoindexView,videopreviewView,videointerneterror,videostatuserror
urlpatterns  = [
	path('', loginView.as_view(), name='login' ),
	path('logout', views.logout , name='logout'),
	path('home', indexView.as_view(), name='home' ),
	path('smtp/<str:Id>/', smtpView.as_view(), name='smtp' ),
	path('profile', profileView.as_view(), name='profile' ),
	path('team', teamView.as_view(), name='team' ),
	path('preview/<str:Id>/', interviewTempView.as_view(), name='preview' ),
	path('aifeedback', aifeedbackView.as_view(), name='aifeedback' ),
	path('workspace', workspaceView.as_view(), name='workspace' ),
	path('students', studentView.as_view(), name='students' ),
	path('studentslists/<str:Id>', studentListView.as_view(), name='studentslists' ),
	path('form/<str:Id>/', formView.as_view(), name='form' ),
	path('review/<str:Id>/<str:formType>/<str:tblName>', studentReviewView.as_view(), name='studentreview'),
	path('response/<str:Id>/<str:formType>/<str:tblName>', publicReview_View.as_view(), name='response'),
	path("getformData/",views.intgetformData,name = 'getformData'),
	path("get_members/",views.get_TeamData,name = 'get_members'),
	path("getsettings/",views.getSettingsData,name = 'getsettings'),
	path("get_lists/",views.get_listsData,name = 'get_lists'),
	path("get_students/",views.get_studentsData,name = 'get_students'),
	path("get_campaignlists/",views.get_CampaignData,name = 'get_campaignlists'),
	path("pause_campaign/",views.pause_campaign_View,name = 'pause_campaign'),
	path("delete_campaign/",views.delete_campaign_View,name = 'delete_campaign'),
	path('assign_review/<str:Id>/<str:formType>/<str:tblName>', reviewView.as_view(), name='review1'),
	path('', indexView.as_view(), name='index' ),
	path("update_reviews/",views.update_reviews_view,name = 'update_reviews'),
	path("get_templfields/",views.get_Temp_fields_view,name = 'get_templfields'),
	path("get_formfields/",views.get_fields_view,name = 'get_formfields'),
	path("get_tempformfields/",views.get_tempformfields_view,name = 'get_tempformfields'),
	path("update_fields/",views.update_fields_view,name = 'update_fields'),
	path("single_field/",views.single_fields_view,name = 'single_field'),
	path("trigger_field/",views.trigger_fields_view,name = 'trigger_field'),
	path("PublishTempl/",views.publishTemplate_view,name = 'PublishTempl'),
	path("get_formCount/",views.get_formCount_view,name = 'get_formCount'),
	path("get_membercount/",views.get_membercount_view,name = 'get_membercount'),
	path("PublishTalentTempl/",views.publishTalentTemplate_view,name = 'PublishTalentTempl'),
	path("get_templates/",views.getTemp_View,name = 'get_templates'),
	path("get_forms/",views.getForms_View,name = 'get_forms'),
	path("get_Talenttemplates/",views.getTalentTemp_View,name = 'get_Talenttemplates'),
	path("update_settings/",views.update_settings_view,name = 'update_settings'),
	path("chksmtpsettings/",views.chksmtp_settingsview,name = 'chksmtpsettings'),
	path("publish_form/",views.publish_pageview,name = 'publish_form'),
	path("del_form/",views.del_form_view,name = 'del_form'),
	path("duplicate_form/",views.duplicate_formview,name = 'duplicate_form'),
	path("update_form/",views.update_form_view,name = 'update_form'),
	path("unpublish_form/",views.unpublish_pageview,name = 'unpublish_form'),
	path("check_list/",views.check_list_view,name = 'check_list'),
	path("add_list/",views.add_list_view,name = 'add_list'),
	path("update_list/",views.update_list_view,name = 'update_list'),
	path("delete_list/",views.delete_list_view,name = 'delete_list'),
	path("check_student/",views.check_student_view,name = 'check_student'),
	path("check_campaign/",views.check_campaign_view,name = 'check_campaign'),
	path("add_campaign/",views.add_campaign_view,name = 'add_campaign'),
	path("add_student/",views.add_student_view,name = 'add_student'),
	path("update_student/",views.update_student_view,name = 'update_student'),
	path("delete_student/",views.delete_student_view,name = 'delete_student'),
	path("block_student/",views.block_student_view,name = 'block_student'),
	path("import_students/",views.import_students_view,name = 'import_students'),
	path("form_creation/",views.form_creationview,name = 'form_creation'),
	path("webhooks/acme/mPnBRC1qxapOAxQpWmjy4NofbgxCmXSj/",views.webhook_endpoint,),
	path("webhooks/acme/t866k6t7re1nlm2119leabvm9vwoswcmtbx3/",views.webhook_submit,),
	path("image_upload/",views.Imgupload_view,name = 'image_upload'),
	path("pdflogo_image_upload/",views.PDFlogo_Imgupload_view,name = 'pdflogo_image_upload'),
	path("answertemp_upload/",views.AnsTemplupload_view,name = 'answertemp_upload'),
	path("upload_import_interview/",views.upload_importInterview_view,name = 'upload_import_interview'),
	path("import_answer/",views.import_answer_view,name = 'import_answer'),
	path("file/file_upload/",views.fileupload_View,),
	path("webhook/video/insert_video/",views.InsertVideo),

	path("folder_creation/",views.folder_creationview,name = 'folder_creation'),
	path("get_folders/",views.get_foldersview,name = 'get_folders'),
	path("get_campaignlist/",views.get_campaignlistview,name = 'get_campaignlist'),
	path("get_talentfolders/",views.get_talentfoldersview,name = 'get_talentfolders'),
	path("update_folders/",views.update_foldersview,name = 'update_folders'),
	path("delete_folders/",views.delete_foldersview,name = 'update_folders'),

	path('pform', page_view.as_view(), name='pform' ),
	path('activate/<str:uidb64>/<str:token>', views.activate, name='activate'),
	path('reset/<str:uidb64>/<str:token>', views.reset, name='reset'),
	path('registration/<str:uidb64>/<str:token>', views.activatergst, name='registration'),
	path('pform/<str:Id>/', page_view.as_view(), name='pform' ),
	path('register', registerView.as_view(), name='register' ),
	path('forgot', forgotView.as_view(), name='forgot' ),
	path('resend_activation', resendActivationView.as_view(), name='resend_activation' ),
	path('reset_password', resentPassword.as_view(), name='reset_password' ),
	path("chk_email/",views.checkemail,name = 'chk_email'),
	path("post_register/",views.pregister_view,name = 'post_register'),
	path("post_resend/",views.presend_view,name = 'post_resend'),
	path("post_forgot/",views.pforgot_view,name = 'post_forgot'),
	path("post_reset/",views.preset_View,name = 'post_reset'),
	path("post_login/",views.plogin_View,name = 'post_login'),
	path("member_create/",views.member_Create,name = 'member_create'),
	path("share_Form/",views.shareformView,name = 'share_Form'),
	path("delete_member/",views.deleteMemberView,name = 'delete_member'),
	path("add_form_lock/",views.add_form_lockView,name = 'add_form_lock'),
	path("get_sharedbyforms/",views.get_sharedbyforms_View,name = 'get_sharedbyforms'),
	path("get_sharedwithforms/",views.get_sharedwithforms_View,name = 'get_sharedwithforms'),
	path("webhooks/responses/get_responseCount/",views.get_responseCount_View),
	path("webhooks/responses/check_code/",views.check_code_view),

	path("send_report/",views.send_report_view,name = 'send_report'),
	path("export_Data/",views.export_Data_view,name = 'export_Data'),
	path('test', textView.as_view(), name='test' ),
	path('Campaign', campaignView.as_view(), name='Campaign' ),
	path('testcampaign', textCampaignmodule.as_view(), name='test' ),
	path('conTest', views.connectionTest,name='conTest' ),

	path("webhook/file/file_upload/",views.fileupload_View,),
	

	path('testing', test_View.as_view(), name='testing' ),
	path('video_record', videoindexView.as_view(), name='video_record' ),
	path('video_internet', videointerneterror.as_view(), name='video_internet' ),
	path('video_error', videostatuserror.as_view(), name='video_error' ),
	path('Interview_Response/<str:id>', videopreviewView.as_view(), name='Interview_Response' ),
	path("video_insert_video/",views.video_InsertVideo,name = 'video_insert_video'),
	path("video_record_insert_video/",views.video_Record_InsertVideo,name = 'video_record_insert_video'),
	path("checkvideo/",views.checkvideoview,name = 'checkvideo'),
	]