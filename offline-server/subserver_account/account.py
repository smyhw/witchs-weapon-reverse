'''
原始接口信息：
http://account-prod.witchs-weapon.com:8099

截止2024年9月，已不可访问，无法得知原始信息
'''


from flask import make_response
from subserver_account import app
from proj_utils import * 

@app.route("/account/test/ok",methods=['POST'])
def account_ok():
    log("aaa")
    return "ok"