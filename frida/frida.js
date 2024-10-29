console.log("\n\n\n\n\n")

const targetModule = Module.findBaseAddress("libil2cpp.so");
console.log("libil2cpp偏移量 -> "+targetModule);



//console.log("====== 尝试启用debug日志 =========");
//let test_dbg = new NativeFunction(targetModule.add(0x283251C), 'void', ['bool']);
//test_dbg(1)


//读字符串
function getSysStr(base){
	var stringAddress = ptr(base);
	console.log("System.String读取开始:...")

	// 读取 System.String 结构
	var stringLengthOffset = 0x10; // 字符串长度的偏移量
	var stringCharsOffset = 0x14; // 字符数组的偏移量

	console.log("字符串基址 -> ",stringAddress)

	// 读取字符串长度
	var length = Memory.readInt(stringAddress.add(stringLengthOffset));
	
	console.log("长度 -> ",length)

	// 读取字符数组的指针
	var charsPtr = stringAddress.add(stringCharsOffset);

	console.log("首字指针 -> ",charsPtr)

	// 读取字符数组内容
	var chars = Memory.readUtf16String(charsPtr, length);

	// 打印字符串
	console.log("字符串内容: " + chars);
};
function get_str(base) {
	let stringAddress = ptr(base);
	let stringLengthOffset = 0x10;
	let stringCharsOffset = 0x14;
	let length = Memory.readInt(stringAddress.add(stringLengthOffset));
	let charsPtr = stringAddress.add(stringCharsOffset);
	let chars = Memory.readUtf16String(charsPtr, length);
	return chars;
}


console.log("处理WaterBell.ProjX.Data.NetIO -> NetMsgBase");

//=========================================================================================================================
const target_offset_OnError = 0x3F71D00;
const target_offset_OnError_fin = targetModule.add(target_offset_OnError);
console.log("hook OnError -> 函数偏移="+target_offset_OnError+"   //   总偏移="+target_offset_OnError_fin)


Interceptor.attach(target_offset_OnError_fin, {
	onEnter: function(args) {
		console.log("\n\n====== 网络请求OnError HOOK被触发 =========")
		console.log("参数-> " + args[1]);
		console.log('RegisterNatives called from:\n' +
				Thread.backtrace(this.context, Backtracer.FUZZY)
				.map(DebugSymbol.fromAddress).join('\n') + '\n');
		console.log("fin======================================")
		
	}
});

//=========================================================================================================================
const target_offset_OnFail = 0x3F662AC;
const target_offset_OnFail_fin = targetModule.add(target_offset_OnFail);
console.log("hook OnFail -> 函数偏移="+target_offset_OnFail+"   //   总偏移="+target_offset_OnFail_fin)


Interceptor.attach(target_offset_OnFail_fin, {
	onEnter: function(args) {
		console.log("====== OnOnFail HOOK被触发 =========")
		console.log("参数地址 -> " + args[0] ); // 打印参数
		let str_arg1 = get_str(args[0])
		console.log("实际值 -> "+str_arg1)
		
		console.log("fin======================================")
		
	}
});

//=========================================================================================================================
const target_offset_OnInternalError = 0x3F73584;
const target_offset_OnInternalError_fin = targetModule.add(target_offset_OnInternalError);
console.log("hook OnInternalError -> 函数偏移="+target_offset_OnInternalError+"   //   总偏移="+target_offset_OnInternalError_fin)


Interceptor.attach(target_offset_OnInternalError_fin, {
	onEnter: function(args) {
		console.log("====== OnInternalError HOOK被触发 =========")
		console.log("参数地址 -> " + args[0] ); // 打印参数
		let str_arg1 = get_str(args[0])
		console.log("实际值 -> "+str_arg1)
		console.log("fin======================================")
		
	}
});



//public AccountCheckCode(string account, string code, string usertype, string mflag, string uid)
(function(){
	
	let offset = 0x3EEF1C8;
	let offset_fin = targetModule.add(offset);
	let name = "AccountCheckCode"
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> "+offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========")
		console.log("account -> " + args[0]);
		console.log("code -> " + args[1]);
		console.log("usertype -> " + args[2]);
		console.log("mflag -> " + args[3]);
		console.log("uid -> " + args[4]);
		console.log("fin======================================")
		}
	});
})();


//public override void OnInternalError(string detail)
(function(){
	let offset = 0x3F05D48;
	let offset_fin = targetModule.add(offset);
	let name = "OnInternalError";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========");
		console.log("detail -> " + args[0] + "   --->>   "+get_str(args[0]));
		console.log("fin======================================");
		}
	});
})();



(function(){
	let offset = 0x3AD2DB8;
	let offset_fin = targetModule.add(offset);
	let name = "SelectServerZoneItem";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========");
		console.log("detail -> " + args[0] + "   --->>   "+get_str(args[0]));
		console.log("fin======================================");
		}
	});
})();
// 账户服务器检查 
// ==================================================================================================================

(function(){
	let offset = 0x3AB5D88;
	let offset_fin = targetModule.add(offset);
	let name = "ChechAccServerState";
	
	let obj_point = 0x1
	
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
		onEnter: function(args) {
			console.log("====== "+name+" HOOK被触发 =========");
			console.log("detail -> " + args[0] + "   --->>   "+get_str(args[0]));
			obj_point = new NativePointer(args[0])
		},
		onLeave: function(args) {
			console.log("====== "+name+" 尝试回调检查通过逻辑 =========");
			let originalFunction = new NativeFunction(targetModule.add(0x3AB62D0), 'void', ['pointer']);
			originalFunction(obj_point)
		}
	});
})();

// 这里屏蔽掉所有检查失败后的逻辑
(function(){
	let offset = 0x3AB6170;
	let offset_fin = targetModule.add(offset);
	let name = "ChechAccServerStateError";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	//替换函数
	let replacementFunction = new NativeCallback(function() {
		console.log('HOOK被触发 -> 屏蔽账户服务器检查失败逻辑');
		// 这个函数什么也不做
	}, 'void', ['pointer']); // 这里的参数类型应该匹配原始函数的参数类型
	let originalFunction = new NativeFunction(offset_fin, 'void', ['pointer']); // 这里的参数类型应该匹配原始函数的参数类型
	Interceptor.replace(offset_fin, replacementFunction);
})();

(function(){
	let offset = 0x3AB60C0;
	let offset_fin = targetModule.add(offset);
	let name = "ChechAccServerStateFail";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	//替换函数
	let replacementFunction = new NativeCallback(function() {
		console.log('HOOK被触发 -> 屏蔽账户服务器检查失败逻辑');
		// 这个函数什么也不做
	}, 'void', ['pointer']); // 这里的参数类型应该匹配原始函数的参数类型
	let originalFunction = new NativeFunction(offset_fin, 'void', ['pointer']); // 这里的参数类型应该匹配原始函数的参数类型
	Interceptor.replace(offset_fin, replacementFunction);
})();

// ==================================================================================================================

(function(){
	let offset = 0x3AB81CC;
	let offset_fin = targetModule.add(offset);
	let name = "LoginError";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	
	let obj_point =0x1
	Interceptor.attach(offset_fin, {
		onEnter: function(args) {
			console.log("====== "+name+" HOOK被触发 =========");
			console.log("detail -> " + args[1] + "   --->>   "+get_str(args[1]));
			obj_point = new NativePointer(args[0])
			console.log("尝试追溯错误来源...")
			console.log('RegisterNatives called from:\n' +
				Thread.backtrace(this.context, Backtracer.FUZZY)
				.map(DebugSymbol.fromAddress).join('\n') + '\n');
		},
		onLeave: function(args) {
//			console.log("====== "+name+" 尝试回调登入成功逻辑 =========");
//			let originalFunction = new NativeFunction(targetModule.add(0x3AB9EC4), 'void', ['pointer']);
//			originalFunction(obj_point)
		}
	});
	
	
})();


(function(){
	let offset = 0x3AB9EC8;
	let offset_fin = targetModule.add(offset);
	let name = "loginFailed";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========");
		console.log("detail -> " + args[0] + "   --->>   "+get_str(args[0]));
		
		console.log("fin======================================");
		}
	});
})();


(function(){
	let offset = 0x3FB07AC;
	let offset_fin = targetModule.add(offset);
	let name = "GetCurrUser";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========");
		console.log("detail -> " + args[0] + "   --->>   "+get_str(args[0]));
		console.log("fin======================================");
		}
	});
})();



(function(){
	let offset = 0x141E728;
	let offset_fin = targetModule.add(offset);
	let name = "LoginProgress";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========");
		console.log("detail -> " + args[0] + "   --->>   "+get_str(args[0]));
		console.log("fin======================================");
		}
	});
})();


(function(){
	let offset = 0x3AB88E8;
	let offset_fin = targetModule.add(offset);
	let name = "DefaultUserLoginFail";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========");
		console.log("detail -> " + args[0] + "   --->>   "+get_str(args[0]));
		console.log("fin======================================");
		}
	});
})();


(function(){
	let offset = 0x3AB8198;
	let offset_fin = targetModule.add(offset);
	let name = "DefaultUserLoginError";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========");
		console.log("detail -> " + args[1] + "   --->>   "+args[1].readCString());
		console.log("fin======================================");
		}
	});
})();


(function(){
	let offset = 0x3EEFE98;
	let offset_fin = targetModule.add(offset);
	let name = "AccountTokenLogin";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========");
		console.log("detail -> " + args[0] + "   --->>   "+get_str(args[0]));
		console.log("fin======================================");
		}
	});
})();


(function(){
	let offset = 0x3EEF1C8;
	let offset_fin = targetModule.add(offset);
	let name = "AccountCheckCode";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========");
		console.log("detail -> " + args[0] + "   --->>   "+get_str(args[0]));
		console.log("fin======================================");
		}
	});
})();


(function(){
	let offset = 0x3EF0758;
	let offset_fin = targetModule.add(offset);
	let name = "AccountUpdatePass";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========");
		console.log("detail -> " + args[0] + "   --->>   "+get_str(args[0]));
		console.log("fin======================================");
		}
	});
})();


(function(){
	let offset = 0x3AB5288;
	let offset_fin = targetModule.add(offset);
	let name = "login Start";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========");
		console.log("detail -> " + args[0] + "   --->>   "+get_str(args[0]));
		console.log("fin======================================");
		}
	});
})();

(function(){
	let offset = 0x3AB7F20;
	let offset_fin = targetModule.add(offset);
	let name = "OnLoginMessage";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("====== "+name+" HOOK被触发 =========");
		console.log("detail -> " + args[0] + "   --->>   "+get_str(args[0]));
		console.log("fin======================================");
		}
	});
})();

(function(){
	let offset = 0x3F6C158;
	let offset_fin = targetModule.add(offset);
	let name = "LoginByPassword";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		console.log("account -> "+get_str(args[1]));
		console.log("pass -> " + get_str(args[2]));
		console.log("usertype -> " + get_str(args[3]));
		console.log("======================================\n\n");
		}
	});
})();



(function(){
	let offset = 0x3F6C2A0;
	let offset_fin = targetModule.add(offset);
	let name = "LoginByPassword--OnData";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");

		console.log("======================================\n\n");
		}
	});
})();

(function(){
	let offset = 0x3F6C19C;
	let offset_fin = targetModule.add(offset);
	let name = "LoginByPassword--AddArgumentsBeforeSend";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");

		console.log("======================================\n\n");
		}
	});
})();



(function(){
	let offset = 0x3EF00A8;
	let offset_fin = targetModule.add(offset);
	let name = "ParseRegistAndLoginJason";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");

		console.log("======================================\n\n");
		}
	});
})();


(function(){
	let offset = 0x3F17398;
	let offset_fin = targetModule.add(offset);
	let name = "ParseRoleZoneJson";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");

		console.log("======================================\n\n");
		}
	});
})();

function readStdString (str) {
  const isTiny = (str.readU8() & 1) === 0;
  if (isTiny) {
    return str.add(1).readUtf8String();
  }

  return str.add(2 * Process.pointerSize).readPointer().readUtf8String();
}

(function(){
	let offset = 0x3F70400;
	let offset_fin = targetModule.add(offset);
	let name = "NetMsgBase.OnData（四参数byte）";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		console.log("data -> " + args[1]);
		console.log("URL -> " + get_str(args[2]));
		console.log("type -> " + get_str(args[3]));
		console.log("tag -> "+ get_str(args[4]));
	
		console.log("======================================\n\n");
		}
	});
})();

(function(){
	let offset = 0x3F71CF8;
	let offset_fin = targetModule.add(offset);
	let name = "NetMsgBase.OnData（四参数string）";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		console.log("text -> " + get_str(args[1]));
		console.log("URL -> " + get_str(args[2]));
		console.log("type -> " + get_str(args[3]));
		console.log("tag -> "+get_str(args[4]));
		console.log("======================================\n\n");
		}
	});
})();


(function(){
	let offset = 0x3F71CFC;
	let offset_fin = targetModule.add(offset);
	let name = "NetMsgBase.OnData（一参数）";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		console.log("json -> " + get_str(args[1]));
		console.log("======================================\n\n");
		}
	});
})();



(function(){
	let offset = 0x3F6EEB4;
	let offset_fin = targetModule.add(offset);
	let name = "isAllNetMsgDebug.get";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		}
	});
})();



(function(){
	let offset = 0x36CB668;
	let offset_fin = targetModule.add(offset);
	let name = "FunctionLog.Invoke";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		}
	});
})();


(function(){
	let offset = 0x3F7E2E4;
	let offset_fin = targetModule.add(offset);
	let name = "CheckNormalMsg";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		},
	onLeave: function(retval) {
        console.log('Return value: ' + retval);
		}
	});
})();


(function(){
	let offset = 0x3F7DD48;
	let offset_fin = targetModule.add(offset);
	let name = "SendNormalMassage";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		}
	});
})();


(function(){
	let offset = 0x3F7DCA4;
	let offset_fin = targetModule.add(offset);
	let name = "SendNormalMessageWithoutDelegation";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		}
	});
})();




(function(){
	let offset = 0x3F7C5E0;
	let offset_fin = targetModule.add(offset);
	let name = "ProtocolManager.Login";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		}
	});
})();



(function(){
	let offset = 0x1569E68;
	let offset_fin = targetModule.add(offset);
	let name = "OnRequestFinished";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		}
	});
})();


(function(){
	let offset = 0x13B649C;
	let offset_fin = targetModule.add(offset);
	let name = "ManagerOfflineIO.isSave";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		},
	onLeave: function(retval) {
        console.log('Return value: ' + retval);
		}
	});
})();


(function(){
	let offset = 0x3F70364;
	let offset_fin = targetModule.add(offset);
	let name = "getDataAsText";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		},
	onLeave: function(retval) {
        console.log('Return value: ' + get_str(retval));
		}
	});
})();



//==========JSON处理相关！！！==========
(function(){
	let offset = 0x1963E1C;
	let offset_fin = targetModule.add(offset);
	let name = "JSON库 -> get_Item";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		console.log("参数 "+get_str(args[1]))
		},
	onLeave: function(retval) {
        console.log('Return value: ' + retval);
		}
	});
})();

(function(){
	let offset = 0x19644F4;
	let offset_fin = targetModule.add(offset);
	let name = "JSON库 -> 转字符串（LitJson_JsonData__op_Explicit_26625268）";
	console.log("HOOK "+name+" -> 函数偏移 -> "+offset + " - 最终偏移 -> " + offset_fin)
	Interceptor.attach(offset_fin, {
	onEnter: function(args) {
		console.log("\n\n====== "+name+" HOOK被触发 =========");
		},
	onLeave: function(retval) {
        console.log('Return value: ' + get_str(retval));
		}
	});
})();

//==========JSON处理相关！！！==========