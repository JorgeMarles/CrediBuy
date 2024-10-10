from django.db import models
from django.core.validators import MinValueValidator


# Create your models here.
class ProductType(models.Model):
    STATUSES = {"active": "Active", "inactive": "Inactive"}
    name = models.CharField(max_length=511, null=False)
    status = models.CharField(max_length=55, choices=STATUSES)

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255, null=False)
    price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0.01)]
    )
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE)
    description = models.TextField()
    stock = models.IntegerField(validators=[MinValueValidator(0)])

    def __str__(self) -> str:
        return self.name
