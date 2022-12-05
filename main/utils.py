import uuid

def custom_id():
    return uuid.uuid4().hex[:8]

def get_pseudoknot_options_from_default_values(selected_pseudoknot_options):
    pseudoknot_options = {
        'parser':'yaep',
        'allow-ug': False,
        'max-dd-size': 2,
        'min-dd-size': 0,
        # 'max-window-size': 204,
        # 'min-window-size': 6,
        # 'max-window-size-ratio': 0,
        # 'min-window-size-ratio': 0,
        'max-stem-allow-smaller': 2,
        # 'prune-early': True,
    }
    pseudoknot_options.update(selected_pseudoknot_options)
    return pseudoknot_options

def get_hairpin_options_from_default_values(selected_hairpin_options):
    hairpin_options =  {
        'hairpin-allow-ug': False,
        'min-hairpin-size': 3,
        'min-hairpin-stems': 3,
        'max-hairpins-per-loop': 1,
        'max-hairpin-bulge': 0,
    }
    hairpin_options.update(selected_hairpin_options)
    return hairpin_options

def get_energy_options_from_default_values(selected_energy_options):
    energy_options =  {
        'energy': 'vienna'
    }
    energy_options.update(selected_energy_options)
    return energy_options
