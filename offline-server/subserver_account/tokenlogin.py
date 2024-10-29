'''
'''

from flask import make_response
from subserver_account import app
from proj_utils import * 

@app.route("/account/user/tokenlogin",methods=['POST'])
def tokenlogin():
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