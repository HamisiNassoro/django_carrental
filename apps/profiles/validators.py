from django.db.models import Q

from apps.common.phone import parse_kenya_phone, phone_lookup_variants
from apps.profiles.models import Profile


def phone_number_in_use(phone: str, *, exclude_profile_id=None) -> bool:
    if not phone or not str(phone).strip():
        return False
    try:
        normalized = parse_kenya_phone(str(phone))
    except Exception:
        return False

    variants = phone_lookup_variants(normalized)
    qs = Profile.objects.filter(Q(phone_number__in=variants))
    if exclude_profile_id:
        qs = qs.exclude(pk=exclude_profile_id)
    return qs.exists()
