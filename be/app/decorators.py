import threading
import functools
import inspect


def singleton(class_):

    original_new = class_.__new__
    original_init = class_.__init__
    instance = None
    initialized = False
    first_args = None
    first_kwargs = None
    lock = threading.Lock()
    
    def new_new(cls, *args, **kwargs):
        nonlocal instance, first_args, first_kwargs
        
        with lock:
            if instance is None:
                # First instantiation
                if original_new is object.__new__:
                    instance = object.__new__(cls)
                else:
                    instance = original_new(cls, *args, **kwargs)
                first_args = args
                first_kwargs = kwargs
            else:
                # Subsequent instantiations - validate args match
                if args != first_args or kwargs != first_kwargs:
                    raise ValueError(
                        f"Singleton {cls.__name__} already instantiated with different arguments. "
                        f"Original: args={first_args}, kwargs={first_kwargs}. "
                        f"New: args={args}, kwargs={kwargs}"
                    )
        
        return instance
    
    @functools.wraps(original_init)
    def new_init(self, *args, **kwargs):
        nonlocal initialized
        with lock:
            if not initialized:
                original_init(self, *args, **kwargs)
                initialized = True
    
    new_init.__signature__ = inspect.signature(original_init)
    
    class_.__new__ = staticmethod(new_new)
    class_.__init__ = new_init
    
    original_sig = inspect.signature(original_init)
    params_without_self = [
        param for name, param in original_sig.parameters.items()
        if name != 'self'
    ]
    class_.__signature__ = original_sig.replace(parameters=params_without_self)
    
    return class_
