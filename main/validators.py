from django.core.exceptions import ValidationError
from enum import Enum, EnumMeta

class MetaEnum(EnumMeta):
    """
        MetaClass that allows checking for Enum membership
        Use it like this:
        obj in subEnum
    """
    def __contains__(cls, item):
        try:
            cls(item)
        except ValueError:
            return False
        return True

class Parser(Enum, metaclass=MetaEnum):
    bruteforce = 'bruteforce'
    yaep = 'yaep'

def pseudoknot_options_validator(value):
    if not isinstance(value, dict):
        raise ValidationError('Value not a dictionary')

    types_dict = {
        'parser': Parser, 'allow-ug': bool,
        # 'yaep-library-path', 'bruteforce-library-path',
        'allow-skip-final-au': bool, 'max-dd-size': int,
        'min-dd-size': int, 'max-window-size': int,
        'min-window-size': int, 'max-window-size-ratio': int,
        'min-window-size-ratio': int, 'max-stem-allow-smaller': int,
        'prune-early': bool
    }

    unknown_keys = value.keys() - types_dict.keys()
    if unknown_keys:
        raise ValidationError('Unknown keys')

    if 'parser' in value and not value['parser'] in Parser:
        raise ValidationError('Parser option not supported')

    is_invalid_type = lambda key, type: key in value and not isinstance(value[key], type)
    invalid = any([is_invalid_type(key, type) for key, type in enumerate(types_dict)])
    if invalid:
        raise ValidationError('Type Error')


def hairpin_options_validator(value):
    if not isinstance(value, dict):
        raise ValidationError('Value not a dictionary')

    types_dict = {
        'hairpin-grammar': str, 'hairpin-allow-ug': bool,
        'min-hairpin-size': int, 'min-hairpin-stems': int,
        'max-hairpins-per-loop': int, 'max-hairpin-bulge': int
    }

    unknown_keys = value.keys() - types_dict.keys()
    if unknown_keys:
        raise ValidationError('Unknown keys')

    is_invalid_type = lambda key, type: key in value and not isinstance(value[key], type)
    invalid = any([is_invalid_type(key, type) for key, type in enumerate(types_dict)])
    if invalid:
        raise ValidationError('Type Error')


class Energy(Enum, metaclass=MetaEnum):
    vienna = 'vienna'
    pkenergy = 'pkenergy'

def energy_options_validator(value):
    if not isinstance(value, dict):
        raise ValidationError('Value not a dictionary')

    types_dict = {
        'energy': Energy, 'pkenergy': str,
        # 'pkenergy-config-dir'
    }

    unknown_keys = value.keys() - types_dict.keys()
    if unknown_keys:
        raise ValidationError('Unknown keys')

    if 'energy' in value and not value['energy'] in Energy:
        raise ValidationError('Energy option not supported')

    is_invalid_type = lambda key, type: key in value and not isinstance(value[key], type)
    invalid = any([is_invalid_type(key, type) for key, type in enumerate(types_dict)])
    if invalid:
        raise ValidationError('Type Error')
