from django.shortcuts import render, redirect
from JournalAPI.forms import JournalEntryForm, CreateUserForm
from JournalAPI.models import JournalEntry
from django.http import JsonResponse, Http404
from datetime import datetime
from django.core.paginator import Paginator, EmptyPage
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from collections import defaultdict
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.probability import FreqDist
nltk.download('punkt')
nltk.download('stopwords')
from hugchat import hugchat
from hugchat.login import Login

# Create your views here.
def register_user(request):
    # if request.user.is_authenticated:
    #     return redirect(welcome_page)
    form = CreateUserForm()
    if request.method == "POST":
        form = CreateUserForm(json.loads(request.body.decode('utf-8')))
        if form.is_valid():
            form.save()
            return JsonResponse({"valid": 1, "u_errors": [], "e_errors": [], "p1_errors": [], "p2_errors": []})
        else:
            errors = form.errors
            u_errors = errors['username'] if 'username' in errors else []
            e_errors = errors['email'] if 'email' in errors else []
            p1_errors = errors['password1'] if 'password1' in errors else []
            p2_errors = errors['password2'] if 'password2' in errors else []
            return JsonResponse({"valid": 2, "u_errors": u_errors, "e_errors": e_errors, "p1_errors": p1_errors, "p2_errors": p2_errors})
    context = {"form" : form}
    return render(request, "register.html", context)

def login_user(request):
    # if request.user.is_authenticated:
    #     return redirect(welcome_page)
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        password = data['password']

        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)
            # return redirect(welcome_page)
            return JsonResponse({"data": [username, password], "authenticated" : 1})
        else:
            # messages.info(request, 'Username or password is incorrect.')
            return JsonResponse({"data": [username, password], "authenticated" : 2})
        
    return render(request, "login.html")

def logout_user(request):
    logout(request)
    return redirect(login_user)

@login_required(login_url='/login')
def welcome_page(request):
    return render(request, "welcome.html")

@login_required(login_url='/login')
def home_page(request):
    return render(request, "home.html")

@login_required(login_url='/login')
def create_entry(request):
    form = JournalEntryForm()
    if request.method == 'POST':
        print(json.loads(request.body.decode('utf-8')))
        form = JournalEntryForm(json.loads(request.body.decode('utf-8')) | {"user": request.user})
        if form.is_valid():
            cd = form.cleaned_data
            je = JournalEntry(
                user = request.user,
                date = cd['date'],
                rating = cd['rating'],
                description = cd['description'],
            )
            je.save()
            return JsonResponse({"valid": 1, "date_errors": [], "rating_errors": [], "desc_errors": []})
        else:
            errors = form.errors
            date_errors = errors['date'] if 'date' in errors else []
            rating_errors = errors['rating'] if 'rating' in errors else []
            desc_errors = errors['description'] if 'description' in errors else []
            return JsonResponse({"valid": 2, "date_errors": date_errors, "rating_errors": rating_errors, "desc_errors": desc_errors})
    context = {"form" : form}
    return render(request, "create_entry.html", context)

@login_required(login_url='/login')
def successful_entry(request):
    return render(request, "successful_entry.html")

@login_required(login_url='/login')
def view_entries(request):
    filtered = False
    entries = JournalEntry.objects.filter(user=request.user).values_list('id', 'date', 'rating', 'description')
    # Filter parameters
    date_req = request.GET.get('date')
    rating_req = request.GET.get('rating')
    desc_req = request.GET.get('description') if request.GET.get('description') else ''
    if date_req:
        entries = entries.filter(date=date_req)
        filtered = True
    if rating_req:
        entries = entries.filter(rating=rating_req)
        filtered = True
    if desc_req:
        entries = entries.filter(description__icontains=desc_req)
        filtered = True
    if not len(entries): # If filtering parameters yield no results
        return render(request, "no_filter_results.html")
    page = int(request.GET.get('page', default=1))
    
    # Sort entries in reverse chronological order
    entries = entries.order_by('-date')
    max_page = len(entries) // 10 + 1
    # Limit 10 entries shown per page
    # paginator = Paginator(entries, per_page=10)
    # try:
    #     entries = paginator.page(number=page)
    # except EmptyPage:
    #     raise Http404
    
    context = {"entries" : entries, "date" : date_req, "rating" : rating_req, "description" : desc_req, "filtered" : filtered,
               "page" : page, "back_page" : page - 1, "next_page" : page + 1, "max_page" : max_page}
    print(entries)
    print(type(entries))
    return JsonResponse({"entries" : list(entries)})
    #return render(request, "view_entries.html", context)

@login_required(login_url='/login')
def view_entry(request, entryID):
    entry = JournalEntry.objects.filter(id=entryID).values_list('date', 'rating', 'description')
    context = {"entry" : entry}
    return JsonResponse({"entry" : list(entry)})
    #return render(request, "view_entry.html", context)

@login_required(login_url='/login')
def edit_entry(request, entryID):
    # entry = JournalEntry.objects.get(id=entryID)
    # initial_data = {
    #     'date': entry.date,
    #     'rating': entry.rating,
    #     'description': entry.description
    # }
    # Prefill form with initial responses
    # form = JournalEntryForm(initial=initial_data)
    print(request)
    if request.method == 'POST':
        # Get URL of previous page
        # next = request.GET.get('next', view_entries)
        # if 'cancel' in request.POST:
        #     return redirect(next)
        entry = JournalEntry.objects.get(id=entryID)
        form = JournalEntryForm(json.loads(request.body.decode('utf-8')) | {"user": request.user})
        if form.is_valid():
            # Update values for entry
            data = json.loads(request.body.decode('utf-8'))
            entry.date = data['date']
            entry.rating = data['rating']
            entry.description = data['description']
            entry.save()
            return JsonResponse({"valid": 1, "date_errors": [], "rating_errors": [], "desc_errors": []})
            #return redirect(next)
        else:
            errors = form.errors
            date_errors = errors['date'] if 'date' in errors else []
            rating_errors = errors['rating'] if 'rating' in errors else []
            desc_errors = errors['description'] if 'description' in errors else []
            return JsonResponse({"valid": 2, "date_errors": date_errors, "rating_errors": rating_errors, "desc_errors": desc_errors})
    # context = {"form" : form}
    # return render(request, "edit_entry.html", context)

@login_required(login_url='/login')
def delete_entry(request, entryID):
    JournalEntry.objects.get(id=entryID).delete()
    # Get URL of previous page
    next = request.GET.get('next', view_entries)
    return redirect(next)

curr_descriptions = defaultdict(lambda: '')
curr_keywords = {}
curr_summary = {}
@login_required(login_url='/login')
def dashboard(request):
    # Visualization of last 10 entries
    img = BytesIO()
    entries = JournalEntry.objects.filter(user=request.user).order_by('-date')[0:10]
    dates = [str(entry.date)[5:] for entry in entries]
    dates.reverse()
    ratings = [entry.rating for entry in entries]
    ratings.reverse()
    plt.plot(dates, ratings)
    plt.xticks(rotation=45)
    plt.xlabel('Date')
    plt.ylabel('Rating')
    plt.title('Ratings of the past 10 entries')
    plt.savefig(img, format='png')
    plt.close()
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode('utf8')

    # Top 3 words in entry descriptions
    def extract_keywords(text):
        stop_words = set(stopwords.words('english'))
        words = word_tokenize(text)
        filtered_words = [word.lower() for word in words if word.isalnum() and word.lower() not in stop_words]
        word_freq = FreqDist(filtered_words)
        return word_freq.most_common(3)
    
    # Summarize entry descriptions using HuggingChat
    def summarize_text(text):
        EMAIL = "kelvinphung12@gmail.com"
        PASSWORD = "HermioneAngelicaLexie1128!"
        sign = Login(EMAIL, PASSWORD)
        cookies = sign.login()
        prompt = "Provide words of encouragement/advice based on these journal entries from the past 10 days, in <100 words.\n"
        prompt = prompt + text
        chatbot = hugchat.ChatBot(cookies=cookies.get_dict())
        return chatbot.chat(prompt)
    
    global curr_descriptions, curr_keywords, curr_summary
    descriptions = [entry.description for entry in entries]
    descriptions = ' '.join(descriptions)
    if curr_descriptions[str(request.user)] != descriptions:
        curr_descriptions[str(request.user)] = descriptions
        curr_keywords[str(request.user)] = extract_keywords(descriptions)
        curr_summary[str(request.user)] = summarize_text(descriptions)
    if str(request.user) not in curr_keywords:
        curr_keywords[str(request.user)] = ''
    if str(request.user) not in curr_summary:
        curr_summary[str(request.user)] = ''

    context = {"url" : plot_url, "keywords" : curr_keywords[str(request.user)], "summary" : curr_summary[str(request.user)]}
    
    return render(request, "dashboard.html", context)