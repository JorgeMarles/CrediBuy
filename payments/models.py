from django.db import models
from django.core.validators import MinValueValidator

from users.models import Client
from products.models import Product


# Create your models here.
class Credit(models.Model):
    STATUSES = {
        "started": "Started",
        "in_review": "In review",
        "rejected": "Rejected",
        "active": "Active",
        "completed": "Completed"
    }
    client = models.ForeignKey(Client, on_delete=models.SET_NULL)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=30, choices=STATUSES)
    debt = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    total_payments = models.IntegerField(validators=[MinValueValidator(0)])

class Payment(models.Model):
    STATUSES = {
        "pending": "Pending",
        "completed": "Completed",
        "delayed": "Delayed"
    }
    credit = models.ForeignKey(Credit, on_delete=models.SET_NULL)
    value = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])
    due_to = models.DateField()
    status = models.CharField(max_length=30, choices=STATUSES)
    value_delayed = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)])