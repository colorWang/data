#部署 nginx 配置反向代理 中转cooke和接口
http{
    server {
        listen       9090; 
	    
        #websocket代理使用
        map $http_upgrade $connection_upgrade {default upgrade; '' close;}

        #将系统应用文件放入html 根目录下
        location / {
            root   html;
            index  index.html index.htm;	
            try_files $uri $uri/ /index.html;			
        }
	    
        #代理中间业务个接口(中间业务虚拟路径为/itms)
		location /itms/ {
		   proxy_pass http://193.169.100.222:8087;		    
		   
		   #cookie 路径映射
		   proxy_cookie_path /itms /;
		   
           #websocket代理配置
		   proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_read_timeout 2120000s;
		   
		   #proxy_http_version 1.1;
           #proxy_set_header Upgrade $http_upgrade; 
           #proxy_set_header Connection $connection_upgrade;
           #proxy_set_header Origin "";		   
		}			
    }
} 
