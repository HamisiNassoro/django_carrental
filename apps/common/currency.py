COUNTRY_CURRENCY = {
    "KE": "KES",
    "US": "USD",
    "GB": "GBP",
    "UK": "GBP",
    "CA": "CAD",
    "AU": "AUD",
}

CURRENCY_SYMBOLS = {
    "KES": "KSh",
    "USD": "$",
    "GBP": "£",
    "CAD": "CA$",
    "AUD": "A$",
}


def currency_for_country(country_code: str) -> str:
    if not country_code:
        return "KES"
    return COUNTRY_CURRENCY.get(str(country_code).upper(), "KES")
