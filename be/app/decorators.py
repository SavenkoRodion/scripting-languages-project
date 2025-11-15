from functools import wraps

def singleton(cls):
    instance = None

    @wraps(cls)
    def get_instance(*args, **kwargs):
        nonlocal instance
        if instance is None:
            print(f"Creating singleton instance of {cls.__name__}")
            instance = cls(*args, **kwargs)
        return instance

    return get_instance
