'''
原始接口地址:
http://shuiqinling-server-list.oss-cn-beijing.aliyuncs.com/cn_release_android.env

原始返回信息（2024年9月）：

<!-- ...................................................... !!!!! -->
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
'''
from flask import make_response
from subserver_asbd import app
from proj_utils import * 

@app.route("/getversion",methods=['GET'])
def getversion():
    log("获取版本信息")
    return "2.0.1.20043076"