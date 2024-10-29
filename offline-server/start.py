from proj_utils import *
from flask import Flask, request
import time


import subserver_account
import subserver_asbd
import subserver_cdn
import subserver_list_server
import subserver_notice
import subserver_talking

while True:
    print("loop")
    time.sleep(10)
