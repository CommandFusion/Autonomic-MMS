/*	Autonomic MMS-5 module for CommandFusion (beta version)
	Firmware version 
===============================================================================

AUTHOR:		Terence, CommandFusion
CONTACT:	terence@commandfusion.com
URL:		https://github.com/CommandFusion/Autonomic-MMS
VERSION:	v0.01
LAST MOD:	5 March 2012
MODULE JOIN RANGE: 4500 - 4600
MODULE TEST SETUP: Autonomic MMS5 Server, GuiDesigner 2.3.5.2, Iviewer TF v.4.0.197
===============================================================================

Todo list:
- Save Queue as playlist (done - to finalise) 
- Clear Queue (done)
- Add Artist, track, Album to My Favorites (* Find out how to access my favorites - not accesible through Mirage control software?)
- System Settings startup configuration
- Search, search by alphabar
- Radio Source navigation (done - to finetune)
- Test Connection/Disconnection after long period of time

*/

	
//----------------------------------------------------------------------------------------------------------------
//Initialization of instance
//----------------------------------------------------------------------------------------------------------------
//var self = function(systemName, feedbackName) {};

//For standalone system
var self = {
	
	// ======================================================================
	// System Settings
	// ======================================================================
	
	sysName: "MMS5",					// System Name under System Properties in GuiDesigner
	//url: "192.168.168.202",			// URL for media server
	//port: "5004",						// port for media server
	//username: null,					// username or null for authentification
	//password: null,					// password or null for authentification
	
	// ======================================================================
	// Join Listings
	// ======================================================================
	
	// List join
	lstAlbum: 				"l4510",
	lstArtist: 				"l4520",
	lstGenre: 				"l4530",
	lstPlaylist: 			"l4540",
	lstRadioSource: 		"l4550",
	lstPickListItem:		"l4551",
	lstQueue: 				"l4560",
	
	// Digital join (subpage)
	subAlbum: 				"d4510",
	subAlbumTitle:			"d4511",
	subArtist:				"d4520",
	subArtistAlbum:			"d4521",
	subArtistAlbumTitle:	"d4522",
	subGenre: 				"d4530",
	subGenreAlbum:			"d4531",
	subGenreAlbumTitle:		"d4532",
	subPlaylist: 			"d4540",
	subPlaylistTitle:		"d4541",
	subRadioSource: 		"d4550",
	subRadioSourceStation:	"d4551",
	subQueue: 				"d4560",
	
	// Digital join (buttons)
	btnShuffle:				"d4570",
	btnRepeat:				"d4571",
	btnPlayPause:			"d4572",
	btnMute:				"d4573",
	btnWifiLED:				"d4580",
	btnSettings:			"d4581",
	btnAction:				"d4582",
	btnZone:				"d4583",
	
	// Analogue join
	sldVolumeControl:		"a4500",
	
	// Serial joins (text box)
	txtPlayStatus:			"s4500",
	txtTrackStatus:			"s4501",
	txtCoverArt:			"s4502",
	txtTrackTitle:			"s4503",
	txtAlbum:				"s4505",
	txtArtist:				"s4504",
	txtTrackTime:			"s4506",
	srchAlbum:				"s4510",
	srchArtist:				"s4511",
	srchGenre:				"s4512",
	srchPlaylist:			"s4513",
	srchRadioSource:		"s4514",
	srchQueue:				"s4515",
	txtPlaylist:			"s4516",
	sysIPAdd:				"s4520",
	sysHostname:			"s4521",
	txtConnection:			"s4580",
	txtInstance:			"s4581",
	txtVolumeLevel:			"s4582",
	
	// ======================================================================
	// Constants
	// ======================================================================
	
	setup: function() {
	
		CF.log("Autonomic MMS-5 System Setup Started.");		//log in debugging window

		// Check that the "MMS5" system is defined in the GUI. Otherwise no commands from JS will work!
		if (CF.systems[self.sysName] === undefined) {
			// Show alert
			CF.log("Your GUI file is missing the "+self.sysName+" system.\nPlease add it to your project before continuing.\n\nSee readme in comments at top of the script.");
			// Cancel further JS setup
			return;
		}

		// Watch all incoming data through a single feedback item : Syntax CF.watch(CF.event, systemName, feedbackName, feedbackFunction)
		CF.watch(CF.FeedbackMatchedEvent, self.sysName, "Incoming Data", self.incomingData); 				

		// Watch for connection changes. Syntax CF.watch(CF.event, systemName, systemFunction, boolean)
		CF.watch(CF.ConnectionStatusChangeEvent, self.sysName, self.onConnectionChange, true);			

		// Suspend and resume activities when Iviewer quits or put into background
		CF.watch(CF.GUISuspendedEvent, self.onGUISuspended);
		CF.watch(CF.GUIResumedEvent, self.onGUIResumed);
		
		// Get the system IP address and port for use in all cover art calls. Sample command: http://192.168.1.10:5005/albumart?album={33432-33432-95909-33423-34430}
		self.coverart = "http://"+CF.systems[self.sysName].address+":"+(CF.systems[self.sysName].port+1)+"/albumart?album="; // ?getalbumart
		
		// Set Current Instance.
		self.setCurrentInstance();
		
		// Get real time feedback of changed status of items.
		self.subcribeEventOn();
		
		// Get the starting status of all items.
		self.getStatus();
		
		// Show the list of Albums when starting up
		self.browseAlbums();		
		
		CF.log("Autonomic MMS-5 System Setup Completed.");
	},
	
	// ======================================================================
	//  Handle Connections/Disconnections
	// ======================================================================
	onConnectionChange: function (system, connected, remote) {
		if (connected) {
			// Connection established
			CF.log("Autonomic MMS-5 System is Connected!");
			CF.setJoin(self.txtConnection, "Server Connected");			//Send a string to display on Main Page that the System is connected
			CF.setJoin(self.btnWifiLED, 1);											//Show connected status
			
		} else {
			// Connection lost
			CF.log("Autonomic MMS-5 System is Disconnected!!");
			CF.setJoin(self.txtConnection, "Server Disconnected");		//Send a string to display on Main Page that the System is disconnected
			CF.setJoin(self.btnWifiLED, 0);											//Show disconnected status
		}
	},

	onGUISuspended: function() {
    // Even though the call is not executed immediately, it is enqueued for later processing:
    // the displayed date will be the one generated by the time the app was suspended
		self.subcribeEventOn();
	},

	onGUIResumed: function () {
    // Show the time at which the GUI was put back to front
    self.subcribeEventOn();
	},
	
	
	// =============================================================================================================================
	// Regex for all feedbacks coming through a single feedback item. For parsing various incoming data :
	// 
	//  /g enables "global" matching. When using the replace() method, specify this modifier to replace all matches, rather than only the first one.
    //	/i makes the regex match case insensitive.
    //	/m enables "multi-line mode". In this mode, the caret and dollar match before and after newlines in the subject string. 
	// =============================================================================================================================
	
	// Example: Album {a7f4dc3c-12d6-a29b-85eb-b0efebbc4e1e} "Elephunk (BLACK EYED PEAS)" 1 "" ""
	//	albumFullRegex:	/Album.\{(.*)\}.\"(.*?)\".(.*).\"(.*?)\".\"(.*?)\"/i,	
		albumRegex: /Album.\{(.*)\}.\"(.*?)\"/i,
	
	// Example: Artist {f1e2ec7c-9111-7804-448a-acffc6db70da} "DIANA ROSS" -1 "" ""	
	//	artistFullRegex: /Album.\{(.*)\}.\"(.*?)\".(.*).\"(.*?)\".\"(.*?)\"/i,
		artistRegex: /Artist.\{(.*)\}.\"(.*?)\"/i,
	
	// Example: Genre {d0b1f93f-19a3-506b-c263-423619057d3e} "Classical" -1 "" ""	
	//	genreFullRegex: /Genre.\{(.*)\}.\"(.*?)\".(.*).\"(.*?)\".\"(.*?)\"/i,
		genreRegex: /Genre.\{(.*)\}.\"(.*?)\"/i,
		
	// Example: Playlist {31784719-599f-a40b-548d-fbd9692a7fbf} "Playlist1" 14 1
	//	playlistFullRegex: /Genre.\{(.*)\}.\"(.*?)\".(.*).\"(.*?)\".\"(.*?)\"/i,
		playlistRegex: /Playlist.\{(.*)\}.\"(.*?)\"/i,	
	
	// Example: RadioSource {fbbcedb1-af64-4c3f-bfe5-000000000400} "Last.fm"
		radioSourceRegex : /RadioSource.\{(.*)\}.\"(.*)\"/i,
		pickListItemRegex:  /PickListItem.\{(.*)\}.\"(.*)\".(\d+)/i,
	
	// Example: Title {2a4786ff-56f1-3c47-142c-fa0939ec73d5} "Always Tomorrow" "00:04:52" 16 "GLORIA ESTEFAN" "Greatest Hits" -1 "" ""	
	//	queueFullRegex: /Title.\{(.*)\}.\"(.*)\".\"(.*?)\".(\d+).\"(.*?)\".\"(.*?)\".(.*\d).\"(.*)\".\"(.*)\"/i,
		queueRegex: /Title.\{(.*)\}.\"(.*)\".\"(.*?)\".(\d+).\"(.*?)\".\"(.*?)\".(.*\d).\"(.*)\".\"(.*)\"/i,
	
	// Example: Instance "Main", Instance "Player_A"
		instanceRegex: /Instance \"(.*)\"/i,
	
	// Example: ReportState Player_A NowPlayingGuid={16091522-760a-42c7-ec32-468556de19e9}		// Report of starting status of items
	// Example: StateChanged Player_A NowPlayingGuid={16091522-760a-42c7-ec32-468556de19e9}		// Report of changed status of items		
		//startStatusRegex: /ReportState\x20(.*)\x20(.*)=(.*)/i,
		stateThumbnailRegex: /NowPlayingGuid=(.*)/i,		// Thumbnail
		stateTrackNumberRegex: /MetaData1=(.*)/i,			// Track No. out of total tracks
		stateArtistRegex: /MetaData2=(.*)/i,				// Artist
		stateAlbumRegex: /MetaData3=(.*)/i,					// Album
		stateTrackRegex: /MetaData4=(.*)/i,					// Track
		stateTrackTimeRegex: /TrackTime=(.*)/i,				// Track Time
		stateShuffleRegex: /Shuffle=(.*)/i,					// Shuffle status (True/False)
		stateRepeatRegex: /Repeat=(.*)/i,					// Repeat status (True/False)
		stateQueueModeRegex: /QueueMode=(.*)/i,				// QueueMode
		stateVolumeRegex: /Volume=(\d+)/i,					// Volume level
		statePlayStatusRegex: /MediaControl=(.*)/i,			// Current Playing status (Play/Pause)
		stateMuteRegex: /Mute=(.*)/i,						// Mute status (True/False)
		stateMediaArtChanged: /MediaArtChanged=(.*)/i,		// State media art changed status (True/False).
	
	// =============================================================================================================================
	// Incoming Data Point - Only used to populate array with data. Populations of lists will be done by other functions.
	// =============================================================================================================================	
	
	incomingData: function (itemName, matchedString) {
	
		// Clear all arrays
		self.arrayAlbum = [];					// Album
		self.arrayArtist = [];					// Artist
		self.arrayGenre = [];					// Genre
		self.arrayPlaylist = [];				// Playlist
		self.arrayRadioSource = [];				// Radio Sources
		self.arrayQueue = [];					// Now Playing
		self.arrayPickListItem = [];			// PickListItem
		
		if (self.albumRegex.test(matchedString)) {							// Test if it is a Album message. This is for loading data into Album list.
				
				var matches = self.albumRegex.exec(matchedString);			
				self.arrayAlbum.push({
									s1: self.coverart+matches[1],		
									s2: matches[2],						
									s3: "Album",						
									d1: {
										tokens: {
											"[guid]": matches[1]
										}
									},
									d2: {
										tokens: {
											"[guid]": matches[1]
										}
									}
								});
				CF.listAdd(self.lstAlbum, self.arrayAlbum);			
				self.albumRegex.lastIndex = 0;
		
		} else if (self.artistRegex.test(matchedString)) {					// Test if it is a Artist message. This is for loading data into Artist list.
		
				var matches = self.artistRegex.exec(matchedString);
				self.arrayArtist.push({
									s1: self.coverart+matches[1],		
									s2: matches[2],						
									s3: "Artist",
									d1: {
										tokens: {
											"[guid]": matches[1]
										}
									},
									d2: {
										tokens: {
											"[guid]": matches[1]
										}
									}
								});
				CF.listAdd(self.lstArtist, self.arrayArtist);			
				self.artistRegex.lastIndex = 0;					

		} else if (self.genreRegex.test(matchedString)) {					// Test if it is a Genre message. This is for loading data into Genre list.

				var matches = self.genreRegex.exec(matchedString);
				self.arrayGenre.push({
									s1: self.coverart+matches[1],		
									s2: matches[2],						
									s3: "Genre",						
									d1: {
										tokens: {
											"[guid]": matches[1]
										}
									},
									d2: {
										tokens: {
											"[guid]": matches[1]
										}
									}
								});
				CF.listAdd(self.lstGenre, self.arrayGenre);
				self.genreRegex.lastIndex = 0;		
		
		} else if (self.playlistRegex.test(matchedString)) {					// Test if it is a Playlist message. This is for loading data into Playlist list.

				var matches = self.playlistRegex.exec(matchedString);
				self.arrayPlaylist.push({
									s1: self.coverart+matches[1],		
									s2: matches[2],						
									s3: "Playlist",						
									d1: {
										tokens: {
											"[guid]": matches[1]
										}
									},
									d2: {
										tokens: {
											"[guid]": matches[1]
										}
									},
									d3: {
										tokens: {
											"[title]": matches[2]
										}
									}
								});
				CF.listAdd(self.lstPlaylist, self.arrayPlaylist);
				self.playlistRegex.lastIndex = 0;
		
		} else if (self.radioSourceRegex.test(matchedString)) {					// Test if it is a Radio Source message. This is for loading data into Radio Source list.
			
				var matches = self.radioSourceRegex.exec(matchedString);
				self.arrayRadioSource.push({
									s1: self.coverart+matches[1],
									s2: matches[2],
									s3: "Radio Sources",
									d1: {
										tokens: {
											"[guid]": matches[1]
										}
									},
									d2: {
										tokens: {
											"[guid]": matches[1]
										}
									}
								});
				CF.listAdd(self.lstRadioSource, self.arrayRadioSource);
				self.radioSourceRegex.lastIndex = 0;						// Reset the regex to work correctly after each consecutive match
		
		} else if (self.pickListItemRegex.test(matchedString)) {					// Test if it is a Radio Source message. This is for loading data into Radio Source list.
			
				var matches = self.pickListItemRegex.exec(matchedString);
				self.arrayPickListItem.push({
									s1: self.coverart+matches[1],
									s2: matches[2],
									s3: "",
									d1: {
										tokens: {
											"[guid]": matches[1]
										}
									},
									d2: {
										tokens: {
											"[guid]": matches[1]
										}
									}
								});
				CF.listAdd(self.lstPickListItem, self.arrayPickListItem);
				self.pickListItemRegex.lastIndex = 0;						// Reset the regex to work correctly after each consecutive match
		
		} else if (self.queueRegex.test(matchedString)) {					// Test if it is a Queue message. This is for loading data into Queue list.	
		
				var matches = self.queueRegex.exec(matchedString);
				self.arrayQueue.push({
								s1: self.coverart+matches[1],						// fanart
								s2: "Track #" + matches[4] + " : "+ matches[2],		// track no. & title
								s3: matches[5],										// track time
								s4: matches[6],										// album										
								s5: matches[3],										// artist
								d1: {
										tokens: {
											"[guid]": matches[1]
										}
									},
									d2: {
										tokens: {
											"[guid]": matches[1]
										}
									}
							});
				CF.listAdd(self.lstQueue, self.arrayQueue);
				self.queueRegex.lastIndex = 0;								// Reset the regex to work correctly after each consecutive match
		
		} else if (self.instanceRegex.test(matchedString)) {				// Test if it is a Instance message. This is for defining which zone/instance the player is at currently.
		
				var matches = self.instanceRegex.exec(matchedString);
				switch (matches[1]) 
				{
					case "Main":
						CF.setJoin(self.txtInstance, "Main");
						break;
					case "Player_A":
						CF.setJoin(self.txtInstance, "Player A");
						break;
					case "Player_B":
						CF.setJoin(self.txtInstance, "Player B");
						break;
					case "Player_C":
						CF.setJoin(self.txtInstance, "Player C");
						break;
					case "Player_D":
						CF.setJoin(self.txtInstance, "Player D");
						break;	
				}
				
		} else if (self.stateThumbnailRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = self.stateThumbnailRegex.exec(matchedString);
				CF.setJoin(self.txtCoverArt, self.coverart+matches[1]);
		
		}else if (self.stateTrackNumberRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = self.stateTrackNumberRegex.exec(matchedString);
				CF.setJoin(self.txtTrackStatus, matches[1]);
		
		} else if (self.stateArtistRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = self.stateArtistRegex.exec(matchedString);
				CF.setJoin(self.txtArtist, matches[1]);
		
		} else if (self.stateAlbumRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = self.stateAlbumRegex.exec(matchedString);
				CF.setJoin(self.txtAlbum, matches[1]);
		
		} else if (self.stateTrackRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = self.stateTrackRegex.exec(matchedString);
				CF.setJoin(self.txtTrackTitle, matches[1]);
		
		} else if (self.stateTrackTimeRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = self.stateTrackTimeRegex.exec(matchedString);
				
				// convert the total time into minutes and seconds
				var minutes = Math.floor(matches[1]/60);
				var remain_seconds = matches[1] % 60;
				var seconds = Math.floor(remain_seconds);
				var clockTime = ("00"+minutes).slice(-2) + ":" + ("00"+seconds).slice(-2);
				CF.setJoin(self.txtTrackTime, clockTime);
		
		} else if (self.stateShuffleRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = self.stateShuffleRegex.exec(matchedString);
				switch(matches[1])
				{
					case "True":
						CF.setJoin(self.btnShuffle, 1);
						break;
					case "False":
						CF.setJoin(self.btnShuffle, 0);
						break;
				}
		
		} else if (self.stateRepeatRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = self.stateRepeatRegex.exec(matchedString);
				switch(matches[1])
				{
					case "True":
						CF.setJoin(self.btnRepeat, 1);
						break;
					case "False":
						CF.setJoin(self.btnRepeat, 0);
						break;
				}  
		
		} else if (self.statePlayStatusRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = self.statePlayStatusRegex.exec(matchedString);
				switch(matches[1])
				{
					case "Play":
						CF.setJoin(self.btnPlayPause, 0);
						CF.setJoin(self.txtPlayStatus, "PLAYING STATUS : Playing");
						break;
					case "Pause":
						CF.setJoin(self.btnPlayPause, 1);
						CF.setJoin(self.txtPlayStatus, "PLAYING STATUS : Paused");
						break;
					case "Stop":
						CF.setJoin(self.btnPlayPause, 0);
						CF.setJoin(self.txtPlayStatus, "PLAYING STATUS : Stopped");
						break;	
				}  
		} else if (self.stateMuteRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = self.stateMuteRegex.exec(matchedString);
				switch(matches[1])
				{
					case "True":
						CF.setJoin(self.btnMute, 1);
						break;
					case "False":
						CF.setJoin(self.btnMute, 0);
						break;
				}  
		} else if (self.stateVolumeRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = self.stateVolumeRegex.exec(matchedString);
				CF.setJoin(self.txtVolumeLevel, matches[1]);
				CF.setJoin(self.sldVolumeControl, Math.round((matches[1]/50)*65535));
		} 
		
	}, 
	
	clearList: function() {
		
		// clear all lists of all previous entries
		CF.listRemove(self.lstAlbum);				
		CF.listRemove(self.lstArtist);				
		CF.listRemove(self.lstGenre);				
		CF.listRemove(self.lstPlaylist);			
		CF.listRemove(self.lstRadioSource);		
		CF.listRemove(self.lstQueue);
		CF.listRemove(self.lstPickListItem);
	},
	
	// =============================================================================================================================
	// Most commands are reverse engineered from Crestron Module. *Note - however not all commands are tested working.
	// =============================================================================================================================
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Albums -> Title
	// -----------------------------------------------------------------------------------------------------------------------------
	browseAlbums: function() { 
		CF.listRemove(self.lstAlbum);													// clear list of any previous entries
		CF.setJoins([																		// show the correct subpage and hide the rest
				{join: self.subAlbum, value: 1},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
		self.clearMusicFilter();															// clear all previous music filters
		self.clearRadioFilter();															// clear all previous radio filters
		self.sendCmd("BrowseAlbums"); 														// send the command
	},
	
	selectAlbum_Title: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			CF.listRemove(self.lstQueue);				//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 1},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
			self.setMusicFilter_Album(t["[guid]"]);					//set the filter
			self.sendCmd("BrowseAlbumTitles");						// Get all the titles in the selected album
		});
	},
	
	//Delete all previous tracks and play the album. If want to just queue the album tracks to current queue, use playAlbumTrue instead.
	playAlbum: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			self.playAlbumFalse(t["[guid]"]);						
		});
	},
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Artists -> Albums -> Title
	// -----------------------------------------------------------------------------------------------------------------------------
	
	browseArtists: function() { 
		CF.listRemove(self.lstArtist);													// clear list of any previous entries
		CF.setJoins([																		// show the correct subpage and hide the rest
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 1},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
		self.clearMusicFilter();															// clear all previous music filters
		self.clearRadioFilter();															// clear all previous radio filters
		self.sendCmd("BrowseArtists"); 														// send the command
	},
	
	selectArtist_Album: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			CF.listRemove(self.lstAlbum);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 1},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
			self.setMusicFilter_Artist(t["[guid]"]);					//set the filter
			self.sendCmd("BrowseAlbums");						// Get all the titles in the selected album
		});
	},
	
	selectArtist_Album_Title: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			CF.listRemove(self.lstQueue);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 1},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
			self.setMusicFilter_Album(t["[guid]"]);					//set the filter
			self.sendCmd("BrowseAlbumTitles");						// Get all the titles in the selected album
		});
	},
	
	//Delete all previous tracks and play the all albums under Artist. If want to just queue the albums to current queue, use playArtistTrue instead.
	playArtist: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			self.playArtistFalse(t["[guid]"]);						
		});
	},
	
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Genres -> Albums -> Title
	// -----------------------------------------------------------------------------------------------------------------------------
	
	browseGenres: function() { 
		CF.listRemove(self.lstGenre);													// clear list of any previous entries
		CF.setJoins([																		// show the correct subpage and hide the rest
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 1},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
		self.clearMusicFilter();															// clear all previous music filters
		self.clearRadioFilter();															// clear all previous radio filters
		self.sendCmd("BrowseGenres"); 														// send the command
	},
	
	selectGenre_Album: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			CF.listRemove(self.lstAlbum);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 1},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
			self.setMusicFilter_Genre(t["[guid]"]);				//set the filter
			self.sendCmd("BrowseAlbums");						// Get all the titles in the selected album
		});
	},
	
	selectGenre_Album_Title: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			CF.listRemove(self.lstQueue);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 1},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
			self.setMusicFilter_Album(t["[guid]"]);				//set the filter
			self.sendCmd("BrowseAlbumTitles");						// Get all the titles in the selected album
		});
	},
	
	//Delete all previous tracks and play the all albums under Artist. If want to just queue the albums to current queue, use playArtistTrue instead.
	playGenre: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			self.playGenreFalse(t["[guid]"]);						
		});
	},
	
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Playlists -> Titles
	// -----------------------------------------------------------------------------------------------------------------------------
	
	browsePlaylists: function() { 
		CF.listRemove(self.lstPlaylist);													// clear list of any previous entries
		CF.setJoins([																		// show the correct subpage and hide the rest
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 1},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
		self.clearMusicFilter();															// clear all previous music filters
		self.clearRadioFilter();															// clear all previous radio filters
		self.sendCmd("BrowsePlaylists"); 														// send the command
	},
	
	selectPlaylist_Title: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			CF.listRemove(self.lstQueue);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 1},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
			self.setMusicFilter_Playlist(t["[guid]"]);				//set the filter
			self.sendCmd("BrowseTitles");									// Get all the titles in the selected album
		});
	},
	
	//Delete all previous tracks and play the all albums under Artist. If want to just queue the albums to current queue, use playArtistTrue instead.
	playPlaylist: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			self.playPlaylistFalse(t["[guid]"]);						
		});
	},
	
	deletePlaylistItem: function(list, listIndex, join) {											// Delete Playlist Item. 
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			self.deletePlaylist(t["[title]"]);						
		});
	},
	
	// *Special Note* : It'll take a while for the playlist changes to be updated, you won't be able to see the changes immediately.
	savePlaylist: function(title) {																	
		self.sendCmd("SavePlaylist " + title); 														// Save Playlist. *Command : SavePlaylist "Playlist1" 
		CF.setJoin(self.txtPlaylist, "");										// Reset the Playlist textbox to show back default text 
	},
	
	deletePlaylist: function(title) { self.sendCmd("DeletePlaylist " + title); },					// Delete Playlist. *Command : SavePlaylist "Playlist1"
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Radio Sources -> Radio Stations -> All multiple selections depending on the source
	// -----------------------------------------------------------------------------------------------------------------------------
	
	browseRadioSources: function() { 
		CF.listRemove(self.lstRadioSource);													// clear list of any previous entries
		CF.setJoins([																		// show the correct subpage and hide the rest
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 1},
				{join: self.subRadioSourceStation, value: 0},
				{join: self.subQueue, value: 0},
			]);
		self.clearMusicFilter();															// clear all previous music filters
		self.clearRadioFilter();															// clear all previous radio filters
		self.sendCmd("BrowseRadioSources"); 														// send the command
	},
	
	selectRadioSource: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			CF.listRemove(self.lstPickListItem);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},	
				{join: self.subRadioSourceStation, value: 1},
				{join: self.subQueue, value: 0},
			]);
			self.setRadioFilter_RadioSource(t["[guid]"]);				//set the filter
			self.sendCmd("BrowseRadioStations");
		});
	},
	
	selectRadioStation: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			CF.listRemove(self.lstPickListItem);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},	
				{join: self.subRadioSourceStation, value: 1},
				{join: self.subQueue, value: 0},
			]);
			self.ackpickListItem(t["[guid]"]);				//set the filter
		});
	},
	
	ackpickListItem: 			function(guid) { self.sendCmd("AckPickItem " + guid); },				// Ack Pick Item 
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Queue - Shows all Now Playing Titles
	// -----------------------------------------------------------------------------------------------------------------------------
	
	browseQueue: function() { 
		CF.listRemove(self.lstQueue);													// clear list of any previous entries
		CF.setJoins([																		// show the correct subpage and hide the rest
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 1},
			]);
		self.clearMusicFilter();															// clear all previous music filters
		self.clearRadioFilter();															// clear all previous radio filters
		self.sendCmd("BrowseNowPlaying"); 														// send the command
	},
	
	playCurrentTitle: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			self.playTitleFalse(t["[guid]"]);				// Play the current title
		});
	},
	
	queueCurrentTitle: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			self.playTitleTrue(t["[guid]"]);				// Play the current title
		});
	},

	playCurrentItem: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			self.playNowPlayingItem(t["[guid]"]);				// Play the current item
		});
	},
	
	removeCurrentItem: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			self.removeNowPlayingItem(t["[guid]"]);				// Remove the current item
			self.browseQueue();									// Refresh the list
		});
	},
	
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Toggling between subpages
	// -----------------------------------------------------------------------------------------------------------------------------
		
	backAlbumList: function() {
		CF.setJoins([
				{join: self.subAlbum, value: 1},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
		self.clearMusicFilter();															// clear all previous music filters
		self.clearRadioFilter();															// clear all previous radio filters
	},
	
	backArtistList: function() {
		CF.setJoins([
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 1},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
		self.clearMusicFilter();															// clear all previous music filters
		self.clearRadioFilter();															// clear all previous radio filters
	},
	
	backArtistAlbumList: function() {
		CF.setJoins([
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 1},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
	},
	
	backGenreList: function() {
		CF.setJoins([
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 1},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
		self.clearMusicFilter();															// clear all previous music filters
		self.clearRadioFilter();															// clear all previous radio filters
	},
	
	backGenreAlbumList: function() {
		CF.setJoins([
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 1},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
	},
	
	backPlaylistList: function() {
		CF.setJoins([
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 1},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 0},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
		self.clearMusicFilter();															// clear all previous music filters
		self.clearRadioFilter();															// clear all previous radio filters
	},
	
	backRadioSourceList: function() {
		CF.setJoins([
				{join: self.subAlbum, value: 0},
				{join: self.subAlbumTitle, value: 0},				
				{join: self.subArtist, value: 0},			
				{join: self.subArtistAlbum, value: 0},			
				{join: self.subArtistAlbumTitle, value: 0},
				{join: self.subGenre, value: 0},			
				{join: self.subGenreAlbum, value: 0},
				{join: self.subGenreAlbumTitle, value: 0},	
				{join: self.subPlaylist, value: 0},		
				{join: self.subPlaylistTitle, value: 0},		
				{join: self.subRadioSource, value: 1},
				{join: self.subRadioSourceStation, value: 0},				
				{join: self.subQueue, value: 0},
			]);
		self.clearMusicFilter();															// clear all previous music filters
		self.clearRadioFilter();															// clear all previous radio filters
	},
	
	backRadioSourceStations: function() {
		CF.listRemove(self.lstPickListItem);
		self.Back();																		// Go back browsing history
	},
	
	forwardRadioSourceStations: function() {
		CF.listRemove(self.lstPickListItem);
		self.Forward();																		// Move forward browsing history
	},
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Other actions
	// -----------------------------------------------------------------------------------------------------------------------------
	
	// Play All commands
	playAlbumTrue: 			function(guid) { self.sendCmd("PlayAlbum " + guid + " True"); },		// Play selected Album. Will be added to the queue without interrupting playback.
	playAlbumFalse: 		function(guid) { self.sendCmd("PlayAlbum " + guid + " False"); },		// Play selected Album. The queue will be cleared before the tracks are added.
	playArtistTrue: 		function(guid) { self.sendCmd("PlayArtist " + guid + " True"); },		// Play selected Artist. Will be added to the queue without interrupting playback.
	playArtistFalse: 		function(guid) { self.sendCmd("PlayArtist " + guid + " False"); },		// Play selected Artist. The queue will be cleared before the tracks are added.
	playGenreTrue: 			function(guid) { self.sendCmd("PlayGenre " + guid + " True"); },		// Play selected Genre. Will be added to the queue without interrupting playback.
	playGenreFalse: 		function(guid) { self.sendCmd("PlayGenre " + guid + " False"); },		// Play selected Genre. The queue will be cleared before the tracks are added.
	playPlaylistTrue: 		function(guid) { self.sendCmd("PlayPlaylist " + guid + " True"); },		// Play selected Playlist. Will be added to the queue without interrupting playback.
	playPlaylistFalse: 		function(guid) { self.sendCmd("PlayPlaylist " + guid + " False"); },	// Play selected Playlist. The queue will be cleared before the tracks are added.
	playTitleTrue: 			function(guid) { self.sendCmd("PlayTitle " + guid + " True"); },		// Play selected Title. Will be added to the queue without interrupting playback.
	playTitleFalse: 		function(guid) { self.sendCmd("PlayTitle " + guid + " False"); },		// Play selected Title. The queue will be cleared before the tracks are added.
	playRadioStation: 		function(guid) { self.sendCmd("PlayRadioStation " + guid); },			// Play selected Radio Station. Will always clear the now playing queue.
	playNowPlayingItem: 	function(guid) { self.sendCmd("JumpToNowPlayingItem " + guid); },		// Jump to the selected Item and begin playback.
	removeNowPlayingItem: 	function(guid) { self.sendCmd("RemoveNowPlayingItem " + guid); },		// Remove the selected Item.
	
	// Browse library commands
	browseMusic: 			function() { self.sendCmd("Browse Music"); },				// Browse Music
	browseRecordedTV: 		function() { self.sendCmd("Browse RecordedTV"); },			// Browse Recorded TV
	browseMovies: 			function() { self.sendCmd("Browse Movies"); },				// Browse Movies
	browseVideos: 			function() { self.sendCmd("Browse Videos"); },				// Browse Videos
	browsePictures: 		function() { self.sendCmd("Browse Pictures"); },			// Browse Pictures
	browseInstances: 		function() { self.sendCmd("BrowseInstances"); },			// Browse Instances
	browseFavorites: 		function() { self.sendCmd("BrowseFavorites"); },			// Browse Favorites
	browseRadioStations: 	function() { self.sendCmd("BrowseRadioStations"); },		// Browse Radio Stations
	
	// Basic transport commands
	PlayPause: 				function() { self.sendCmd("PlayPause"); },					// Play/Pause
	Play: 					function() { self.sendCmd("Play"); },						// Play
	Pause: 					function() { self.sendCmd("Pause"); },						// Pause
	Stop: 					function() { self.sendCmd("Stop"); },						// Stop
	SkipNext: 				function() { self.sendCmd("SkipNext"); },					// Skip Next
	SkipPrevious: 			function() { self.sendCmd("SkipPrevious"); },				// Skip Previous
	ShuffleOn: 				function() { self.sendCmd("Shuffle True"); },				// Shuffle On
	ShuffleOff: 			function() { self.sendCmd("Shuffle False"); },				// Shuffle Off
	ShuffleToggle: 			function() { self.sendCmd("Shuffle Toggle"); },				// Shuffle Toggle
	RepeatOn: 				function() { self.sendCmd("Repeat True"); },				// Repeat On
	RepeatOff: 				function() { self.sendCmd("Repeat False"); },				// Repeat Off
	RepeatToggle: 			function() { self.sendCmd("Repeat Toggle"); },				// Repeat Toggle
	MuteOn: 				function() { self.sendCmd("Mute True"); },					// Mute On
	MuteOff: 				function() { self.sendCmd("Mute False"); },					// Mute Off
	MuteToggle: 			function() { self.sendCmd("Mute Toggle"); },				// Mute Toggle
	VolumeUp: 				function() { self.sendCmd("VolumeUp"); },					// Volume Up. Volume range 0 - 50.
	VolumeDown: 			function() { self.sendCmd("VolumeDown"); },					// Volume Down. Volume range 0 - 50.
	SetVolume: 				function(level) { self.sendCmd("SetVolume " + level); },					// Volume Down. Volume range 0 - 50.
	
	// Other remote commands
	ChannelUp: 				function() { self.sendCmd("SendRemote ch+"); },				// Channel Up
	ChannelDown: 			function() { self.sendCmd("SendRemote ch-"); },				// Channel Down
	Rewind: 				function() { self.sendCmd("SendRemote Rewind"); },			// Rewind
	FastForward: 			function() { self.sendCmd("SendRemote FastForward"); },		// Fast Forward
	Record: 				function() { self.sendCmd("SendRemote Record"); },			// Record
	Information: 			function() { self.sendCmd("SendRemote MoreInfo"); },		// Information
	Guide: 					function() { self.sendCmd("Navigate TVGuide"); },			// Guide 
	Back_IR: 				function() { self.sendCmd("SendRemote Back"); },			// Back (IR Remote)
	DVDMenu: 				function() { self.sendCmd("SendRemote DVDMenu"); },			// DVDMenu
	GreenButton: 			function() { self.sendCmd("Navigate Start"); },				// Green Button
	Up: 					function() { self.sendCmd("SendRemote up"); },				// Up
	Down: 					function() { self.sendCmd("SendRemote down"); },			// Down
	Left: 					function() { self.sendCmd("SendRemote left"); },			// Left
	Right: 					function() { self.sendCmd("SendRemote right"); },			// Right
	Select: 				function() { self.sendCmd("SendRemote ok"); },				// Select OK
	NumPad1: 				function() { self.sendCmd("SendRemote 1"); },				// NumPad1
	NumPad2: 				function() { self.sendCmd("SendRemote 2"); },				// NumPad2
	NumPad3: 				function() { self.sendCmd("SendRemote 3"); },				// NumPad3
	NumPad4: 				function() { self.sendCmd("SendRemote 4"); },				// NumPad4
	NumPad5: 				function() { self.sendCmd("SendRemote 5"); },				// NumPad5
	NumPad6: 				function() { self.sendCmd("SendRemote 6"); },				// NumPad6
	NumPad7: 				function() { self.sendCmd("SendRemote 7"); },				// NumPad7
	NumPad8: 				function() { self.sendCmd("SendRemote 8"); },				// NumPad8
	NumPad9: 				function() { self.sendCmd("SendRemote 9"); },				// NumPad9
	NumPad0: 				function() { self.sendCmd("SendRemote 0"); },				// NumPad0
	NumPadEnter: 			function() { self.sendCmd("SendRemote enter"); },			// NumPadEnter
	NumPadClear: 			function() { self.sendCmd("SendRemote clear"); },			// NumPadClear
	Slideshow: 				function() { self.sendCmd("Navigate Slideshow"); },			// Slideshow
	LiveTV: 				function() { self.sendCmd("Navigate LiveTV"); },			// Live TV
	
	// SetMusicFilter commands
	setMusicFilter_Album:		function(guid) { self.sendCmd("SetMusicFilter Album=" + guid); },			// Set Album filter 
	setMusicFilter_Artist:		function(guid) { self.sendCmd("SetMusicFilter Artist=" + guid); },			// Set Artist filter
	setMusicFilter_Genre:		function(guid) { self.sendCmd("SetMusicFilter Genre=" + guid); },			// Set Genre filter
	setMusicFilter_Playlist:	function(guid) { self.sendCmd("SetMusicFilter Playlist=" + guid); },		// Set Playlist filter
	setMusicFilter_RadioSource:	function(guid) { self.sendCmd("SetMusicFilter RadioSource=" + guid); },	// Set Radio Sources filter
	setMusicFilter_Queue:		function(guid) { self.sendCmd("SetMusicFilter NowPlaying=" + guid); },		// Set Now Playing filter
	setMusicFilter_Search:		function(guid) { self.sendCmd("SetMusicFilter Search=" + guid); },			// Search 
	clearMusicFilter:			function() { self.sendCmd("SetMusicFilter Clear"); },						// Clear all Music filters
	
	// SetMusicFilter commands
	setRadioFilter_Album:		function(guid) { self.sendCmd("SetRadioFilter Album=" + guid); },			// Set Album filter 
	setRadioFilter_Artist:		function(guid) { self.sendCmd("SetRadioFilter Artist=" + guid); },			// Set Artist filter
	setRadioFilter_Genre:		function(guid) { self.sendCmd("SetRadioFilter Genre=" + guid); },			// Set Genre filter
	setRadioFilter_Playlist:	function(guid) { self.sendCmd("SetRadioFilter Playlist=" + guid); },		// Set Playlist filter
	setRadioFilter_RadioSource:	function(guid) { self.sendCmd("SetRadioFilter RadioSource=" + guid); },	// Set Radio Sources filter
	setRadioFilter_Queue:		function(guid) { self.sendCmd("SetRadioFilter NowPlaying=" + guid); },		// Set Now Playing filter
	setRadioFilter_Search:		function(guid) { self.sendCmd("SetRadioFilter Search=" + guid); },			// Search 
	clearRadioFilter:			function() { self.sendCmd("SetRadioFilter Clear"); },						// Clear all Radio filters
	
	// SetMediaFilter commands
	setMediaFilter_Album:		function(guid) { self.sendCmd("SetMediaFilter Album=" + guid); },			// Set Album filter 
	setMediaFilter_Artist:		function(guid) { self.sendCmd("SetMediaFilter Artist=" + guid); },			// Set Artist filter
	setMediaFilter_Genre:		function(guid) { self.sendCmd("SetMediaFilter Genre=" + guid); },			// Set Genre filter
	setMediaFilter_Playlist:	function(guid) { self.sendCmd("SetMediaFilter Playlist=" + guid); },		// Set Playlist filter
	setMediaFilter_RadioSource:	function(guid) { self.sendCmd("SetMediaFilter RadioSource=" + guid); },		// Set Radio Sources filter
	setMediaFilter_Queue:		function(guid) { self.sendCmd("SetMediaFilter NowPlaying=" + guid); },		// Set Now Playing filter
	setMediaFilter_Search:		function(guid) { self.sendCmd("SetMediaFilter Search=" + guid); },			// Search 
	clearMediaFilter:			function() { self.sendCmd("SetMediaFilter Clear"); },						// Clear all Media filters
	
	// ======================================================================
    // Other commands
    // ======================================================================

	getStatus: 					function() { self.sendCmd("GetStatus"); },								// Get a report of all status on startup.
	setCurrentInstance: 		function() { self.sendCmd("SetInstance *");	},							// Select current instance.
	subcribeEventOn: 			function() { self.sendCmd("SubscribeEvents True"); },					// Turns ON feedback of StateChanged events for CURRENT instance only.
	subcribeEventOff: 			function() { self.sendCmd("SubscribeEvents False"); },					// Turns OFF feedback of StateChanged events for CURRENT instance only.
	subcribeAllEventOn: 		function() { self.sendCmd("SubscribeEventsAll True"); },				// Turns ON feedback of StateChanged events for ALL instances.
	subcribeAllEventOff: 		function() { self.sendCmd("SubscribeEventsAll False"); },				// Turns OFF feedback of StateChanged events for ALL instances.
	clearQueue:					function() { self.sendCmd("ClearNowPlaying"); },						// Stop all playing tracks and clear all now playing list.
	Back:						function() { self.sendCmd("Back"); },									// Back
	Forward:					function() { self.sendCmd("Forward"); },								// Forward
	
	// Select the zone instance and update the now playing info.
	selectZone:	function(zone) { 
		self.sendCmd("SetInstance "+zone);
		self.getStatus();									
	},		
	
	// Format the command string to send to system
	sendCmd: function(command) { CF.send(self.sysName, command+"\x0D\x0A"); }										//CF.send(systemName, string [, outputFormat])	

};

CF.modules.push(
	{
		name:"Autonomic MMS5", 		// the name of the module (mostly for display purposes)
		setup:self.setup,			// the setup function to call
		object: self,       		// the object to which the setup function belongs
		version: 1.0                // An optional module version number that is displayed in the Remote Debugger
	}
);


