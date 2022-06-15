from datetime import datetime
import uuid
from django.db import models
from django.utils.html import format_html
from django.utils.translation import ugettext_lazy as _
from django.db.models.deletion import CASCADE

# Create your models here.

class PlanTable(models.Model):
    name = models.CharField(max_length=800)
    features = models.CharField(max_length=800)
    created = models.DateField(default=datetime.today())
    class Meta:
        verbose_name = _("Plan")
        verbose_name_plural = _("Plans")
            
    def __str__(self):
        return str(self.name)


class RegistrationTbl(models.Model):
    fullname = models.CharField(max_length=800,blank=True, null=True,default=None)
    email = models.EmailField(max_length=800)
    password = models.CharField(max_length=800,blank=True, null=True,default=None)
    Plan = models.ForeignKey(PlanTable,on_delete=CASCADE,default=1,max_length=800)
    registered_at = models.DateField(default=datetime.today())
    is_active = models.IntegerField(blank=True, null=True,default=0)
    
    class Meta:
        verbose_name = _("Registered Users")
        verbose_name_plural = _("Registered Users")

    @staticmethod
    def get_register_useremail(email):
        return RegistrationTbl.objects.get(email=email)
            
    def __str__(self):
        return str(self.email)

    def isExists(self):
        if RegistrationTbl.objects.filter(email = self.email):
            return True

        return  False

class MemberMapping(models.Model):
    member_of = models.ForeignKey(RegistrationTbl,on_delete=CASCADE,null=True,max_length=800,default=None,blank=True,related_name='member_of')
    user =  models.ForeignKey(RegistrationTbl,on_delete=CASCADE,null=True,max_length=800,default=None,blank=True,related_name='user')
    created = models.DateField(default=datetime.today())
    class Meta:
        verbose_name = _("Member Mapping")
        verbose_name_plural = _("Members Mapping")
            
    def __str__(self):
        return str(self.created)


class TalenstsumoFolder(models.Model):
    name = models.CharField(max_length=800)
    created = models.DateField(default=datetime.today())
    class Meta:
        verbose_name = _("Folder")
        verbose_name_plural = _("Folders")
            
    def __str__(self):
        return str(self.name)

    
class TalenstsumoTemplates(models.Model):
    temp_id =  models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    temp_name = models.CharField(max_length=800)
    temp_folder = models.ForeignKey(TalenstsumoFolder,on_delete=CASCADE,default=1,max_length=800)
    created = models.DateField(default=datetime.today())
    
    def account_actions(self):
        return format_html(
            '<a class="btn" href="/admin/templates/{}/" target="_blank">Edit Template</a>',
            self.temp_id,
        )
    class Meta:
        verbose_name = _("Template")
        verbose_name_plural = _("Templates")
            
    def __str__(self):
        return str(self.temp_name)

    
