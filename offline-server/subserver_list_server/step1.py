'''
原始接口地址:
http://shuiqinling-server-list.oss-cn-beijing.aliyuncs.com/cn_release_android.mapping

原始返回信息（2024年9月）：

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
'''
from flask import make_response
from subserver_list_server import app
from proj_utils import * 

@app.route("/cn_release_android.mapping",methods=['GET'])
def just_step_1():
    log("获取环境信息2")
    content = '''
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
			<account url="http://192.168.213.170:81"/>
			<notice url="http://192.168.213.170:84"/>
			<talking url="http://192.168.213.170:85"/>
			<cdn url="http://192.168.213.170:83"/>
			<asbd url="http://192.168.213.170:82"/>
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
'''
    response = make_response(content)

    # 设置响应头，指定文件名为 example.txt
    response.headers["Content-Disposition"] = "attachment;"
    response.headers["Content-Type"] = "application/octet-stream"
    return response