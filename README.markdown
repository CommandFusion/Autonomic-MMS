# CommandFusion Javascript Module for Autonomic MMS5 (Beta Version) 

This module is used for controlling Autonomic's Media Server (MMS) using CommandFusion's iViewer and Javascript via TCP protocol and IP Port 5004 and 23.

### Module file details
1. GUI file - MMS5.gui
1. Javascript file - MMS5.js
1. Doc folder - MMS5 IP Control protocol document and help/sample commands and response file by telnet to the device.
1. All joins range are between 4500-4600. Detailed join listings are documented in the JS file.
   
### System Setup that was used to develop this module:
1. Autonomic MMS5 Server
1. Autonomic's MMS softwares - Remote Media Sync(a media synchronization tool) and Mirage (control software) that both needs to be installed on the PC.  
1. GuiDesigner 2.3.5.5
1. iViewer 4 (v4.0.196) and iViewer TF (v4.0.201)

### Guidelines for module usage:
Enter the IP address/hostname of the MMS server in the System Manager properties and Global Token properties (Edit > Project Properties > Global Token Manager) and load the GUI file.

### Overview
This module provides design layout, data browsing, actions and transport control similar to the capabilities of the MMS5's Mirage control software with a few additional features. 

### Transport actions and Lists
![Album List](https://github.com/CommandFusion/Autonomic-MMS/raw/master/Docs/AlbumList.png)

1. Generally the module gives the user the ability to list, browse, select, add, delete and search for data for Albums, Artists, Genres, Playlists, Radio Sources and Queue (Now Playing) data.
   * Also the various information based on the selected choices such as Albums(cover art, title, artist, etc.), Artists (albums, cover art, titles, etc.) can be viewed.
   * View the realtime feedback and status of the Now Playing items including track time progress, title, artist, album, etc.
   * Add, save or delete playlist or tracks in the Queue list.
   * Delete all current queue list items.
   * Play all tracks by categories such as Album, Artist, Genre, Playlist, etc.
   
### Search and Filtering
![Search](https://github.com/CommandFusion/Autonomic-MMS/raw/master/Docs/Search.png)
Provides searching and filtering by word, string and the beginning letters of the words. This option is available for all data.

### Drop Menu, Settings and Advanced Settings
![Drop Menu](https://github.com/CommandFusion/Autonomic-MMS/raw/master/Docs/ZoneDropMenu.png)
1. There are 4 Drop Menus (but only 3 are used currently) - Settings, Actions and Zone.
   * Settings Menu lets you see, set and change the IP and System Settings together with System Power options.
   * Actions Menu lets you save the different categories to your favorites.
   * Zone Settings Menu gives you the option to change, control and update information from 5 zones.
1. System Power lets you Shutdown, Reboot or even Wake-On-Lan (WOL) the server.
1. Advanced Settings lets you change some of the more advanced features in the server setup (not recommended for normal user).
    
### Bug Reporting/Feature Requests
Please help to post any bug/issues that is encountered using this module at the [issues](https://github.com/CommandFusion/Autonomic-MMS/issues) tab of this GitHub repo. 
Any other inputs or suggestions are also welcomed.