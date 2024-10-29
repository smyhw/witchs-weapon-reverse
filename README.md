# witchs-weapon-reverse

> 樱姐，啥时候复活一下鸽游哇！

> [!TIP]
> 本项目致力于将已经关服的鸽游path为可以在本地离线运行的剧情播放器（大概）

*按照目前的速度，再咕个几年咱就能给逆进主界面了owo*

*唔，很可惜，在苟延残喘了这么久之后鸽游还是关服了qwq，*  
*虽然咱并不擅长逆向，在此之前也没碰过unity，但是还是想尝试救一下遗体*

---
咱不是逆向方面的专业人士，也没有太多时间投入这里，只能在这儿记录目前得到的所有成果qwq

> 期待哪天能有神秘观众直接送来协议定义或者现成的服务端qwq


> 也期待能有dalao来指点一二，这项工作对于咱来说还是太陌生了qwq

---

# 当前进度
- [x] 网络连接异常
- [x] 检测新版本失败
* 启动PV正常播放
- [x] 无法连接至服务器
* 显示登入页面
- [x] 连接中...
*  正常登入
- [x] 服务器列表
- [ ] 主服务器连接逻辑
- [ ] 进入主界面
- [ ] 进入剧情界面


# 总览
咱反应过来的时候已经是头七了，所以本项目在完全没有服务器响应参考的情况下进行，难度++  
目前咱的处理思路是:  
1. 通讯协议的分析和模拟，伪造和复现服务端
2. frida动态hook部分函数
3. ida补丁直接path部分逻辑


* 观测到部分逻辑（例如获取服务器时间部分）使用了`leancloud`，这似乎是一个`Serverless`服务商
* 观测到资源更新部分使用了`lebian`，这似乎是一个app资源升级管理解决方案提供商
* json解码方面几乎都使用了`LitJson`
* http请求方面，使用了`besthttp`


## 基本环境

* APK使用release中的版本，这是某群友贡献的，并不确定是否是最新版本，但是介于鸽游最后几年可能都没更新过...  
* 咱建议所有涉及偏移量等与逆向工程基于该特定版本展开，以保证一致性

## 静态分析
鸽游是unity游戏并使用il2cpp编译  
1. 解开apk后，  
* 在`assets\bin\Data\Managed\Metadata`路径找到`global-metadata.dat`，该文件记录各种字符串元数据，`libil2cpp.so`的函数偏移等信息。   
* 在`lib\arm64-v8a`目录下找到`libil2cpp.so`，该文件包含游戏实际执行逻辑。*鸽游似乎还有相当一部分逻辑以lua脚本的形式塞进了ab包里*    

使用[il2cpp](https://github.com/Perfare/Il2CppDumper) 项目可以从这两个文件逆向出`Assembly-CSharp.dll`和`dump.cs`。  
这两个文件只是可以方便地揭示`libil2cpp.so`的函数偏移量，函数名称等信息，所有对于执行逻辑的逆向和path仍需要针对`libil2cpp.so`进行。  

2. 解包的`Assembly-CSharp.dll`可以使用[dnSpy](https://github.com/dnSpy/dnSpy) 项目逆向，可以得到函数列表，参数列表，偏移量等信息，但是无法得到原始执行逻辑。  
3. 使用ida逆向原始的`libil2cpp.so`，根据`dnSpy`中得到的函数偏移量，可以定位并分析执行逻辑。  
同时，`il2cpp`的解包内容包含一个`ida_py3.py`，在ida中直接加载它，可以自动重命名所有已知的函数名称，参数名称，常量等信息。

**注:**
* 这里可以在`lib`目录下看到鸽游为`arm64-v8a`和`armeabi-v7a`分别编译，这里我们选择`arm64-v8a`进行处理，本文所有path过程均基于`arm64-v8a`
* 可以用ida对libil2cpp.so直接path，然后重新打包

## 动态调试
咱目前没有现成的root安卓设备，所以用模拟器运行游戏并进行调试。  
这里使用[frida](https://github.com/frida/frida) 进行动态调试，插桩，hook等操作
> [!TIP]
> 在模拟器中使用frida，如果内存里找不到`libil2cpp.so`的话，可能需要`--realm=emulated`参数
*agent最好还是扔在`/data/local/tmp`里，玄学问题((*

咱没有搞定使用ida进行动态调试qwq，因为没找到能在x86_64模拟器里跑的agent


## 重新打包
可以直接对`libil2cpp.so`进行path，例如在ida里直接修补，这时候需要将修改后的文件重新打包进apk  
> 直接扔进去显然不行，apk带文件完整性校验的，不通过不会安装
1. 使用(apktool)[https://github.com/iBotPeaches/Apktool] 对整个解包文件夹进行打包，例如`java -jar apktool.jar b test -o test.apk`  
2. 使用(uber-apk-signer)[https://github.com/patrickfav/uber-apk-signer] 对apk进行签名，例如`java -jar uber-apk-signer.jar --apks ./test.apk`  

此时再安装apk应该不会出现问题


# 已知结构/逻辑
网络协议方面，有一个包WaterBell.ProjX.Data.NetIO，  
所有请求类型都在这个包下面，并且全部继承NetMsgBase  
请求流程是先初始化某个指定请求类型的实例，然后调用AddArgumentsBeforeSend，  
该函数一般初始化并注册"成功，失败，异常"这三个回调，    
请求开始后，返回值先被`NetMsgBase.OnData`处理，这个函数有三个重载，区别在于接收返回值为byte,string和json格式，  
目前观测到接收byte的重载会尝试以文本解码返回值，若不出错，则直接调用接收string的重载并直接return  
若成功，则对于请求类型的OnData被调用；失败，则NetMsgBase的OnError被调用  



# 处理手册
> 这是咱的修补手册


## 第一步，网络连接异常

首先游戏报告**网络异常:网络连接异常:(建议wifi环境下重试)**  
wireshare抓包，得到结果：  
启动游戏后，发起的第一个有效请求是"http://shuiqinling-server-list.oss-cn-beijing.aliyuncs.com/cn_release_android.mapping"  
这个地址在关服后(2024年9月)仍然可以访问（估计到期或者流量刷完就无了），其返回内容如下：
<details>
<summary>点击查看返回内容</summary>
2024年9月
```
<config>
	<!-- 额外添加标签可以添加在此处 -->
	<!--
		<tags>
			<tag name="test" isLocalDefault="true">
				<account url="http://account-prod.witchs-weapon.com:8099"/>
				<notice url="http://ann-prod.witchs-weapon.com:8094"/>
				<talking url="https://witchs-weapon.net/news?ingame"/>
				<cdn url="http://47.74.27.196"/>
				<asbd url="http://47.74.27.196:9091"/>
			</tag>
		</tags>
	-->
	<tags>
		<tag name="test">
			<account url="http://account-prod.witchweapon.com:8099"/>
			<notice url="http://ann-prod1.witchweapon.com:8094"/>
			<talking url="http://notice.witchweapon.com"/>
			<cdn url="http://cdn-android-ghost.witchweapon.com"/>
			<asbd url="http://test2witch-ghost-1.witchweapon.com:9093"/>
		</tag>
	</tags>
	<mapping>
		<item name="test">
			<versions>

			</versions>
		</item>
		<item name="release">
			<versions>
				<version code="1.0.1" />
				<version code="1.0.2" />
				<version code="1.0.3" />
				<version code="1.0.4" />
				<version code="1.0.5" />
				<version code="1.0.6" />
				<version code="1.0.7" />
				<version code="1.0.8" />
				<version code="1.0.9" />
				<version code="1.1.0" />
				<version code="1.1.1" />
				<version code="1.1.2" />
				<version code="1.1.3" />
				<version code="1.1.4" />
				<version code="1.1.5" />
				<version code="1.1.50" />
				<version code="1.1.60" />
				<version code="1.1.61" />
				<version code="1.1.70" />
				<version code="1.1.71" />
				<version code="1.1.80" />
				<version code="1.1.90" />
				<version code="1.1.95" />
				<version code="1.2.01" />
				<version code="1.5.0" />
				<version code="1.6.0" />
				<version code="1.7.0" />
				<version code="1.7.1" />
				<version code="2.0.0" />
				<version code="2.0.1" />
			</versions>
		</item>
	</mapping>
</config>
```
**该返回值被重新格式化过，原始返回内容混用制表符和空格，格式及其糟糕，并且会导致github的markdown解析器混乱（（**
</details>
其次将访问"http://shuiqinling-server-list.oss-cn-beijing.aliyuncs.com/cn_release_android.env"
<details>
<summary>点击查看返回内容</summary>
```
<config>
	<tags>
		<tag name="release">
			<account url="http://account-prod.witchweapon.com:8099"/>
			<notice url="http://ann-prod1.witchweapon.com:8094"/>
			<talking url="http://notice.witchweapon.com"/>
			<cdn url="http://cdn-android-release.witchweapon.com"/>
			<asbd url="http://asbd-prod1.witchweapon.com:9091"/>
			<apk url="http://download.witchweapon.com"/>
		</tag>
	</tags>
</config>
```
</details>
由此可知鸽游可能有6个独立的服务端  

上述两个地址 **不知道是从哪儿取的** ，`global-metadata.dat`确实存在值为这些地址的项目，但是尝试更改之后发现依旧请求这两个地址，没变((  
目前解决方案是直接DNS劫持掉这两个地址到本地！

## 第二步，新版本获取失败
解决两个服务器列表请求后，游戏报**网络异常:新版本获取失败:新版本获取失败，请检查网络**  
继续分析wirshark流量，得出：  
这时将请求上文所述服务器中的"adbd"服务器的`/getversion`路径，使用GET方法。  
该路径目前尝试直接返回版本字符串即可，无需任何额外格式，只要比本地版本号小即可，例如本项目的模拟服务器则返回`2.0.1.20043076`  
这一步采取模拟服务器解决  
这一步正常请求后，游戏启动PV正常播放  

## 第三步，无法连接至服务器
继续分析，这里第一次发现了游戏请求了`/account/test/ok`这个路径，猜测这里请求连接的应该是账户服务器，但是后续居然没法再复现这个行为了...  
这里咱死活找不到请求，没辙了，尝试frida，  
hook了偏移量为`0x3AB6170`的`ChechAccServerStateError`方法和偏移量为`0x3AB60C0`的`ChechAccServerStateFail`方法，全部替换为空逻辑  
hook了偏移量为`0x3AB5D88`的`ChechAccServerState`方法并在`onLeave`的时候注入调用偏移量为`0x3AB62D0`的成功回调  
这样该服务器检测被绕过，登入页面成功显示  

## 第四步，模拟登入
登入按钮被按下时，上文所属`account`服务器会收到`/account/user/login`的POST请求，包含了登入凭证邮箱，登入类型，密码（加密过），时间，签名
```
ImmutableMultiDict([('useraccount', 'a@b.com'), ('usertype', '2'), ('password', '4673665d10967dc19abf3f3959225adb'), ('date', '20241026040211383'), ('sign', 'dc1a14facdbc6edba60b72d04ab27665')])
```

逆向到偏移量为`0x3F70400`的函数`OnData(byte[] data, string URL, string type, [Optional] string tag)`处理原始返回值，推断出返回值为json并拥有`Ecode`和`Value`两个字段  
再分析得`Ecode`需要为空，否则跳异常分支
继续分析`WaterBell.ProjX.Data.NetIO`包下的请求类`LoginByPassword`，从`OnData`中得到`Value`也应该是个json
再逆向到偏移量为`0x3EF00A8`的`ParseRegistAndLoginJason`函数*（咱没拼错，就是Jason）*，推断出这个载荷json的字段和类型
```
{
	"UID": 123123123,
	"Token": "abc",
	"LoginToken": "bcd",
	"Phone": 11111111111,
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
}
```
注意，并有分析出每个字段的函数，例如`OnlineStep`和`IDCardStatus`等字段的函数仍然未知，并且目前的值是咱猜的
`Phone`,`Email`等项目倒是不言自明的  
这里还可以看出出，`ZoneInfo`应该是服务器列表

### token登入
如果已经成功登入过，那么应该能注意到有一个本地账户缓存文件，下次启动游戏时会使用这个缓存文件尝试请求`account`服务器的`/account/user/tokenlogin`路径  
咱没有去逆这个逻辑，只是将账密登入的返回值复制了一份到这个路径，it works!


# 网络协议
这边尝试分析鸽游通讯协议，并编写伪造服务器
* 目前来看，鸽游全程http通讯，这是个好消息，不需要处理tls相关问题
* 目前来看，鸽游的主要通讯载荷是json，格式如下
```
{
  "Ecode": "",
  "Value": {
	...实际载荷json...
  }
}
```
`Ecode`字段由偏移量为`0x3F70400`的函数`OnData`处理，目前只分析到必须为空字符串，否则跳异常分支

**目前已知，鸽游可能有5个独立的服务端（以及一个阿里云oss）：**
* account 账户
* notice 公告服务器
* talking 聊天服务器？
* cdn 资源下载服务器
* asbd 这个不知道是啥
* apk 安装包下载

## 伪造服务器
offline-server目录存储这个伪造服务器项目
其中，6个subserver代表6个相对独立的服务器，分别占用6个端口
目前没有`requests.txt`，直接运行，少啥装啥
使用`python start.py`启动

### 配置
配置将在项目进行至能进进入游戏主界面后再进行开发*cfg.toml目前无效*，
如果需要现在就运行这个服务器的话：
在每个子服务器的__init__.py中配置各自的端口，并在`subserver_list_server`的`step1.py`和`step2.py`中更改ip和端口

# frida
这边负责动态hook运行时环境，绕过或修补部分逻辑  
frida目录下，目前仅有一个`frida.js`，直接使用frida加载即可*(frida -U 魔女兵器 -l frida.js --realm=emulated)*  
> 咱知道这个看着就很烂，但是之后有时间再优化，现在就说它能不能跑吧.jpg  

开头会直接查找`libil2cpp.so`，所以得等游戏启动后一段时间，`libil2cpp.so`被加载后再注入  
往下`getSysStr`和`get_str`用来读取/打印字符串，因为`libil2cpp.so`中大部分函数参数中的字符串都是`System_String_o`结构体  
有实际意义的函数hook会有注释，其余基本都是调试用的桩  
目前frida实际hook的只有屏蔽了账户服务器失败检查  


# 贡献指南

> [!NOTE] 
> 仓库没有许可证，这是有意为之，鸽游生前毕竟是个商业游戏，而且开发公司似乎也许大概也还没倒闭

## 二进制文件
项目会涉及大量二进制文件，但是注意：
* 不要往主分支扔任何二进制文件！
* data分支可以存放dll，部分关键图片等小二进制文件
* 不要往代码库里(即使是data分支)上传材质资源等大量二进制文件
大家也不想clone的时候\*\*吧（摊
