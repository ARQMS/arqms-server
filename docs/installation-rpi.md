# Hardware Requirements for local hosting
- Raspberry PI 4
- SD Card at least 16GB


# Installation
1) Install Raspberry PI OS **Lite** (32bit)(https://www.youtube.com/watch?v=1s4sBoDej4g)
2) Install Git ```sudo apt install git```
3) Install curl ```sudo apt install curl```
4) Install Docker ```curl -fsSL https://get.docker.com -o get-docker.sh| sudo sh get-docker.sh```
5) Add current user to docker group ```sudo usermod -aG docker $USER``` and reboot system!
6) Let docker start at boot ```sudo systemctl enable --now docker```
7) Install docker compose ```sudo curl -L "https://github.com/docker/compose/releases/download/v2.2.3/docker-compose-linux-armv7" -o /usr/bin/docker-compose
sudo chmod +x /usr/bin/docker-compose``` **For 64-bit use docker-compose-linux-aarch64** and replace version with latest github version (https://github.com/docker/compose/releases) 

## Portainer.Io
Portainer io is a web application to administrate docker containers. To install portainer CE follow the stepos https://docs.portainer.io/v/ce-2.11/start/install/server/docker/linux
1) ```docker volume create portainer_data```
2) ```docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:2.11.0```
3) Navigate to your web explorer and navigate to https://<rpi-IP>:9443

## HiveMQ
1) run ```docker compose -p "Humi" up -d```
2) generate a certificate https://www.hivemq.com/blog/end-to-end-encryption-in-the-cloud/