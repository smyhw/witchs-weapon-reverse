'''
登入接口
/account/user/login
逆向void __fastcall WaterBell_ProjX_Data_NetIO_JasonUtil__ParseRegistAndLoginJason



{
  "UID": "1234567890",  //似乎没有非空检查
  "Token": "1234567890",
  "LoginToken": "1234567890",
  "Phone": "12345678901",
  "Email": "i@smyhw.online",
  "ThirdParty": "0",  //？字串，不可为空
  "UserType": 0,  //短信登入，邮箱登入之类的
  "IDCardStatus": "ErrorLog", //？？？ 条件读取，但是条件未知
  "OnlineTime": "OnlineTime"
}
'''

from flask import make_response
from subserver_account import app
from proj_utils import * 

@app.route("/account/user/login",methods=['POST'])
def login():
    # 打印请求方法
    print(request.method)

    # 打印请求数据
    print(request.data)

    # 打印表单数据
    print(request.form)

    # 打印请求参数
    print(request.args)
    log("test1")
    return {
  "Ecode": "",
  "Value": {
        "UID": 123123123,
        "Token": "abc",
        "LoginToken": "bcd",
        "Phone": 18252729078,
        "Email": "i@smyhw.online",
        "ThirdParty": 0, 
        "UserType": 2, 
        "IDCardStatus": 1,
        "OnlineTime": 111,
        "OnlineStep": 2,
        "ZoneInfo": [
            {
                "Platform": 0,
                "ZID": 0,
                "ZoneName": "qwq",
                "ZoneStatus": 1,
                "ServerIP": "127.0.0.1",
                "Sort": 1
            }
        ]
  },
 
}