from django.db import models
from django.contrib.auth.models import User

# Create your models here.
NUMBER_RATINGS = (
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 9),
    (10, 10),
)

class JournalEntry(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    date = models.DateField()
    rating = models.IntegerField(
        choices = NUMBER_RATINGS,
    )
    description = models.CharField(max_length = 1000)

    def __str__(self):
        return (str(self.date) + " " + str(self.rating) + " " + self.description)