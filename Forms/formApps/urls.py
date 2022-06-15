
from django.urls import include, path
from . import views
from . views import page_view,audiovideo_view

urlpatterns  = [
	path('', page_view.as_view(), name='form' ),
	path('<str:Id>/', page_view.as_view(), name='form' ),
	path('record/audiovideo/', audiovideo_view.as_view(), name='audiovideo' ),
	path("webhook/video/insert_video/",views.InsertVideo),
	path("webhook/file/file_upload/",views.fileupload_View,),
]