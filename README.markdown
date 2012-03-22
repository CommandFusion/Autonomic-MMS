# CommandFusion Javascript Module for Autonomic MMS5 (Beta Version) 

This module is used for controlling Autonomic's Media Server (MMS) using CommandFusion's iViewer and Javascript via TCP protocol and IP Port 4005.

### Module file details
1. GUI file - MMS5.gui
1. Javascript file - MMS5.js
1. Doc folder - MMS5 IP Control protocol document and help/sample commands and response file by telnet to the device.
1. All joins range are between 4500-4600. Detailed join listings are documented in the JS file.
   
### System Setup that was used to develop this module:
1. Autonomic MMS5 Server
1. Autonomic's MMS softwares - Remote Media Sync(a media synchronization tool) and Mirage (control software) that both needs to be installed on the PC.  
1. GuiDesigner 2.3.5.2
1. iViewer 4 (v4.0.196) and iViewer TF (v4.0.197)

### Guidelines for module usage:
Enter the IP address of the MMS server in the System Manager properties and load the GUI file.

### Overview
1. This module provides desing layout, data browsing, actions and transport control similar to the capabilities of the MMS5's Mirage control software. 
1. Generally the module gives the user the ability to list, browse, select, add, delete and search for data for the following items:
   * Albums, Artists, Genres, Playlists, Radio Sources and Queue (Now Playing)
   * View the various information based on the selected choices such as Albums(cover art, title, artist, etc.), Artists (albums, cover art, titles, etc.) and many more.
   * View the realtime feedback and status of the Now Playing items.
   * Control and view information of up to 5 different instances (zones)
   * Add and saves new playlists or delete selected playlists, tracks, etc.
   * Control different MMS servers


### Bug Reporting/Feature Requests
Please help to post any bug/issues that is encountered using this module at the [issues](https://github.com/CommandFusion/Autonomic-MMS/issues) tab of this GitHub repo. 
Any other inputs or suggestions are also welcomed.