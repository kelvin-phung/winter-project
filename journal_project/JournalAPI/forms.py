from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from JournalAPI.models import JournalEntry

class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

class JournalEntryForm(forms.ModelForm):
    class Meta:
        model = JournalEntry
        fields = '__all__'