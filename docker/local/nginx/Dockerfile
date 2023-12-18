##get the base Image here- nginx
FROM nginx:1.21.3-alpine

##removing the default.conf file and replacing it 
RUN rm /etc/nginx/conf.d/default.conf

##copy default.conf to the path directory
COPY ./default.conf /etc/nginx/conf.d/default.conf