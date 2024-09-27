from django.db import models

# Create your models here.
class ProductType(models.Model):
    STATUSES = {
        "active": "Active",
        "inactive": "Inactive"
    }
    name = models.CharField(max_length=511, null=False)
    status = models.CharField(max_length=55, choices=STATUSES)

    def __str__(self) -> str:
        return self.name
    
class User(models.Model):
    first_name = models.CharField(max_length=255, null=False)
    last_name = models.CharField(max_length=255, null=False)
    email = models.EmailField(null=False)
    password = models.CharField(max_length=255, null=False)

    class Meta:
        abstract = True
    
    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"
    
class Client(User):
    address = models.CharField(max_length=255, null=False)
    phone = models.CharField(max_length=15, null=False)


class Employee(User):
    role = models.CharField(max_length=255, null=False)

class Administrator(User):
    pass