from re import template
from django.utils.html import format_html
from django.urls import reverse
from django.contrib import admin
from django.dispatch import receiver
from django.urls import URLPattern, path,include
from django.shortcuts import render
from django.db.models.signals import post_save,pre_delete
from django.db import connection
from .models import RegistrationTbl,PlanTable,TalenstsumoFolder,TalenstsumoTemplates,MemberMapping
import mysql.connector
from mysql.connector import Error

# Register your models here.


class AdminRegister(admin.ModelAdmin):
    list_display = ['fullname','email','password','Plan','registered_at','is_active']

admin.site.register(RegistrationTbl, AdminRegister)


class AdminPlans(admin.ModelAdmin):
    list_display = ['name','features','created']

admin.site.register(PlanTable, AdminPlans)

class AdminTalenstsumoFolder(admin.ModelAdmin):
    list_display = ['name','created']

admin.site.register(TalenstsumoFolder, AdminTalenstsumoFolder)


class AdminTalenstsumoTemplates(admin.ModelAdmin):
    list_display = ['temp_id','temp_name','temp_folder','created','account_actions']

admin.site.register(TalenstsumoTemplates, AdminTalenstsumoTemplates)


class AdminMember(admin.ModelAdmin):
    list_display = ['user','member_of','created']
    
admin.site.register(MemberMapping, AdminMember)

@receiver(post_save, sender=TalenstsumoTemplates)
def add_page(sender, **kwargs):
    connection = mysql.connector.connect(host='',database='techtvxs_interview',user='techtvxs_phpinterview',password='(%G3CBBg}pBg')
    cursor1 = connection.cursor()
    if kwargs['created']:
        template = TalenstsumoTemplates.objects.get(id=kwargs.get('instance').id)
        folderId = TalenstsumoFolder.objects.get(name = template.temp_folder)
        cursor1.execute("INSERT INTO `templ_tbl`(`temp_Name`, `temp_img`, `temp_type`, `folder_id`,`temp_Id`) VALUES ('"+str(template.temp_name)+"','"+str('')+"','"+str('TalentSumo')+"','"+str(folderId.id)+"','"+str(template.temp_id)+"')")
        connection.commit()
    else:
        template = TalenstsumoTemplates.objects.get(id=kwargs.get('instance').id)
        folderId = TalenstsumoFolder.objects.get(name = template.temp_folder)
        cursor1.execute("UPDATE `templ_tbl` SET `temp_Name`='"+str(template.temp_name)+"',`folder_id`='"+str(folderId.id)+"' WHERE  `temp_Id`= '"+str(template.temp_id)+"';")
        connection.commit()
    cursor1.close()

@receiver(pre_delete, sender=RegistrationTbl)
def add_page(sender, **kwargs):
    userdtls = RegistrationTbl.objects.get(id=kwargs.get('instance').id)
    connection = mysql.connector.connect(host='',database='techtvxs_interview',user='techtvxs_phpinterview',password='(%G3CBBg}pBg')
    cursor1 = connection.cursor()
    cursor1.execute("DELETE FROM `registration_tbl` WHERE `email`='"+str(userdtls.email)+"';")
    connection.commit()
    cursor1.close()


@receiver(pre_delete, sender=TalenstsumoTemplates)
def add_page(sender, **kwargs):
    template = TalenstsumoTemplates.objects.get(id=kwargs.get('instance').id)
    folderId = TalenstsumoFolder.objects.get(name = template.temp_folder)
    connection = mysql.connector.connect(host='',database='techtvxs_interview',user='techtvxs_phpinterview',password='(%G3CBBg}pBg')
    cursor1 = connection.cursor()
    cursor1.execute("DELETE FROM `templ_tbl` WHERE `folder_id`='"+str(folderId.id)+"' and `temp_Id`= '"+str(template.temp_id)+"';")
    connection.commit()
    cursor1.close()


def get_admin_urls(urls):
    def get_urls():
        my_urls =  [
           path('templates/<str:Id>/', TemplateEditView,name='templates'), 
        ]
        return my_urls + urls
    return get_urls

admin.autodiscover()

admin_urls = get_admin_urls(admin.site.get_urls())
admin.site.get_urls = admin_urls

def TemplateEditView(request,Id=''):
    templatedetails = TalenstsumoTemplates.objects.get(temp_id=Id)
    connection = mysql.connector.connect(host='',database='techtvxs_interview',user='techtvxs_phpinterview',password='(%G3CBBg}pBg')
    cursor1 = connection.cursor()
    cursor1.execute( "SELECT * FROM `templ_tbl` where temp_Id='"+str(templatedetails.temp_id)+"';")
    rows = cursor1.fetchone()
    cursor1.close()
    return render(request , 'TelentSumoTemp.html',{'id':rows[3],'formName':rows[0],'formLongId':Id})