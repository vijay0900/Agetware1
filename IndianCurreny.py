def format_indian_currency(amount):
    amount = str(amount)
    if '.' in amount:
        integer_part, decimal_part = amount.split('.')
    else:
        integer_part, decimal_part = amount, ''

    n = len(integer_part)
    if n <= 3:
        formatted = integer_part
    else:
        last_three = integer_part[-3:]
        rest = integer_part[:-3]
        rest = ','.join([rest[max(i - 2, 0):i] for i in range(len(rest), 0, -2)][::-1])
        formatted = rest + ',' + last_three

    return formatted + ('.' + decimal_part if decimal_part else '')


print(format_indian_currency(123456.7891))  
