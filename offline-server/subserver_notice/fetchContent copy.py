'''

'''
from flask import make_response
from subserver_notice import app
from proj_utils import * 

@app.route("/Notice/gameContent",methods=['GET'])
def gameContent():
    log("获取gameContent公告")
    return {
        "Ecode": "",
        "Value": {
            "Content": "123123",
            "Title": "标题"
        },
    }