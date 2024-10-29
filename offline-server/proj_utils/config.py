from collections import defaultdict
from functools import reduce


class DotDict(dict):
    def __getattr__(self, key):
        value = self.get(key)
        if isinstance(value, (dict, list)):
            if isinstance(value, dict):
                return DotDict(value)
            elif isinstance(value, list):
                return [DotDict(item) if isinstance(item, dict) else item for item in value]
        return value

    def __setattr__(self, key, value):
        self[key] = value

    def __delattr__(self, key):
        del self[key]
