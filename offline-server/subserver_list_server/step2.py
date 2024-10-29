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
from subserver_list_server import app
from proj_utils import * 

@app.route("/cn_release_android.env",methods=['GET'])
def just_step_2():
    log("获取环境信息")
    content = '''
<!-- ...................................................... !!!!! -->
<config>
	<tags>
		<tag name="release">
			<account url="http://192.168.213.170:81"/>
			<notice url="http://192.168.213.170:84"/>
			<talking url="http://192.168.213.170:85"/>
			<cdn url="http://192.168.213.170:83"/>
			<asbd url="http://192.168.213.170:82"/>
			<apk url="https://github.com/smyhw"/>
		</tag>
	</tags>
</config>
'''
    response = make_response(content)

    # 设置响应头，指定文件名为 example.txt
    response.headers["Content-Disposition"] = "attachment;"
    response.headers["Content-Type"] = "application/octet-stream"
    return response