


import datetime
import sys
import traceback
from typing import Tuple

from loguru import logger


logger.add(sys.stdout, colorize=True, format="<green>{time}</green> <level>{message}</level>")

def warn(*args,dp:int=None):
    re = ""
    for i in range(len(args)):
        try:
            re+=str(args[i])+" "
        except Exception as e:
            re+=" *非可打印日志* "
    for one_line in re.split('\n'):
        if dp != None:
            log().opt(depth=dp).warning(one_line)
        else:
            log().warning(one_line)


    re = ""
    for i in range(len(args)):
        try:
            re+=str(args[i])+" "
        except Exception as e:
            re+=" *非可打印日志* "
    for one_line in re.split('\n'):
        log().debug(one_line)


def log(*args):
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
    return logger.opt(depth=1)


def handle_exception(e,c_str) -> Tuple[str,int]:
    warn('! ['+str(datetime.datetime.now())+'] <异常记录> -> ',dp=2)
    warn( "异常详情 --->>> \n",dp=2)
    if not e == None:
        warn("异常类型 -> "+str(type(e)),dp=2)
        warn("\n==========================\n",dp=2)
        warn("异常描述 -> "+str(e),dp=2)
        warn("\n==========================\n",dp=2)
        warn("异常堆栈 -> "+str(traceback.format_exc()),dp=2)
        warn("\n==========================\n",dp=2)
        warn("异常参数 -> "+str(e.args),dp=2)
        warn("\n==========================\n",dp=2)
        warn("异常原因 -> "+str(e.__cause__),dp=2)
        warn("\n==========================\n",dp=2)
        warn("异常上下文 -> "+str(e.__context__),dp=2)
        warn("\n==========================\n",dp=2)
        warn("异常上下文 -> "+str(e.__traceback__),dp=2)
    if c_str==None:
        e_str = str(e)
        if "got an unexpected keyword argumen" in e_str:
            c_str = "包含无效参数，请检查参数名称！"
        elif "Failed to decode JSON object" in e_str:
            c_str = "解析json失败，请检查json格式！"
        elif "Found input variables with inconsistent numbers of samples" in e_str:
            c_str = "样本数量不一致！"
        else:
            c_str = e_str
    warn("\n==========================\n",dp=2)
    warn("诊断参考 -> "+c_str,dp=2)
    return {"err_msg":c_str,"error":1},500