---
layout: post
title: Moving MicroK8s - How to migrate a snap app to an external drive
toc: true
---
### Summary
Quick stash of notes, that could have been a gist :p

### 1. Format the disk
```
sudo mkfs -t ext4 /dev/sda1
sudo mkdir /mnt/usbstorage
```
### 2. Configure fstab
```
echo '/dev/by/uuid/<uuid> /mnt/usbstorage ext4 defaults 0 0' >> /etc/fstab
sudo mount -a
```
### 3. Stop services
```
sudo systemctl mask snapd.service
sudo systemctl stop snapd.service
sudo systemctl disable snapd.service
```
### 4. Copy files
```
sudo rsync -avzP /var/lib/snapd/ /mnt/usbstorage/snapd/
```
### 5. Move old files
```
sudo mv /var/lib/snapd /var/lib/snapd.bak
sudo mkdir /var/lib/snapd
```
### 6. Configure fstab
```
echo "/mnt/usbstorage/snapd /var/lib/snapd none bind 0 0" >> /etc/fstab
sudo mount -a
```
### 7. Restart services
```
sudo systemctl unmask snapd.service
sudo systemctl start snapd.service
sudo systemctl reenable snapd.service
```
### 8. Profit
Big note: Kubernetes explicitly says, "It's bad to use usb storage"... but when life gives you lemons, demand that life take those lemons back. Nobody gives Cave Johnson lemons!