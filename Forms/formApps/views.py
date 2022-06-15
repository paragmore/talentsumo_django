from contextlib import nullcontext
from django.shortcuts import render
from django.views import  View
from django.http.response import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from google.cloud import storage
from django.views.decorators.http import require_http_methods
from django.db import connection
from django.http.response import HttpResponse, JsonResponse


class page_view(View):
    return_url = None
    def get(self , request,Id=''):
        if(len(Id) != 0):
            cursor = connection.cursor()
            cursor.execute("SELECT published_Status FROM `forms_templates` WHERE form_ID='"+Id+"'")
            print("SELECT published_Status FROM `forms_templates` WHERE form_ID='"+Id+"'")
            rowcount = cursor.fetchone()
            cursor.close()
            if(rowcount[0]==0):
                return render(request, "page.html", {'templateName': 'inactivetemplate.html'})
            else:
                data = render(request, "page.html", {'templateName': str(Id)+ '.html'})
                response = HttpResponse(data)
                response['X-Frame-Options'] = "ALLOWALL"
                return response
        else:
            return render(request, "page.html",{'templateName': 'blank.html'})
            
class audiovideo_view(View):
    return_url = None
    def get(self , request,Id=''):
        return render(request, "audiovideotest.html")
        
@csrf_exempt
@require_http_methods(["POST"])
#@require_POST
def InsertVideo(request):
    if request.method =="POST":
        file = request.FILES['file']
        fname = request.POST.get('filename')
        ftype = request.POST.get('type')
        url=''
        if ftype=='audio':
            fs= FileSystemStorage(location= settings.MEDIA_ROOT +'/audios/')
            file_path=fs.save(file.name.replace(' ','_'),file) 
            url = '/media/audios/'+file_path
        else:
            fs= FileSystemStorage(location= settings.MEDIA_ROOT +'/videos/')
            file_path=fs.save(file.name.replace(' ','_'),file) 
            url = '/media/videos/'+file_path
        return HttpResponse('https://test.techdivaa.com'+url)
        
        
@csrf_exempt
@require_http_methods(["POST"])
#@require_POST
def fileupload_View(request):
    files = request.FILES.getlist('file')
    url = ''
    storage_client = storage.Client.from_service_account_json('/home/techtvxs/Forms/formApps/cloud_json.json')
    bucket_name = "interview_app_files"
    bucket = storage_client.get_bucket(bucket_name)
    if len(files) != 0:
        for file in files:
            blob = bucket.blob(str(file.name.replace(' ','_')))
            blob.upload_from_file(file)
            #fs= FileSystemStorage(location= settings.MEDIA_ROOT +'/Files/')
            #file_path=fs.save(file.name.replace(' ','_'),file) 
            #url += '/media/Forms/'+file_path
            blob.make_public()
            url += blob.public_url
    else:
        print('No File') 
    return HttpResponse(url)    

            

        
        
