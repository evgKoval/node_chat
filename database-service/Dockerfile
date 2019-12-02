FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD secret  
ENV MYSQL_DATABASE nodeapp
ENV MYSQL_USER homestead  
ENV MYSQL_PASSWORD secret

ADD setup.sql /docker-entrypoint-initdb.d
