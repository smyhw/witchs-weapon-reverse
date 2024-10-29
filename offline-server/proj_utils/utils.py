dbg_enabled = False
def dbg(*args) -> bool:
    if len(args)==0:
        return dbg_enabled

def enable_dbg() -> None:
    global dbg_enabled
    dbg_enabled = True
    dbg("！！！！！！！！！调试模式已启用！！！！！！！！！")


