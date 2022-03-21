from logging.config import valid_ident
from tokenize import String
from knotify import knotify

class KnotifyClient:

    def __init__(self):
        self.options = knotify.new_options()
        self.options(args=[])
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
