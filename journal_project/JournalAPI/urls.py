from django.urls import path
from . import views

urlpatterns = [
    path('', views.welcome_page),
    path('register/', views.register_user),
    path('login/', views.login_user),
    path('logout/', views.logout_user),
    path('home/', views.home_page),
    path('entries/', views.view_entries),
    path('filter-entries/', views.filter_entries),
    path('entry/<int:entryID>', views.view_entry),
    path('new-entry/', views.create_entry),
    path('entry-success', views.successful_entry),
    path('edit-entry/<int:entryID>', views.edit_entry),
    path('delete-entry/<int:entryID>', views.delete_entry),
    path('dashboard/', views.dashboard),
]