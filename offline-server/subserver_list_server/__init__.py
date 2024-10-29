'''
该子服在游戏客户端启动时被调用，将其余子服的地址返回给客户端
'''
from proj_utils import * 
import threading
from flask import request
import importlib

name = "ListServer"

app = Flask("子模块服务器 —> "+name)
log("初始化子服务器 -> ",name)
package_path = os.path.dirname(__file__)
log("加载接口定义文件 -> "+package_path)
package_files = os.listdir(package_path)
for file in package_files:
    if file.endswith('.py') and file != '__init__.py':
        module_name = file[:-3]  # 去掉文件扩展名
        log("加载api -> "+module_name)
        module = importlib.import_module(f"{__package__}.{module_name}")

@app.errorhandler(404)
def page_not_found(error):
    path = request.path
    method = request.method
    headers = request.headers
    warn("遇到了未实现的接口！该功能还没有被实现！")
    warn("来自子服务器 -> "+name)
    warn(f"Request Details1 - Path: {path}, Method: {method}, Headers: {headers}")
    return "{}", 404
threading.Thread(target=lambda: app.run(host="0.0.0.0", port=80, debug=True, use_reloader=False),daemon=True).start()