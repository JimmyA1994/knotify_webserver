from knotify import knotify

class KnotifyClient:

    def __init__(self, pseudoknot_options, hairpin_options, energy_options, sequence):
        self.sequence = sequence
        self.N = len(self.sequence)

        self.options = knotify.new_options()
        self.options(args=[])

        # validate options
        self.validated_pseudoknot_options = self.validate_pseudoknot_options(pseudoknot_options)
        self.validated_hairpin_options = self.validate_hairpin_options(hairpin_options)
        self.validated_energy_options = self.validate_energy_options(energy_options)
        options_dict = {**self.validated_pseudoknot_options, **self.validated_hairpin_options,
                        **self.validated_energy_options}

        # pass the pseudoknot, hairpin and energy options
        for key, value in options_dict.items():
            setattr(self.options, key, value)

        self.algorithm, self.config = knotify.from_options(self.options)

    def predict(self):
        if self.is_valid_input():
            results = self.algorithm.get_results(self.sequence, **self.config)
            result = results.loc[0]
            return result.dot_bracket
        else:
            return None

    def is_valid_input(self):
        if self.sequence and isinstance(self.sequence, str):
            return set(self.sequence).issubset({'G', 'C', 'A', 'U'})
        else:
            return False

    def get_number_within_range(self, num, min, max):
        if num < min: return min
        elif num > max: return max
        else: return num

    def validate_pseudoknot_options(self, options):
        enforce_valid_value = {
            'parser': lambda v: 'yaep' if v not in ['yaep', 'bruteforce'] else v,
            'allow_ug': lambda v: str(v).lower() == 'true',
            'allow_skip_final_au': lambda v: str(v).lower() == 'true',
            'max_dd_size': lambda v: self.get_number_within_range(int(v), 0, 20),
            'min_dd_size': lambda v: self.get_number_within_range(int(v), 0, 20),
            # ensure that if N is less than 6, we don't allow lower than 6 values
            'max_window_size': lambda v: self.get_number_within_range(int(v), 6, max(6, self.N)),
            'min_window_size': lambda v: self.get_number_within_range(int(v), 6, max(6, self.N)),
            'max_window_size_ratio': lambda v: self.get_number_within_range(float(v), 0.0, 1.0),
            'min_window_size_ratio': lambda v: self.get_number_within_range(float(v), 0.0, 1.0),
            'max_stem_allow_smaller': lambda v: self.get_number_within_range(int(v), 0, 10),
            'prune_early': lambda v: str(v).lower() == 'true'
        }
        common_fields = enforce_valid_value.keys() & options.keys()
        return {field: enforce_valid_value[field](options[field]) for field in common_fields}


    def validate_hairpin_options(self, options):
        enforce_valid_value = {
            'hairpin_grammar': lambda v: str(v),
            'hairpin_allow_ug': lambda v: str(v).lower() == 'true',
            'min_hairpin_size': lambda v: self.get_number_within_range(int(v), 0, 10),
            'min_hairpin_stems': lambda v: self.get_number_within_range(int(v), 0, 20),
            'max_hairpins_per_loop': lambda v: self.get_number_within_range(int(v), 0, 2),
            'max_hairpin_bulge': lambda v: self.get_number_within_range(int(v), 0, 5),
        }
        common_fields = enforce_valid_value.keys() & options.keys()
        return {field: enforce_valid_value[field](options[field]) for field in common_fields}


    def validate_energy_options(self, options):
        enforce_valid_value = {
            'energy': lambda v: 'vienna' if v not in ['vienna', 'pkenergy'] else v,
        }
        common_fields = enforce_valid_value.keys() & options.keys()
        return {field: enforce_valid_value[field](options[field]) for field in common_fields}
