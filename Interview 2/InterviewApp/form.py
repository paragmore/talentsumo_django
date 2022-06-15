from django import forms
from django.forms import Form

class FileFieldForm(Form):
    file = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))