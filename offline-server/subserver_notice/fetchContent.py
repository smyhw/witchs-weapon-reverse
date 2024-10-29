'''

'''
from flask import make_response
from subserver_notice import app
from proj_utils import * 

@app.route("/Notice/fetchContent",methods=['POST'])
def fetchContent():
    log("获取公告信息")
    return "你好"