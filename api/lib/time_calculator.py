import time
import datetime


class TimeCalculator:

    def __init__(self, name='algorithm'):
        self.name = name
        self.start_time = -1
        self.start()

    def start(self):
        self.start_time = time.time()

    def get_running_time(self):
        end_time = time.time()
        print('[{now}] Running time for "{name}": {time} sec.'.format(now=datetime.datetime.now(),
                                                                      name=self.name,
                                                                      time=str(end_time - self.start_time)))
