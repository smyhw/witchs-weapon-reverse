import argparse
import base64
import builtins
import os
import sys
from flask import Flask, request
from loguru import logger
import tomllib

#暴露方法
from .utils import *
from .log import *

#这些是硬编码的配置信息，不应在配置中被更改！

#项目名称
__project_name = "魔女兵器-离线模拟服务端"

#对配置文件进行更改后应修改这个值，以确保配置文件格式正确
config_version = "2024.9.18.1"


#全局常量
__config_file_path = "./cfg.toml"
config = None
__wsgi_app = None


#获取内置wsgi的实例
def get_app():
    global __wsgi_app
    if __wsgi_app == None:
        __wsgi_app  = Flask(__project_name)
    return __wsgi_app

#运行内置wsgi实例
def run_http():
    run_app(__wsgi_app)

#运行给定wsgi实例
#TODO实现高级配置中的选项直接导入 waitress
def run_app(app):
    from waitress import serve
    serve(app, host=config.http_api.bind_addr, port=config.http_api.bind_port)
    

 
 
def __init_config():
    global config

    parser = argparse.ArgumentParser(
                    prog=__project_name,
                    description='请始终参阅readme',
                    epilog='魔女兵器-离线服务端')
    parser.add_argument('-d', '--debug',
                    action='store_true',
                    help="调试模式")
    parser.add_argument('-l', '--store-log',
                    action='store_true',
                    help="保留日志")
    parser.add_argument('-p', '--port',
                    action='store',
                    type=int,
#                    default=8881,
                    help="指定监听端口")
    parser.add_argument('-H', '--host',
                    action='store',
                    type=str,
#                    default='0.0.0.0',
                    help="指定监听地址")
    parser.add_argument('-w','--w_args', type=str, nargs='*',
                    help='这些参数将直接传递给waitress')
    args = parser.parse_args()

    dbg("命令行启动参数 -> ",args)

    dconfig = {}

    #如果有配置文件，读取它作为基础
    if os.path.exists(__config_file_path):
        try:
            with open(__config_file_path, "rb") as f:
                dconfig = tomllib.load(f)
        except tomllib.TOMLDecodeError as e:
            print("配置文件存在，但格式错误，请排查！",e)
            sys.exit(1)
    print("基础配置(文件)->",dconfig)
    try:
        if args.debug != None and args.debug:
            dconfig['debug'] = args.debug
            print("debug被命令行参数覆盖")
        if args.host != None:
            dconfig['http_api']['bind_addr'] = args.host
            print("bind_addr被命令行参数覆盖")
        if args.port != None:
            dconfig['http_api']['bind_port'] = args.port
            print("bind_port被命令行参数覆盖")
        if args.store_log != None and args.store_log:
            dconfig['log']['store_log'] = args.store_log
            print("store_log被命令行参数覆盖")
    except Exception as e:
            print("配置文件疑似缺少条目",e)
    from .config import DotDict
    config = DotDict(dconfig)






print(r'''
====================================================================

====================================================================''')
print("> 启动   <-> "+__project_name)
print()

print("初始化配置...")
__init_config()
print("尝试dump所有配置...",config)
log_level = "INFO"
if config.debug:
    log_level = "DEBUG"

#日志相关
log().remove()
log().add(sys.stdout,format='<m><b>[</b></m><u><d><i>{time:(zz) YYYY - MM - DD}</i></d> #</u> {time:hh : mm : ss}<m><b>] [</b></m><bold>{level: ^9}</bold> <m><b>] [</b></m> <underline>{name: ^40}</underline> <m><b>] [</b></m> {function: ^20} <m><b>] [</b></m> {line: ^3} <m>]</m> <w><b> > </b></w> {message}',level=log_level,catch=True)
#    log().info("一般信息")
#    log().debug("调试信息")
#    log().warning("警告信息")
#    log().error("错误信息")
if config.debug:
    enable_dbg()

#hook所有print
old_print = builtins.print
def hook_print(*args, **kwargs):

    if len(args)!=0:
        re = ""
        for i in range(len(args)):
            try:
                re += str(args[i])+" "
            except Exception as e:
                re+=" *非可打印日志* "
        for one_line in re.split('\n'):
            logger.opt(depth=1).info(one_line)
        return None
builtins.print = hook_print



    
if config.store_log:
    log().add("./"+config.log.log_dir+"/{time}.log",rotation="2 MB",retention="7 days",compression="zip")
    log("写入文件日志已启用")
    




    # log("启动内置服务器，监听<"+args.host+">，端口<"+str(args.port)+">")
    # from waitress import serve
    # serve(app, listen=args.host+':'+str(args.port))
#    app.run(port=args.port)