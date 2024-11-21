from decimal import Decimal
from .models import INTEREST_RATE, DELAYED_INTEREST_RATE
from datetime import datetime
from calendar import monthrange

def get_payment_values(p: Decimal, n: int) -> tuple[Decimal, Decimal]:
    r = INTEREST_RATE
    x = (p*r*(1+r)**n)
    y = (((1+r)**n) - 1)
    ans = x/y
    return ans, ans * (1+DELAYED_INTEREST_RATE) 

def add_to_month(date: datetime, n: int) -> datetime:
    day = date.day
    month = date.month
    year = date.year
    month -= 1
    month += n
    year += month // 12
    month %= 12
    month += 1
    day_max = monthrange(year, month)[1]
    day = min(day+1, day_max)
    return datetime(year, month, day)