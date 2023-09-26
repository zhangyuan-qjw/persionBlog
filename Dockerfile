# 使用官方Nginx镜像作为基础镜像
FROM nginx:latest

# 复制本地Nginx配置文件到容器内
COPY ./my-nginx.conf /etc/nginx/conf.d/

# 暴露Nginx的默认HTTP端口（通常是80）
EXPOSE 80

# 启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]
