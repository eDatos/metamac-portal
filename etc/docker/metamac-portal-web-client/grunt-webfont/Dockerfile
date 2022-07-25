FROM nlemahieu/grunt:latest

RUN sudo apt-get update && sudo apt-get -y install software-properties-common
RUN sudo apt-get install --reinstall ca-certificates
RUN sudo add-apt-repository ppa:fontforge/fontforge
RUN sudo apt-get update && sudo apt-get -y install fontforge