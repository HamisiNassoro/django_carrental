##since we are in dev we use python version 10
##use FROM directory and select a base Image
FROM python:3.10.0-slim-buster

##setting up home directory
ENV APP_HOME=/app

##creating home directory
RUN mkdir $APP_HOME

##creating another directory called staticfiles
RUN mkdir $APP_HOME/staticfiles

##setting the home directory to be the working directory
WORKDIR $APP_HOME

##use label instruction to set meta data for the image(not important but is useful)
LABEL maintainer='hamsonassor14@gmail.com'
LABEL github="https://github.com/HamisiNassoro"
LABEL decription="Development image for Car Rental Project"

##setting up environment variables
##this prevents python from writing .pyc files to disk
ENV PYTHONDONTWRITEBYTECODE 1

##the python output is transmitted directly to the terminal without being buffered...
#... allows display of applications output in real time
ENV PYTHONUNBUFFERED 1

##installing dependensies
RUN apt-get update \
  && apt-get install -y build-essential \
  && apt-get install -y libpq-dev \
  && apt-get install -y gettext \
  && apt-get -y install netcat gcc postgresql \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

##upgrading version of pip
RUN pip3 install --upgrade pip

RUN apt-get update && apt-get install -y gdal-bin python3-gdal

##installing requirements and ensuring that they are cached...
##...copying requirements.txt to the working directory
COPY ./requirements.txt /app/requirements.txt 

##installing the requirements
RUN pip3 install -r requirements.txt

##run the entrypoint shell script...
##...copy entrypoint file from its directory path
COPY ./docker/local/django/entrypoint /entrypoint

##process the line endings of the shell scripts...
##...converting any windows line endings to unix line endings
RUN sed -i 's/\r$//g' /entrypoint

##make the entrypoint shell script executable
RUN chmod +x /entrypoint

##starting the shell script...
##...copying start script from directory path 
COPY ./docker/local/django/start /start

##command for line endings on start script...converting any windows line endings to unix line endings
RUN sed -i 's/\r$//g' /start

##make the start shell script executable
RUN chmod +x /start

##directory for entrypoint
ENTRYPOINT [ "/entrypoint"]

