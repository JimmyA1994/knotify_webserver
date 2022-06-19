from knotify import knotify

class KnotifyClient:

    def __init__(self, options_dict):
        self.options = knotify.new_options()
        self.options(args=[])

        # pass the pseudoknot, hairpin and energy options
        # TODO: they have already been validated
        for key, value in options_dict.items():
            setattr(self.options, key, value)

        self.algorithm, self.config = knotify.from_options(self.options)

    def predict(self, sequence):
        if self.is_valid_input(sequence):
            results = self.algorithm.get_results(sequence, **self.config)
            result = results.loc[0]
            return result.dot_bracket
        else:
            return None

    def is_valid_input(self, sequence):
        if sequence and isinstance(sequence, str):
            return set(sequence).issubset({'G', 'C', 'A', 'U'})
        else:
            return False
