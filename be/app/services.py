from .decorators import singleton

@singleton
class CounterService:
    def __init__(self):
        self.value = 0

    def incr2ement(self):
        self.value += 1
        return self.value
