/*	Autonomic MMS-5 module for CommandFusion (beta version)
	Firmware version 
===============================================================================

AUTHOR:		Terence, CommandFusion
CONTACT:	terence@commandfusion.com
URL:		https://github.com/CommandFusion/Autonomic-MMS
VERSION:	v0.01
LAST MOD:	5 March 2012
MODULE JOIN RANGE: 4500 - 4605
MODULE TEST SETUP: Autonomic MMS5 Server, GuiDesigner 2.3.5.5, Iviewer TF v.4.0.201
===============================================================================

Todo list:
- Add Artist, track, Album to My Favorites (* Find out how to access my favorites - not accesible through Mirage control software?)

Check :
- Searching options
- Creating radio stations for Pandora

Special Note:
- Have control on two ports 5400 and 23. Majority of the controls (port 5004) and shutdown/reboot (port 23)
- For WOL, use the WOL Generator in guiDesigner. WOL might needs port forwarding / routing setup in the routers. 
- Scrobble Icon (http://kon.deviantart.com/)

*/

	
//----------------------------------------------------------------------------------------------------------------
//Initialization of instance
//----------------------------------------------------------------------------------------------------------------
//var mms = function(systemName, feedbackName) {};

//For standalone system
var mms = {
	
	// ======================================================================
	// System Settings
	// ======================================================================
	
	// Edit the settings here if you want to set the default values
	defaultSysName: "MMS5",					// System 1 Name
	defaultSys2Name: "MMS5_2",				// System 2 Name
	defaultSysURL: "192.168.168.204",		// URL for both systems
	
	// For the first system
	sysName: "",					// System Name under System Properties in GuiDesigner
	sysURL: "",						// URL for media server
	sysPort: 5004,					// port for media server
	//SysUsername: null,			// username or null for authentification (not used)
	//SysPassword: null,			// password or null for authentification (not used)
	
	// For the second system
	sys2Name: "",					// System Name under System Properties in GuiDesigner
	sys2URL: "",					// URL for media server
	sys2Port: 23,					// port for media server
	//SysUsername: null,			// username or null for authentification (not used)
	//SysPassword: null,			// password or null for authentification (not used)
	
	// ======================================================================
	// Join Listings
	// ======================================================================
	
	// List join
	lstAlbum: 				"l4510",
	lstArtist: 				"l4520",
	lstGenre: 				"l4530",
	lstPlaylist: 			"l4540",
	lstRadioSource: 		"l4550",
	lstRadioStation: 		"l4551",
	lstPickListItem:		"l4552",
	lstRadioGenre:			"l4553",
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
	subRadioSource:			"d4550",
	subRadioStation:		"d4551",
	subPickListItem:		"d4552",
	subRadioGenre:			"d4553",
	subSearchRadioStations:	"d4554",
	subQueue: 				"d4560",
	
	// Digital join (buttons)
	btnShuffle:				"d4570",
	btnRepeat:				"d4571",
	btnPlayPause:			"d4572",
	btnMute:				"d4573",
	btnScrobble:			"d4574",
	btnWifiLED:				"d4580",
	btnSettings:			"d4581",
	btnAction:				"d4582",
	btnZone:				"d4583",
	btnSources:				"d4584",
	btnShutdown:			"d4585",
	btnReboot:				"d4586",
	btnCancel:				"d4587",
	btnBack:				"d4590",		// Actual button that contain scripts
	btnForward:				"d4591",		// Actual button that contain scripts
	//btnBackImage:			"d4593",		// Just for image purposes
	//btnForwardImage:		"d4594",		// Just for image purposes
	
	
	// Analogue join
	sldVolumeControl:		"a4500",
	sldTrackTime:			"a4501",
	
	// Serial joins (text box)
	txtPlayStatus:			"s4500",
	txtTrackStatus:			"s4501",
	txtCoverArt:			"s4502",
	txtTrackTitle:			"s4503",
	txtAlbum:				"s4505",
	txtArtist:				"s4504",
	txtTrackTime:			"s4506",
	txtTrackDuration:		"s4507",
	srchAlbum:				"s4510",
	srchArtist:				"s4511",
	srchGenre:				"s4512",
	srchPlaylist:			"s4513",
	srchRadioSource:		"s4514",
	srchQueue:				"s4515",
	txtPlaylist:			"s4516",
	txtSearchTitle:			"s4517",
	txtSearchDesc:			"s4518",
	srchRadioStation:		"s4519",
	txtHostname:			"s4520",
	txtIPAdd:				"s4521",
	txtIPPort:				"s4522",
	txtConnection:			"s4580",
	txtInstance:			"s4581",
	txtVolumeLevel:			"s4582",
	txtSelectedStation:		"s4583",
	txtAlphabet:			"s4584",
	
	// List items
	//	"d4601"		Token for thumbnails
	//	"d4602"		Token for thumbnails
	//	"d4603"		Token for titles
	//	"s4601"		thumbarts URL (guid)
	//	"s4602"		Returned string for album, songs, artists, genres, etc.
	//	"s4603"		Manually user-defined parameter (album, artist, etc.)
	//	"s4604"		Extra label parameter (album, artist, track time, etc.)
	//	"s4605"		Extra label parameter (album, artist, track time, etc.)
	
	//Main database Arrays
	arrayAlbum: [],					// Album
	arrayArtist: [],				// Artist
	arrayGenre: [],					// Genre
	arrayPlaylist:[],				// Playlist
	arrayRadioSource: [],			// Radio Sources
	arrayRadioStation: [],			// Radio Stations
	arrayRadioGenre: [],			// Radio Genre
	arrayPickListItem: [],			// PickListItem
	arrayQueue: [],					// Now Playing
	artistLetters:	[],				// Array to store the positions for each alphabar letter
	
	// ======================================================================
	// Global variables 
	// ======================================================================
	
	TrackTime: 0,			// Initialize the variable with an initial value	
	TrackDuration: 1,		// Initialize the variable with an initial value
	
	// ======================================================================
	// Setup 
	// ======================================================================
	
	setup: function() {
		
		// ---------------------------------------------------------------------------------------------------------------------------------------------------------
		// On startup, check for global tokens via CF.getJoin(CF.GlobalTokensJoin) and get the values for all the paramaters and set them to the System Properties.
		// ---------------------------------------------------------------------------------------------------------------------------------------------------------	
		
		//Get the global tokens values. Set the default value of the tokens via Global Token Manager.
		CF.getJoin(CF.GlobalTokensJoin, function(join, values, tokens) {
	
			//Read the global tokens. If global tokens are accidentally deleted, then use default values.
			mms.sysName = tokens["[inputSysName]"] || mms.defaultSysName;
			mms.sys2Name = tokens["[inputSys2Name]"] || mms.defaultSys2Name;
			mms.sysURL = tokens["[inputURL]"] || mms.defaultSysURL;
						
			// Read the tokens and display the values on the System Settings drop-down menu box.
			CF.setJoins([ {join: mms.txtHostname, value: mms.sysName}, {join: mms.txtIPAdd, value: mms.sysURL}, {join: mms.txtIPPort, value: mms.sysPort}, ]);
		
			// Switch to new systems by using the global token values.
			CF.setSystemProperties(mms.sysName, { enabled: true, address: mms.sysURL,	port: mms.sysPort });
			CF.setSystemProperties(mms.sys2Name, { enabled: true, address: mms.sysURL, port: mms.sys2Port });
		
			// Log in debugging window, start setup.
			mms.log("Autonomic MMS-5 System Setup Started.");		
			
			// Check that both the "MMS5" and "MMS5_2" system is defined in the GUI. Otherwise no commands from JS will work!
			if (CF.systems[mms.sysName] === undefined) {
				// Show alert
				CF.log("Your GUI file is missing the "+mms.sysName+" system.\nPlease add it to your project before continuing.\n\nSee readme in comments at top of the script.");
				// Cancel further JS setup
				return;
			} else if (CF.systems[mms.sys2Name] === undefined) {
				// Show alert
				CF.log("Your GUI file is missing the "+mms.sys2Name+" system.\nPlease add it to your project before continuing.\n\nSee readme in comments at top of the script.");
				// Cancel further JS setup
				return;
			} 
			
			// Watch all incoming data through a single feedback item : Syntax CF.watch(CF.event, systemName, feedbackName, feedbackFunction)
			CF.watch(CF.FeedbackMatchedEvent, mms.sysName, "Incoming Data", mms.incomingData); 				

			// Watch for connection changes. Syntax CF.watch(CF.event, systemName, systemFunction, boolean)
			CF.watch(CF.ConnectionStatusChangeEvent, mms.sysName, mms.onConnectionChange, true);			

			// Suspend and resume activities when Iviewer quits or put into background
			//CF.watch(CF.GUISuspendedEvent, mms.onGUISuspended);
			CF.watch(CF.GUIResumedEvent, mms.onGUIResumed);
			
			// Get the system IP address and port for use in all cover art calls. Sample command: http://192.168.1.10:5005/albumart?album={33432-33432-95909-33423-34430}
			mms.coverart = "http://"+mms.sysURL+":"+(parseInt(mms.sysPort)+1)+"/albumart?album="; 
						
			// Send the startup commands.
			// CF.send(mms.sysName, "SetHost 192.168.0.103\x0D\x0A");				// Set Host IP Address
			// CF.send(mms.sysName, "SetXMLMode Lists\x0D\x0A");					// Set list feedback in XML mode
			// CF.send(mms.sysName, "SetClientType "Mirage"\x0D\x0A");				// Set client type
			mms.setEncoding();														// Set character encoding to UTF8, to display non-Latin character.
			mms.setCurrentInstance();												// Set instance to current instance.
			mms.setPickListCount(1000);											// Set the number of items in the PickList list.
			mms.subcribeEventOn();													// Get real time feedback of changed status of items.
			mms.getStatus();														// Get the starting status of all items.
		
			// Show the list of Albums when starting up
			setTimeout(function(){mms.browseAlbums();}, 2000);	
			
			// Disable buttons that are not really used for not by adjusting the opacity settings
			CF.setProperties({join: mms.btnSources, opacity: 0.5});												// Source button (Main Page)
			CF.setProperties({join: mms.btnForward, opacity: 0.0});												// Forward button (PickListItem List Page)
			
			// Log in debugging window, end setup.
			mms.log("Autonomic MMS-5 System Setup Completed.");
		
		}); 
	},
	
	// Even though the call is not executed immediately, it is enqueued for later processing.
	onGUISuspended: function() { mms.subcribeEventOn(); },

	// Resume the suspended gui call.
	onGUIResumed: function() { mms.subcribeEventOn(); },
	//onGUIResumed: function() { mms.setup(); },
	
	// Gets the values of the IP settings, set to the global tokens and switch to new system.
	setSystemSettings: function() {									
			
			// Stop all CF.watch events else there's be multiple watch calls which causes the data received to be multiplied according to number of watches being called.
			CF.unwatch(CF.FeedbackMatchedEvent, mms.sysName, "Incoming Data");										// Stop watching all incoming data 				
			CF.unwatch(CF.ConnectionStatusChangeEvent, mms.sysName, mms.onConnectionChange, true);				// Stop watching for connection changes.			
			//CF.unwatch(CF.GUISuspendedEvent, mms.onGUISuspended);
			//CF.unwatch(CF.GUIResumedEvent, mms.onGUIResumed);
			
			// Get the values of all the IP Settings at once. txtHostname:	"s4520", txtIPAdd: "s4521",	txtIPPort: "s4522",
			CF.getJoins(["s4520", "s4521", "s4522"], function(joins) {
			
				// Set all these values as global tokens and persist, use CF.setToken(CF.GlobalTokensJoin)
				CF.setToken(CF.GlobalTokensJoin, "[inputSysName]", joins.s4520.value);
				CF.setToken(CF.GlobalTokensJoin, "[inputURL]", joins.s4521.value);
				CF.setToken(CF.GlobalTokensJoin, "[inputPort]", joins.s4522.value);				
				
				// Clear all previous lists and arrays
				mms.clearAll();
				
				// Re-run setup with all the new global token values
				mms.setup();
		});
	},
	
	// ======================================================================
	//  Handle Connections/Disconnections
	// ======================================================================
	onConnectionChange: function (system, connected, remote) {
		if (connected) {
			// Connection established
			CF.log("Autonomic MMS-5 System is Connected!");
			CF.setJoin(mms.txtConnection, "Server Connected");				// Send a string to display on Main Page that the System is connected
			CF.setJoin(mms.btnWifiLED, 1);									// Show connected status
			
		} else {
			// Connection lost
			CF.log("Autonomic MMS-5 System is Disconnected!!");
			CF.setJoin(mms.txtConnection, "Server Disconnected");			// Send a string to display on Main Page that the System is disconnected
			CF.setJoin(mms.btnWifiLED, 0);									// Show disconnected status
		}
	},

	// ======================================================================
	//  Other functions
	// ======================================================================
	
	//  Search library function
	search: function(compare_string, search_string){
		var newRegX = new RegExp(search_string, "gi");
		return compare_string.match(newRegX);
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
		genreRegex: /\b(Genre)\b.\{(.*)\}.\"(.*?)\"/i,
		
	// Example: Playlist {31784719-599f-a40b-548d-fbd9692a7fbf} "Playlist1" 14 1
	//	playlistFullRegex: /Genre.\{(.*)\}.\"(.*?)\".(.*).\"(.*?)\".\"(.*?)\"/i,
		playlistRegex: /Playlist.\{(.*)\}.\"(.*?)\"/i,	
	
	// Example: RadioSource {fbbcedb1-af64-4c3f-bfe5-000000000400} "Last.fm"
	// Special note : /RadioGenre.\{(.*)\}.\"(.*)\"/i and /RadioGenre.\{(.*)\}.\"(.*)\"/i will both capture the feedback string with either Genre and RadioGenre headers. Hence the
	//                need to use to exact string matching \b(string)\b regex to capture both feedbacks differently.   
		radioSourceRegex: /RadioSource.\{(.*)\}.\"(.*)\"/i,
		radioGenreRegex: /\b(RadioGenre)\b.\{(.*)\}.\"(.*)\"/i,
		pickListItemRegex:  /PickListItem.\{(.*)\}.\"(.*)\".(\d+)/i,
	
	// Example: RadioStation {da79c6f8-eb5a-49e6-9892-35da9db8693e} "Rock and Roll Hall of Fame Radio" "Music by Rock Hall Inducted Artists" -1 ""
		radioStationRegex: /RadioStation.\{(.*)\}.\"(.*)\".\"(.*)\".(.*).\"(.*)\"/i,

	// Example: Title {2a4786ff-56f1-3c47-142c-fa0939ec73d5} "Always Tomorrow" "00:04:52" 16 "GLORIA ESTEFAN" "Greatest Hits" -1 "" ""	
	//	queueFullRegex: /Title.\{(.*)\}.\"(.*)\".\"(.*?)\".(\d+).\"(.*?)\".\"(.*?)\".(.*\d).\"(.*)\".\"(.*)\"/i,
		queueRegex: /Title.\{(.*)\}.\"(.*)\".\"(.*?)\".(\d+).\"(.*?)\".\"(.*?)\".(.*\d).\"(.*)\".\"(.*)\"/i,
	
	// Example: Instance "Main", Instance "Player_A"
		instanceRegex: /Instance \"(.*)\"/i,
	
	// Example: ReportState Player_A NowPlayingGuid={16091522-760a-42c7-ec32-468556de19e9}		// Report of starting status of items
	// Example: StateChanged Player_A NowPlayingGuid={16091522-760a-42c7-ec32-468556de19e9}		// Report of changed status of items		
		//startStatusRegex: /ReportState\x20(.*)\x20(.*)=(.*)/i,
		stateThumbnailRegex: /NowPlayingGuid=(.*)/i,			// Thumbnail
		stateTrackNumberRegex: /MetaData1=(.*)/i,				// Track No. out of total tracks
		stateArtistRegex: /MetaData2=(.*)/i,					// Artist
		stateAlbumRegex: /MetaData3=(.*)/i,						// Album
		stateTrackRegex: /MetaData4=(.*)/i,						// Track
		stateTrackTimeRegex: /TrackTime=(.*)/i,					// Track Time
		stateTrackDurationRegex: /TrackDuration=(.*)/i,			// Track Duration
		stateShuffleRegex: /Shuffle=(.*)/i,						// Shuffle status (True/False)
		stateRepeatRegex: /Repeat=(.*)/i,						// Repeat status (True/False)
		stateQueueModeRegex: /QueueMode=(.*)/i,					// QueueMode
		stateVolumeRegex: /Volume=(\d+)/i,						// Volume level
		statePlayStatusRegex: /MediaControl=(.*)/i,				// Current Playing status (Play/Pause)
		stateMuteRegex: /Mute=(.*)/i,							// Mute status (True/False)
		stateScrobbleRegex: /Scrobbling=(\d)/i,					// Scrobble status (True/False)
		stateMediaArtChangedRegex: /MediaArtChanged=(.*)/i,		// State media art changed status (True/False).
		stateRunningRegex: /Running=(.*)/i,						// Running status (True/False). When shutdown, will changed to False.
		stateBackRegex: /Back=(.*)/i,							// Back to previous browsing history. StateChanged Main Back=True/False
		stateForwardRegex: /Forward=(.*)/i,						// Forward to previous browsing history. StateChanged Main Forward=True/False
		stateUIMessageRegex: /UI=StatusMessage."(.*)"/i,		// Message that is being played after Radio Station has been selected. StateChanged Main UI=StatusMessage "Tuning to 988 FM 98.8 (Top 40-Pop)"
		stateUIInputBoxRegex: /UI=InputBox.\{(.*)\}.\"(.*)\".\"(.*)\".\"(.*)\".\"(.*)\".\"(.*)\"/i,		// InputBox selections.
		
	// =============================================================================================================================
	// Incoming Data Point - Only used to populate array with data. Populations of lists will be done by other functions.
	// =============================================================================================================================	
	
	incomingData: function (itemName, matchedString) {
		
		if (mms.albumRegex.test(matchedString)) {							// Test if it is a Album message. This is for loading data into Album list.
				
				var matches = mms.albumRegex.exec(matchedString);			
				mms.arrayAlbum.push({										// push this into an array for searching later
									s4601: mms.coverart+matches[1]+"&e404=1",		
									s4602: matches[2],						
									s4603: "Album",						
									d4601: { tokens: {"[guid]": matches[1]} },
									d4602: { tokens: {"[guid]": matches[1]} }
								});
				CF.listAdd(mms.lstAlbum, [{								// as the feedback item comes in, straight away push into the list
									s4601: mms.coverart+matches[1]+"&e404=1",		
									s4602: matches[2],						
									s4603: "Album",						
									d4601: { tokens: {"[guid]": matches[1]} },
									d4602: { tokens: {"[guid]": matches[1]} }
								}]
				);
				mms.albumRegex.lastIndex = 0;
		
		} else if (mms.artistRegex.test(matchedString)) {					// Test if it is a Artist message. This is for loading data into Artist list.
		
				var matches = mms.artistRegex.exec(matchedString);
				mms.arrayArtist.push({
									s4601: mms.coverart+matches[1]+"&e404=1",		
									s4602: matches[2],						
									s4603: "Artist",
									d4601: { tokens: {"[guid]": matches[1]} },
									d4602: { tokens: {"[guid]": matches[1]} }
								});
				CF.listAdd(mms.lstArtist, [{
									s4601: mms.coverart+matches[1]+"&e404=1",		
									s4602: matches[2],						
									s4603: "Artist",						
									d4601: { tokens: {"[guid]": matches[1]} },
									d4602: { tokens: {"[guid]": matches[1]} }
								}]
				);
				mms.artistRegex.lastIndex = 0;					

		} else if (mms.genreRegex.test(matchedString)) {					// Test if it is a Genre message. This is for loading data into Genre list.

				var matches = mms.genreRegex.exec(matchedString);
				mms.arrayGenre.push({
									s4601: mms.coverart+matches[2]+"&e404=1",		
									s4602: matches[3],						
									s4603: "Genre",						
									d4601: { tokens: {"[guid]": matches[2]} },
									d4602: { tokens: {"[guid]": matches[2]} }
								});
				CF.listAdd(mms.lstGenre, [{
									s4601: mms.coverart+matches[2]+"&e404=1",		
									s4602: matches[3],						
									s4603: "Genre",						
									d4601: { tokens: {"[guid]": matches[2]} },
									d4602: { tokens: {"[guid]": matches[2]} }
								}]
				);
				mms.genreRegex.lastIndex = 0;		
		
		} else if (mms.playlistRegex.test(matchedString)) {					// Test if it is a Playlist message. This is for loading data into Playlist list.

				var matches = mms.playlistRegex.exec(matchedString);
				mms.arrayPlaylist.push({
									s4601: mms.coverart+matches[1]+"&e404=1",		
									s4602: matches[2],						
									s4603: "Playlist",						
									d4601: { tokens: {"[guid]": matches[1]} },
									d4602: { tokens: {"[guid]": matches[1]} },
									d4603: { tokens: {"[title]": matches[2]} }
								});
				CF.listAdd(mms.lstPlaylist, [{
									s4601: mms.coverart+matches[1]+"&e404=1",		
									s4602: matches[2],						
									s4603: "Playlist",						
									d4601: { tokens: {"[guid]": matches[1]} },
									d4602: { tokens: {"[guid]": matches[1]} },
									d4603: { tokens: {"[title]": matches[2]} }
								}]
				);
				mms.playlistRegex.lastIndex = 0;
		
		} else if (mms.radioSourceRegex.test(matchedString)) {					// Test if it is a Radio Source message. This is for loading data into Radio Source list.
			
				var matches = mms.radioSourceRegex.exec(matchedString);
				
				CF.setJoins([											//toggle to the correct subpage
					{join: mms.subRadioSource, value: 1},	
					{join: mms.subRadioStation, value: 0},
					{join: mms.subRadioGenre, value: 0},
					{join: mms.subPickListItem, value: 0},
					{join: mms.subSearchRadioStations, value: 0},
				]);
				
				mms.arrayRadioSource.push({
									s4601: mms.coverart+matches[1]+"&e404=1",
									s4602: matches[2],
									s4603: "Radio Sources",
									d4601: { tokens: {"[guid]": matches[1]} }
									
								});
				CF.listAdd(mms.lstRadioSource, [{
									s4601: mms.coverart+matches[1]+"&e404=1",		
									s4602: matches[2],						
									s4603: "Radio Sources",						
									d4601: { tokens: {"[guid]": matches[1]} }
									
								}]
				);
				mms.radioSourceRegex.lastIndex = 0;						// Reset the regex to work correctly after each consecutive match
		
		} else if (mms.radioStationRegex.test(matchedString)) {					// Test if it is a Radio Source message. This is for loading data into Radio Source list.
			
				var matches = mms.radioStationRegex.exec(matchedString);
				
				CF.setJoins([											//toggle to the correct subpage
					{join: mms.subRadioSource, value: 0},	
					{join: mms.subRadioStation, value: 1},
					{join: mms.subRadioGenre, value: 0},
					{join: mms.subPickListItem, value: 0},
					{join: mms.subSearchRadioStations, value: 0},
				]);
				
				mms.arrayRadioStation.push({
									s4601: mms.coverart+matches[1]+"&e404=1",
									s4602: matches[2],
									s4603: "",
									d4601: { tokens: {"[guid]": matches[1]} }
								});
				CF.listAdd(mms.lstRadioStation, [{
									s4601: mms.coverart+matches[1]+"&e404=1",		
									s4602: matches[2],						
									s4603: "",						
									d4601: { tokens: {"[guid]": matches[1]} }
								}]
				);
				mms.radioStationRegex.lastIndex = 0;						// Reset the regex to work correctly after each consecutive match
		
		} else if (mms.radioGenreRegex.test(matchedString)) {					// Test if it is a Radio Genre message. This is for loading data into Radio Source list.
			
				var matches = mms.radioGenreRegex.exec(matchedString);
				
				CF.setJoins([											//toggle to the correct subpage
					{join: mms.subRadioSource, value: 0},	
					{join: mms.subRadioStation, value: 0},
					{join: mms.subRadioGenre, value: 1},
					{join: mms.subPickListItem, value: 0},
					{join: mms.subSearchRadioStations, value: 0},
				]);
				
				mms.arrayRadioGenre.push({
									s4601: mms.coverart+matches[2]+"&e404=1",
									s4602: matches[3],
									s4603: "",
									d4601: { tokens: {"[guid]": matches[2]} }
								});
				CF.listAdd(mms.lstRadioGenre, [{
									s4601:  mms.coverart+matches[2]+"&e404=1",		
									s4602:  matches[3],						
									s4603: "Radio Genre",						
									d4601: { tokens: {"[guid]": matches[2]} }
								}]
				);	
				mms.radioGenreRegex.lastIndex = 0;						// Reset the regex to work correctly after each consecutive match
		
		} else if (mms.pickListItemRegex.test(matchedString)) {					// Test if it is a Radio Source message. This is for loading data into Radio Source list.
			
				var matches = mms.pickListItemRegex.exec(matchedString);
				
				CF.setJoins([											//toggle to the correct subpage
					{join: mms.subRadioSource, value: 0},	
					{join: mms.subRadioStation, value: 0},
					{join: mms.subRadioGenre, value: 0},
					{join: mms.subPickListItem, value: 1},
					{join: mms.subSearchRadioStations, value: 0},
					{join: mms.txtSelectedStation, value: ""},
				]);
				
				mms.arrayPickListItem.push({
									s4601: mms.coverart+matches[1]+"&e404=1",
									s4602: matches[2],
									s4603: "",
									d4601: { tokens: {"[guid]": matches[1]} }
								});
				CF.listAdd(mms.lstPickListItem, [{
									s4601: mms.coverart+matches[1]+"&e404=1",		
									s4602: matches[2],						
									s4603: "",						
									d4601: { tokens: {"[guid]": matches[1]} }
								}]
				);
				mms.pickListItemRegex.lastIndex = 0;						// Reset the regex to work correctly after each consecutive match
		
		} else if (mms.queueRegex.test(matchedString)) {					// Test if it is a Queue message. This is for loading data into Queue list.	
		
				var matches = mms.queueRegex.exec(matchedString);
				mms.arrayQueue.push({
									s4601: mms.coverart+matches[1]+"&e404=1",						// fanart
									s4602: "Track #" + matches[4] + " : "+ matches[2],		// track no. & title
									s4603: matches[5],										// track time
									s4604: matches[6],										// album										
									s4605: matches[3],										// artist
									d4601: { tokens: {"[guid]": matches[1]} },
									d4602: { tokens: {"[guid]": matches[1]} }
							});
				CF.listAdd(mms.lstQueue, [{
									s4601: mms.coverart+matches[1]+"&e404=1",						// fanart
									s4602: "Track #" + matches[4] + " : "+ matches[2],		// track no. & title
									s4603: matches[5],										// track time
									s4604: matches[6],										// album										
									s4605: matches[3],										// artist
									d4601: { tokens: {"[guid]": matches[1]} },
									d4602: { tokens: {"[guid]": matches[1]} }
								}]
				);
				mms.queueRegex.lastIndex = 0;								// Reset the regex to work correctly after each consecutive match
		
		} else if (mms.instanceRegex.test(matchedString)) {				// Test if it is a Instance message. This is for defining which zone/instance the player is at currently.
		
				var matches = mms.instanceRegex.exec(matchedString);
				switch (matches[1]) 
				{
					case "Main":
						CF.setJoin(mms.txtInstance, "Main");
						break;
					case "Player_A":
						CF.setJoin(mms.txtInstance, "Player A");
						break;
					case "Player_B":
						CF.setJoin(mms.txtInstance, "Player B");
						break;
					case "Player_C":
						CF.setJoin(mms.txtInstance, "Player C");
						break;
					case "Player_D":
						CF.setJoin(mms.txtInstance, "Player D");
						break;	
				}
				mms.instanceRegex.lastIndex = 0;
			
		} else if (mms.stateThumbnailRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateThumbnailRegex.exec(matchedString);
				CF.setJoin(mms.txtCoverArt, mms.coverart+matches[1]+"&e404=1");
				mms.stateThumbnailRegex.lastIndex = 0;
		
		}else if (mms.stateTrackNumberRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateTrackNumberRegex.exec(matchedString);
				CF.setJoin(mms.txtTrackStatus, matches[1]);
				mms.stateTrackNumberRegex.lastIndex = 0;
		
		} else if (mms.stateArtistRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateArtistRegex.exec(matchedString);
				CF.setJoin(mms.txtArtist, matches[1]);
				mms.stateArtistRegex.lastIndex = 0;
		
		} else if (mms.stateAlbumRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateAlbumRegex.exec(matchedString);
				CF.setJoin(mms.txtAlbum, matches[1]);
				mms.stateAlbumRegex.lastIndex = 0;
		
		} else if (mms.stateTrackRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateTrackRegex.exec(matchedString);
				CF.setJoin(mms.txtTrackTitle, matches[1]);
				mms.stateTrackRegex.lastIndex = 0;
				
		} else if (mms.stateTrackTimeRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateTrackTimeRegex.exec(matchedString);
				
				// convert the total time into minutes and seconds
				mms.TrackTime = matches[1];
				var minutes = Math.floor(matches[1]/60);
				var remain_seconds = matches[1] % 60;
				var seconds = Math.floor(remain_seconds);
				var time = ("00"+minutes).slice(-2) + ":" + ("00"+seconds).slice(-2);
				CF.setJoin(mms.txtTrackTime, time);
				mms.stateTrackTimeRegex.lastIndex = 0;
				
		} else if (mms.stateTrackDurationRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateTrackDurationRegex.exec(matchedString);
				
				// convert the total time into minutes and seconds
				mms.TrackDuration = Math.floor(matches[1]);
				var minutes = Math.floor(matches[1]/60);
				var remain_seconds = matches[1] % 60;
				var seconds = Math.floor(remain_seconds);
				var time = ("00"+minutes).slice(-2) + ":" + ("00"+seconds).slice(-2);
				CF.setJoin(mms.txtTrackDuration, time);
				mms.stateTrackDurationRegex.lastIndex = 0;
		
		} else if (mms.stateShuffleRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateShuffleRegex.exec(matchedString);
				switch(matches[1])
				{
					case "True":
						CF.setJoin(mms.btnShuffle, 1);
						break;
					case "False":
						CF.setJoin(mms.btnShuffle, 0);
						break;
				}
				mms.stateShuffleRegex.lastIndex = 0;
				
		} else if (mms.stateScrobbleRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateScrobbleRegex.exec(matchedString);
				switch(matches[1])
				{
					case "1":
						CF.setJoin(mms.btnScrobble, 1);
						break;
					case "0":
						CF.setJoin(mms.btnScrobble, 0);
						break;
				}
				mms.stateScrobbleRegex.lastIndex = 0;
				
		} else if (mms.stateRepeatRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateRepeatRegex.exec(matchedString);
				switch(matches[1])
				{
					case "True":
						CF.setJoin(mms.btnRepeat, 1);
						break;
					case "False":
						CF.setJoin(mms.btnRepeat, 0);
						break;
				}  
				mms.stateRepeatRegex.lastIndex = 0;
				
		} else if (mms.statePlayStatusRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.statePlayStatusRegex.exec(matchedString);
				switch(matches[1])
				{
					case "Play":
						CF.setJoin(mms.btnPlayPause, 0);
						CF.setJoin(mms.txtPlayStatus, "PLAYING STATUS : Playing");
						break;
					case "Pause":
						CF.setJoin(mms.btnPlayPause, 1);
						CF.setJoin(mms.txtPlayStatus, "PLAYING STATUS : Paused");
						break;
					case "Stop":
						CF.setJoin(mms.btnPlayPause, 0);
						CF.setJoin(mms.txtPlayStatus, "PLAYING STATUS : Stopped");
						break;	
				}  
				mms.statePlayStatusRegex.lastIndex = 0;

		} else if (mms.stateMuteRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateMuteRegex.exec(matchedString);
				switch(matches[1])
				{
					case "True":
						CF.setJoin(mms.btnMute, 1);
						break;
					case "False":
						CF.setJoin(mms.btnMute, 0);
						break;
				}  
				mms.stateMuteRegex.lastIndex = 0;
				
		} else if (mms.stateVolumeRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateVolumeRegex.exec(matchedString);
				CF.setJoin(mms.txtVolumeLevel, matches[1]);
				CF.setJoin(mms.sldVolumeControl, Math.round((matches[1]/50)*65535));
				mms.stateVolumeRegex.lastIndex = 0;
		
		} else if (mms.stateBackRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateBackRegex.exec(matchedString);
				switch(matches[1])
				{
					case "True":
						CF.setProperties({join: mms.btnBack, opacity: 1.0});
						break;
					case "False":
						CF.setProperties({join: mms.btnBack, opacity: 0.0});
						break;
				}  
				mms.stateBackRegex.lastIndex = 0;
		
		} else if (mms.stateForwardRegex.test(matchedString)) {				// Test if it is a Current Fanart message. This is for defining the fanart for the currently playing item.
		
				var matches = mms.stateForwardRegex.exec(matchedString);
				switch(matches[1])
				{
					case "True":
						CF.setProperties({join: mms.btnForward, opacity: 1.0});
						break;
					case "False":
						CF.setProperties({join: mms.btnForward, opacity: 0.0});
						break;
				}  
				mms.stateForwardRegex.lastIndex = 0;
		
		} else if (mms.stateUIMessageRegex.test(matchedString)) {					// Test if it is a Radio Source message. This is for loading data into Radio Source list.
			
				var matches = mms.stateUIMessageRegex.exec(matchedString);
				
				CF.setJoins([											//toggle to the correct subpage
					{join: mms.subRadioSource, value: 0},	
					{join: mms.subRadioStation, value: 0},
					{join: mms.subRadioGenre, value: 0},
					{join: mms.subPickListItem, value: 1},
					{join: mms.subSearchRadioStations, value: 0},
					{join: mms.txtSelectedStation, value: "Currently " + matches[1]},
				]);
				mms.stateUIMessageRegex.lastIndex = 0;						// Reset the regex to work correctly after each consecutive match
		
		} else if (mms.stateUIInputBoxRegex.test(matchedString)) {				// Test if it is a Radio Source message. This is for loading data into Radio Source list.
			
				var matches = mms.stateUIInputBoxRegex.exec(matchedString);
				
				CF.setJoins([													//toggle to the correct subpage
					{join: mms.subRadioSource, value: 0},	
					{join: mms.subRadioStation, value: 0},	
					{join: mms.subPickListItem, value: 0},	
					{join: mms.subRadioGenre, value: 0},	
					{join: mms.subSearchRadioStations, value: 1},
					{join: mms.txtSearchTitle, value: matches[2]},	
					{join: mms.txtSearchDesc, value: matches[3]},
					{join: mms.btnCancel, tokens: {"[guid]": matches[6]} },
				]);
				
				mms.stateUIInputBoxRegex.lastIndex = 0;						// Reset the regex to work correctly after each consecutive match
		} 
		
		/*else if (mms.stateRunningRegex.test(matchedString)) {				// Test if it is a shutdown message. This is for checking the shutdown status.
		
				var matches = mms.stateRunningRegex.exec(matchedString);
				
				switch(matches[1])
				{
					case "True":
						//Set the network connection status to disconnected and WIFI LED off
						CF.setJoin(mms.txtConnection, "Server Connected");		//Send a string to display on Main Page that the System is disconnected
						CF.setJoin(mms.btnWifiLED, 1);						//Show disconnected status
						break;
					case "False":
						//Set the network connection status to disconnected and WIFI LED off
						CF.setJoin(mms.txtConnection, "Server Disconnected");		//Send a string to display on Main Page that the System is disconnected
						CF.setJoin(mms.btnWifiLED, 0);								//Show disconnected status
						
						// Clear all the Now Playing items
						CF.setJoins([																		
							{join: mms.txtPlayStatus, value: ""},
							{join: mms.txtTrackStatus, value: ""},				
							{join: mms.txtCoverArt, value: ""},			
							{join: mms.txtTrackTitle, value: ""},			
							{join: mms.txtAlbum, value: ""},
							{join: mms.txtArtist, value: ""},			
							{join: mms.txtTrackTime, value: ""},
							{join: mms.txtTrackDuration, value: ""},
							{join: mms.sldTrackTime, value: 0},			// track time feedback slider
						]);
						break;
				} 
				mms.stateRunningRegex.lastIndex = 0;
		}
		*/
		
		// Set the playing status feedback on the slider
		CF.setJoin(mms.sldTrackTime, Math.round((mms.TrackTime/mms.TrackDuration)*65535));	
	}, 
	
	// =============================================================================================================================
	// Creation and control of Lists.
	// note: For large databases it's better to increase the delay time of setTimeout function to give more time for the regex to
	//       process the large amount of data before pushing the array into lists.	
	// =============================================================================================================================
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Albums -> Title
	// -----------------------------------------------------------------------------------------------------------------------------
	browseAlbums: function() { 
		mms.arrayAlbum = [];																// clear array of any previous data
		CF.listRemove(mms.lstAlbum);														// clear list of any previous entries
		CF.setJoins([																		// show the correct subpage and hide the rest
				{join: mms.subAlbum, value: 1},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},
				{join: mms.subRadioGenre, value: 0},
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
		mms.clearMusicFilter();															// clear all previous music filters
		mms.clearRadioFilter();															// clear all previous radio filters
		mms.sendCmd("BrowseAlbums"); 														// send the command and populate the array with data
		//setTimeout(function(){CF.listAdd(mms.lstAlbum, mms.arrayAlbum);}, 2000);			// set a short delay to give time for array to be populated before adding array into list.
	},
	
	selectAlbum_Title: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.arrayQueue = [];															// clear array of any previous data
			CF.listRemove(mms.lstQueue);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 1},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},
				{join: mms.subRadioGenre, value: 0},				
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
			mms.setMusicFilter_Album(t["[guid]"]);					//set the filter
			mms.sendCmd("BrowseAlbumTitles");						// Get all the titles in the selected album
			//setTimeout(function(){CF.listAdd(mms.lstQueue, mms.arrayQueue);}, 2000);			// set a short delay to give time for array to be populated before adding array into list.
		});
	},
	
	//Delete all previous tracks and play the album. If want to just queue the album tracks to current queue, use playAlbumTrue instead.
	playAlbum: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.playAlbumFalse(t["[guid]"]);						
		});
	},
	
	// Search the list of albums and display the searched results only.
	searchAlbums: function(strSearch) {
	
				var templistArray = [];				//initialize temporary array
				CF.listRemove(mms.lstAlbum);		//clear list of any previous entries
	
				for (var i = 0;i<mms.arrayAlbum.length;i++)						//loop thru all the elements in the Albums array 
				{
					var searchCoverArt = mms.arrayAlbum[i].s4601;
					var searchAlbum = mms.arrayAlbum[i].s4602;
					var searchType = mms.arrayAlbum[i].s4603;
					var searchTokenGuiD = mms.arrayAlbum[i].d4601.tokens["[guid]"];
					var searchToken2GuiD = mms.arrayAlbum[i].d4602.tokens["[guid]"];
					
					if(mms.search(searchAlbum, strSearch))							// refer to search() from "Other functions" section
					{
						templistArray.push({										// Add matched info to temp array
							s4601: searchCoverArt,
							s4602: searchAlbum,
							s4603: searchType,
							d4601: { tokens: {"[guid]": searchTokenGuiD} },
							d4602: { tokens: {"[guid]": searchToken2GuiD} }
						});
					} // end if
				}// end for
				CF.listAdd(mms.lstAlbum, templistArray);							// Add temp array to list
	},
	
	// Use the alphabar to filter the list of albums and display the filtered results only.
	alphasrchAlbums: function(sliderval) {
	
				// Calculate the letter based on the slider value (0-27). To allow for better accuracy of the letter, both 0 and 1 slider values will equal "#" in the slider.
				var letter = "#";
				if (sliderval > 1) {
					// Use ascii char code and convert to the letter (letter A = 65, B = 66, and so on). Use parseInt here otherwise the + symbol might concatenate the numbers together, 
					// rather than add them. This is because parameters may be passed as strings from tokens such as [sliderval]
					letter = String.fromCharCode(63 + parseInt(sliderval));
				}
				CF.setJoin(mms.txtAlphabet, letter);		// Test the conversion
				
				var templistArray = [];				//initialize temporary array
				CF.listRemove(mms.lstAlbum);		//clear list of any previous entries
	
				for (var i = 0;i<mms.arrayAlbum.length;i++)						//loop thru all the elements in the Albums array 
				{
					var searchCoverArt = mms.arrayAlbum[i].s4601;
					var searchAlbum = mms.arrayAlbum[i].s4602;
					var searchType = mms.arrayAlbum[i].s4603;
					var searchTokenGuiD = mms.arrayAlbum[i].d4601.tokens["[guid]"];
					var searchToken2GuiD = mms.arrayAlbum[i].d4602.tokens["[guid]"];
					
					if (letter == "#")												// Non-filtered, display everything
					{
						templistArray.push({										
							s4601: searchCoverArt,
							s4602: searchAlbum,
							s4603: searchType,
							d4601: { tokens: {"[guid]": searchTokenGuiD} },
							d4602: { tokens: {"[guid]": searchToken2GuiD} }
						});
					} 
					else if (letter == searchAlbum.charAt(0))						// compare the first alphabet of feedback string with the letter selected from slider
					{
						templistArray.push({										// Add matched info to temp array
							s4601: searchCoverArt,
							s4602: searchAlbum,
							s4603: searchType,
							d4601: { tokens: {"[guid]": searchTokenGuiD} },
							d4602: { tokens: {"[guid]": searchToken2GuiD} }
						});
					}
				}// end for
				CF.listAdd(mms.lstAlbum, templistArray);							// Add temp array to list
	},
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Artists -> Albums -> Title
	// -----------------------------------------------------------------------------------------------------------------------------
	
	browseArtists: function() { 
		mms.arrayArtist = [];																// clear array of any previous data
		CF.listRemove(mms.lstArtist);														// clear list of any previous entries
		CF.setJoins([																		// show the correct subpage and hide the rest
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 1},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subRadioGenre, value: 0},
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
		mms.clearMusicFilter();															// clear all previous music filters
		mms.clearRadioFilter();															// clear all previous radio filters
		mms.sendCmd("BrowseArtists"); 														// send the command
		//setTimeout(function(){CF.listAdd(mms.lstArtist, mms.arrayArtist);}, 2000);			// set a short delay to give time for array to be populated before adding array into list.
	},
	
	selectArtist_Album: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.arrayAlbum = [];									// clear array of any previous data
			CF.listRemove(mms.lstAlbum);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 1},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subRadioGenre, value: 0},
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
			mms.setMusicFilter_Artist(t["[guid]"]);					//set the filter
			mms.sendCmd("BrowseAlbums");						// Get all the titles in the selected album
			//setTimeout(function(){CF.listAdd(mms.lstAlbum, mms.arrayAlbum);}, 2000);			// set a short delay to give time for array to be populated before adding array into list.
		});
	},
	
	selectArtist_Album_Title: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.arrayQueue = [];									// clear array of any previous data
			CF.listRemove(mms.lstQueue);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 1},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subRadioGenre, value: 0},
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
			mms.setMusicFilter_Album(t["[guid]"]);					//set the filter
			mms.sendCmd("BrowseAlbumTitles");						// Get all the titles in the selected album
			//setTimeout(function(){CF.listAdd(mms.lstQueue, mms.arrayQueue);}, 2000);			// set a short delay to give time for array to be populated before adding array into list.
		});
	},
	
	//Delete all previous tracks and play the all albums under Artist. If want to just queue the albums to current queue, use playArtistTrue instead.
	playArtist: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.playArtistFalse(t["[guid]"]);						
		});
	},
	
	// Search the list of artists and display the searched results only.
	searchArtists: function(strSearch) {
	
				var templistArray = [];				//initialize temporary array
				CF.listRemove(mms.lstArtist);		//clear list of any previous entries
	
				for (var i = 0;i<mms.arrayArtist.length;i++)						//loop thru all the elements in the Albums array 
				{
					var searchCoverArt = mms.arrayArtist[i].s4601;
					var searchArtist = mms.arrayArtist[i].s4602;
					var searchType = mms.arrayArtist[i].s4603;
					var searchTokenGuiD = mms.arrayArtist[i].d4601.tokens["[guid]"];
					var searchToken2GuiD = mms.arrayArtist[i].d4602.tokens["[guid]"];
					
					if(mms.search(searchArtist, strSearch))							// refer to search() from "Other functions" section
					{
						templistArray.push({										// Add matched info to temp array
							s4601: searchCoverArt,
							s4602: searchArtist,
							s4603: searchType,
							d4601: { tokens: {"[guid]": searchTokenGuiD} },
							d4602: { tokens: {"[guid]": searchToken2GuiD} }
						});
					} // end if
				}// end for
				CF.listAdd(mms.lstArtist, templistArray);							// Add temp array to list
	},
	
	// Use the alphabar to filter the list of albums and display the filtered results only.
	alphasrchArtists: function(sliderval) {
	
				// Calculate the letter based on the slider value (0-27). To allow for better accuracy of the letter, both 0 and 1 slider values will equal "#" in the slider.
				var letter = "#";
				if (sliderval > 1) {
					// Use ascii char code and convert to the letter (letter A = 65, B = 66, and so on). Use parseInt here otherwise the + symbol might concatenate the numbers together, 
					// rather than add them. This is because parameters may be passed as strings from tokens such as [sliderval]
					letter = String.fromCharCode(63 + parseInt(sliderval));
				}
				CF.setJoin(mms.txtAlphabet, letter);		// Test the conversion
				
				var templistArray = [];				//initialize temporary array
				CF.listRemove(mms.lstArtist);		//clear list of any previous entries
	
				for (var i = 0;i<mms.arrayArtist.length;i++)						//loop thru all the elements in the Albums array 
				{
					var searchCoverArt = mms.arrayArtist[i].s4601;
					var searchArtist = mms.arrayArtist[i].s4602;
					var searchType = mms.arrayArtist[i].s4603;
					var searchTokenGuiD = mms.arrayArtist[i].d4601.tokens["[guid]"];
					var searchToken2GuiD = mms.arrayArtist[i].d4602.tokens["[guid]"];
					
					if (letter == "#")												// Non-filtered, display everything
					{
						templistArray.push({										// Add matched info to temp array
							s4601: searchCoverArt,
							s4602: searchArtist,
							s4603: searchType,
							d4601: { tokens: {"[guid]": searchTokenGuiD} },
							d4602: { tokens: {"[guid]": searchToken2GuiD} }
						});
					} 
					else if (letter == searchArtist.charAt(0))						// compare the first alphabet of feedback string with the letter selected from slider
					{
						templistArray.push({										// Add matched info to temp array
							s4601: searchCoverArt,
							s4602: searchArtist,
							s4603: searchType,
							d4601: { tokens: {"[guid]": searchTokenGuiD} },
							d4602: { tokens: {"[guid]": searchToken2GuiD} }
						});
					}
				}// end for
				CF.listAdd(mms.lstArtist, templistArray);							// Add temp array to list
	},
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Genres -> Albums -> Title
	// -----------------------------------------------------------------------------------------------------------------------------
	
	browseGenres: function() { 
		mms.arrayGenre = [];																// clear array of any previous data
		CF.listRemove(mms.lstGenre);														// clear list of any previous entries
		CF.setJoins([																		// show the correct subpage and hide the rest
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 1},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subRadioGenre, value: 0},
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
		mms.clearMusicFilter();															// clear all previous music filters
		mms.clearRadioFilter();															// clear all previous radio filters
		mms.sendCmd("BrowseGenres"); 														// send the command
		//setTimeout(function(){CF.listAdd(mms.lstGenre, mms.arrayGenre);}, 4000);			// set a short delay to give time for array to be populated before adding array into list.
	},
	
	selectGenre_Album: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.arrayAlbum = [];									// clear array of any previous data
			CF.listRemove(mms.lstAlbum);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 1},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subRadioGenre, value: 0},
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
			mms.setMusicFilter_Genre(t["[guid]"]);				//set the filter
			mms.sendCmd("BrowseAlbums");						// Get all the titles in the selected album
			//setTimeout(function(){CF.listAdd(mms.lstAlbum, mms.arrayAlbum);}, 2000);			// set a short delay to give time for array to be populated before adding array into list.
		});
	},
	
	selectGenre_Album_Title: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.arrayQueue = [];									// clear array of any previous data
			CF.listRemove(mms.lstQueue);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 1},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subRadioGenre, value: 0},
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
			mms.setMusicFilter_Album(t["[guid]"]);				//set the filter
			mms.sendCmd("BrowseAlbumTitles");						// Get all the titles in the selected album
			//setTimeout(function(){CF.listAdd(mms.lstQueue, mms.arrayQueue);}, 2000);			// set a short delay to give time for array to be populated before adding array into list.
		});
	},
	
	//Delete all previous tracks and play the all albums under Artist. If want to just queue the albums to current queue, use playArtistTrue instead.
	playGenre: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.playGenreFalse(t["[guid]"]);						
		});
	},
	
	// Search the list of genres and display the searched results only.
	searchGenres: function(strSearch) {
	
				var templistArray = [];				//initialize temporary array
				CF.listRemove(mms.lstGenre);		//clear list of any previous entries
	
				for (var i = 0;i<mms.arrayGenre.length;i++)						//loop thru all the elements in the Albums array 
				{
					var searchCoverArt = mms.arrayGenre[i].s4601;
					var searchGenre = mms.arrayGenre[i].s4602;
					var searchType = mms.arrayGenre[i].s4603;
					var searchTokenGuiD = mms.arrayGenre[i].d4601.tokens["[guid]"];
					var searchToken2GuiD = mms.arrayGenre[i].d4602.tokens["[guid]"];
					
					if(mms.search(searchGenre, strSearch))							// refer to search() from "Other functions" section
					{
						templistArray.push({										// Add matched info to temp array
							s4601: searchCoverArt,
							s4602: searchGenre,
							s4603: searchType,
							d4601: { tokens: {"[guid]": searchTokenGuiD} },
							d4602: { tokens: {"[guid]": searchToken2GuiD} }
						});
					} // end if
				}// end for
				CF.listAdd(mms.lstGenre, templistArray);							// Add temp array to list
	},
	
	// Use the alphabar to filter the list of albums and display the filtered results only.
	alphasrchGenres: function(sliderval) {
	
				// Calculate the letter based on the slider value (0-27). To allow for better accuracy of the letter, both 0 and 1 slider values will equal "#" in the slider.
				var letter = "#";
				if (sliderval > 1) {
					// Use ascii char code and convert to the letter (letter A = 65, B = 66, and so on). Use parseInt here otherwise the + symbol might concatenate the numbers together, 
					// rather than add them. This is because parameters may be passed as strings from tokens such as [sliderval]
					letter = String.fromCharCode(63 + parseInt(sliderval));
				}
				CF.setJoin(mms.txtAlphabet, letter);		// Test the conversion
				
				var templistArray = [];				//initialize temporary array
				CF.listRemove(mms.lstGenre);		//clear list of any previous entries
	
				for (var i = 0;i<mms.arrayGenre.length;i++)						//loop thru all the elements in the Albums array 
				{
					var searchCoverArt = mms.arrayGenre[i].s4601;
					var searchGenre = mms.arrayGenre[i].s4602;
					var searchType = mms.arrayGenre[i].s4603;
					var searchTokenGuiD = mms.arrayGenre[i].d4601.tokens["[guid]"];
					var searchToken2GuiD = mms.arrayGenre[i].d4602.tokens["[guid]"];
					
					if (letter == "#")												// Non-filtered, display everything
					{
						templistArray.push({										// Add matched info to temp array
							s4601: searchCoverArt,
							s4602: searchGenre,
							s4603: searchType,
							d4601: { tokens: {"[guid]": searchTokenGuiD} },
							d4602: { tokens: {"[guid]": searchToken2GuiD} }
						});
					} 
					else if (letter == searchGenre.charAt(0))						// compare the first alphabet of feedback string with the letter selected from slider
					{
						templistArray.push({										// Add matched info to temp array
							s4601: searchCoverArt,
							s4602: searchGenre,
							s4603: searchType,
							d4601: { tokens: {"[guid]": searchTokenGuiD} },
							d4602: { tokens: {"[guid]": searchToken2GuiD} }
						});
					}
				}// end for
				CF.listAdd(mms.lstGenre, templistArray);							// Add temp array to list
	},
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Playlists -> Titles
	// -----------------------------------------------------------------------------------------------------------------------------
	
	browsePlaylists: function() { 
		mms.arrayPlaylist = [];															// clear array of any previous data
		CF.listRemove(mms.lstPlaylist);													// clear list of any previous entries
		CF.setJoins([																		// show the correct subpage and hide the rest
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 1},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subRadioGenre, value: 0},
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
		mms.clearMusicFilter();															// clear all previous music filters
		mms.clearRadioFilter();															// clear all previous radio filters
		mms.sendCmd("BrowsePlaylists"); 														// send the command
		//setTimeout(function(){CF.listAdd(mms.lstPlaylist, mms.arrayPlaylist);}, 2000);			// set a short delay to give time for array to be populated before adding array into list.
	},
	
	selectPlaylist_Title: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.arrayQueue = [];									// clear array of any previous data
			CF.listRemove(mms.lstQueue);							//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 1},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subRadioGenre, value: 0},
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
			mms.setMusicFilter_Playlist(t["[guid]"]);				//set the filter
			mms.sendCmd("BrowseTitles");									// Get all the titles in the selected album
			//setTimeout(function(){CF.listAdd(mms.lstQueue, mms.arrayQueue);}, 2000);			// set a short delay to give time for array to be populated before adding array into list.
		});
	},
	
	//Delete all previous tracks and play the all albums under Artist. If want to just queue the albums to current queue, use playArtistTrue instead.
	playPlaylist: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.playPlaylistFalse(t["[guid]"]);						
		});
	},
	
	deletePlaylistItem: function(list, listIndex, join) {											// Delete Playlist Item. 
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.deletePlaylist(t["[title]"]);						
		});
	},
	
	// Special Note : It'll take a while for the playlist changes to be updated, you won't be able to see the changes immediately.
	savePlaylist: function(title) {																	
		mms.sendCmd("SavePlaylist " + title); 														// Save Playlist. *Command : SavePlaylist "Playlist1" 
		CF.setJoin(mms.txtPlaylist, "");										// Reset the Playlist textbox to show back default text 
	},
	
	deletePlaylist: function(title) { mms.sendCmd("DeletePlaylist " + title); },					// Delete Playlist. *Command : SavePlaylist "Playlist1"
	
	// Search the list of playlists and display the searched results only.
	searchPlaylists: function(strSearch) {
	
				var templistArray = [];				//initialize temporary array
				CF.listRemove(mms.lstPlaylist);		//clear list of any previous entries
	
				for (var i = 0;i<mms.arrayPlaylist.length;i++)						//loop thru all the elements in the Albums array 
				{
					var searchCoverArt = mms.arrayPlaylist[i].s4601;
					var searchPlaylist = mms.arrayPlaylist[i].s4602;
					var searchType = mms.arrayPlaylist[i].s4603;
					var searchTokenGuiD = mms.arrayPlaylist[i].d4601.tokens["[guid]"];
					var searchToken2GuiD = mms.arrayPlaylist[i].d4602.tokens["[guid]"];
					var searchToken3GuiD = mms.arrayPlaylist[i].d4603.tokens["[guid]"];
					
					if(mms.search(searchPlaylist, strSearch))							// refer to search() from "Other functions" section
					{
						templistArray.push({										// Add matched info to temp array
							s4601: searchCoverArt,
							s4602: searchPlaylist,
							s4603: searchType,
							d4601: { tokens: {"[guid]": searchTokenGuiD} },
							d4602: { tokens: {"[guid]": searchToken2GuiD} },
							d4603: { tokens: {"[guid]": searchToken3GuiD} }
						});
					} // end if
				}// end for
				CF.listAdd(mms.lstPlaylist, templistArray);							// Add temp array to list
	},
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Radio Sources -> Radio Stations -> All multiple selections depending on the source
	// -----------------------------------------------------------------------------------------------------------------------------
	
	browseRadioSources: function() { 
		mms.arrayRadioSource = [];															// clear array of any previous data
		CF.listRemove(mms.lstRadioSource);													// clear list of any previous entries
		CF.setJoins([																		// show the correct subpage and hide the rest
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 1},
				{join: mms.subRadioStation, value: 0},
				{join: mms.subRadioGenre, value: 0},
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
		mms.clearMusicFilter();															// clear all previous music filters
		mms.clearRadioFilter();															// clear all previous radio filters
		mms.sendCmd("BrowseRadioSources"); 														// send the command
		//setTimeout(function(){CF.listAdd(mms.lstRadioSource, mms.arrayRadioSource);}, 2000);			// set a short delay to give time for array to be populated before adding array into list.
	},
	
	selectRadioSource: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			
			if (mms.arrayRadioSource[listIndex].s4602 == "SiriusXM Internet Radio"){ 
					mms.arrayRadioGenre = [];								// clear array of any previous data
					CF.listRemove(mms.lstRadioGenre);						//clear list of any previous entries
					CF.setJoins([											//toggle to the correct subpage
						{join: mms.subAlbum, value: 0},
						{join: mms.subAlbumTitle, value: 0},				
						{join: mms.subArtist, value: 0},			
						{join: mms.subArtistAlbum, value: 0},			
						{join: mms.subArtistAlbumTitle, value: 0},
						{join: mms.subGenre, value: 0},			
						{join: mms.subGenreAlbum, value: 0},
						{join: mms.subGenreAlbumTitle, value: 0},	
						{join: mms.subPlaylist, value: 0},		
						{join: mms.subPlaylistTitle, value: 0},		
						{join: mms.subRadioSource, value: 0},	
						{join: mms.subRadioStation, value: 0},
						{join: mms.subRadioGenre, value: 1},
						{join: mms.subPickListItem, value: 0},
						{join: mms.subQueue, value: 0},
					]);
					mms.setRadioFilter_RadioSource(t["[guid]"]);				//set the filter
					mms.sendCmd("BrowseRadioGenres");
			
			} else {
			
					mms.arrayRadioStation = [];							// clear array of any previous data
					CF.listRemove(mms.lstRadioStation);					//clear list of any previous entries
					
					mms.arrayPickListItem = [];							// clear array of any previous data
					CF.listRemove(mms.lstPickListItem);					//clear list of any previous entries
					
					CF.setJoins([											//toggle to the correct subpage
						{join: mms.subAlbum, value: 0},
						{join: mms.subAlbumTitle, value: 0},				
						{join: mms.subArtist, value: 0},			
						{join: mms.subArtistAlbum, value: 0},			
						{join: mms.subArtistAlbumTitle, value: 0},
						{join: mms.subGenre, value: 0},			
						{join: mms.subGenreAlbum, value: 0},
						{join: mms.subGenreAlbumTitle, value: 0},	
						{join: mms.subPlaylist, value: 0},		
						{join: mms.subPlaylistTitle, value: 0},		
						{join: mms.subRadioSource, value: 0},	
						{join: mms.subRadioStation, value: 1},
						{join: mms.subRadioGenre, value: 0},
						{join: mms.subPickListItem, value: 0},
						{join: mms.subQueue, value: 0},
					]); 
					mms.setRadioFilter_RadioSource(t["[guid]"]);				//set the filter
					mms.sendCmd("BrowseRadioStations");
			}
		});
	},
	
	selectRadioGenre: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.arrayRadioStation = [];								// clear array of any previous data
			CF.listRemove(mms.lstRadioStation);						//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
						{join: mms.subAlbum, value: 0},
						{join: mms.subAlbumTitle, value: 0},				
						{join: mms.subArtist, value: 0},			
						{join: mms.subArtistAlbum, value: 0},			
						{join: mms.subArtistAlbumTitle, value: 0},
						{join: mms.subGenre, value: 0},			
						{join: mms.subGenreAlbum, value: 0},
						{join: mms.subGenreAlbumTitle, value: 0},	
						{join: mms.subPlaylist, value: 0},		
						{join: mms.subPlaylistTitle, value: 0},		
						{join: mms.subRadioSource, value: 0},	
						{join: mms.subRadioStation, value: 1},
						{join: mms.subRadioGenre, value: 0},
						{join: mms.subPickListItem, value: 0},
						{join: mms.subQueue, value: 0},
					]);
					mms.setRadioFilter_RadioGenre(t["[guid]"]);				//set the filter
					mms.sendCmd("BrowseRadioStations");
		});
	},
	
	playSelectedStation: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.playRadioStation(t["[guid]"]);				//play item using PlayRadioStation
		});
	},
	
	selectPickListItem: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.arrayPickListItem = [];							// clear array of any previous data
			CF.listRemove(mms.lstPickListItem);					//clear list of any previous entries
			CF.setJoins([											//toggle to the correct subpage
				{join: mms.subRadioSource, value: 0},	
				{join: mms.subRadioStation, value: 0},
				{join: mms.subRadioGenre, value: 0},
				{join: mms.subPickListItem, value: 1},
			]);
			mms.ackpickListItem(t["[guid]"]);				//Play item using AckPickList OR
		});
	},
	
	ackpickListItem: 			function(guid) { mms.sendCmd("AckPickItem " + guid); },				// Ack Pick Item 
	
	// Search the list of radio sources and display the searched results only.
	searchRadioSources: function(strSearch) {
	
				var templistArray = [];													//initialize temporary array
				CF.listRemove(mms.lstRadioSource);										//clear list of any previous entries
	
				for (var i = 0;i<mms.arrayRadioSource.length;i++)						//loop thru all the elements in the Albums array 
				{
					var searchCoverArt = mms.arrayRadioSource[i].s4601;
					var searchRadioSource = mms.arrayRadioSource[i].s4602;
					var searchType = mms.arrayRadioSource[i].s4603;
					var searchTokenGuiD = mms.arrayRadioSource[i].d4601.tokens["[guid]"];
					
					if(mms.search(searchRadioSource, strSearch))							// refer to search() from "Other functions" section
					{
						templistArray.push({										// Add matched info to temp array
							s4601: searchCoverArt,
							s4602: searchRadioSource,
							s4603: searchType,
							d4601: { tokens: {"[guid]": searchTokenGuiD} }
						});
					} // end if
				}// end for
				CF.listAdd(mms.lstRadioSource, templistArray);							// Add temp array to list
	},
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Queue - Shows all Now Playing Titles
	// -----------------------------------------------------------------------------------------------------------------------------
	
	browseQueue: function() { 
		mms.arrayQueue = [];															// clear array of any previous data
		CF.listRemove(mms.lstQueue);													// clear list of any previous entries
		CF.setJoins([																	// show the correct subpage and hide the rest
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subRadioGenre, value: 0},
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 1},
			]);
		mms.clearMusicFilter();															// clear all previous music filters
		mms.clearRadioFilter();															// clear all previous radio filters
		mms.sendCmd("BrowseNowPlaying"); 														// send the command
		//setTimeout(function(){CF.listAdd(mms.lstQueue, mms.arrayQueue);}, 2000);			// set a short delay to give time for array to be populated before adding array into list.
	},
	
	playCurrentTitle: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.playTitleFalse(t["[guid]"]);				// Play the current title
		});
	},
	
	queueCurrentTitle: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.playTitleTrue(t["[guid]"]);				// Play the current title
		});
	},

	playCurrentItem: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.playNowPlayingItem(t["[guid]"]);				// Play the current item
		});
	},
	
	removeCurrentItem: function(list, listIndex, join) {							
		CF.getJoin(list+":"+listIndex+":"+join, function(j,v,t) {
			mms.removeNowPlayingItem(t["[guid]"]);				// Remove the current item
			mms.browseQueue();									// Refresh the list
		});
	},
	
	// Search the list of radio sources and display the searched results only.
	searchQueue: function(strSearch) {
	
				var templistArray = [];				//initialize temporary array
				CF.listRemove(mms.lstQueue);		//clear list of any previous entries
	
				for (var i = 0;i<mms.arrayQueue.length;i++)						//loop thru all the elements in the Albums array 
				{
					var searchCoverArt = mms.arrayQueue[i].s4601;
					var searchQueue = mms.arrayQueue[i].s4602;
					var searchType = mms.arrayQueue[i].s4603;
					var searchTokenGuiD = mms.arrayQueue[i].d4601.tokens["[guid]"];
					var searchToken2GuiD = mms.arrayQueue[i].d4602.tokens["[guid]"];
					
					if(mms.search(searchQueue, strSearch))							// refer to search() from "Other functions" section
					{
						templistArray.push({										// Add matched info to temp array
							s4601: searchCoverArt,
							s4602: searchQueue,
							s4603: searchType,
							d4601: { tokens: {"[guid]": searchTokenGuiD} },
							d4602: { tokens: {"[guid]": searchToken2GuiD} }
						});
					} // end if
				}// end for
				CF.listAdd(mms.lstQueue, templistArray);							// Add temp array to list
	},
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Toggling between subpages
	// -----------------------------------------------------------------------------------------------------------------------------
		
	backAlbumList: function() {
		CF.setJoins([
				{join: mms.subAlbum, value: 1},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
		mms.clearMusicFilter();															// clear all previous music filters
		mms.clearRadioFilter();															// clear all previous radio filters
	},
	
	backArtistList: function() {
		CF.setJoins([
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 1},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
		mms.clearMusicFilter();															// clear all previous music filters
		mms.clearRadioFilter();															// clear all previous radio filters
	},
	
	backArtistAlbumList: function() {
		CF.setJoins([
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 1},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
	},
	
	backGenreList: function() {
		CF.setJoins([
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 1},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
		mms.clearMusicFilter();															// clear all previous music filters
		mms.clearRadioFilter();															// clear all previous radio filters
	},
	
	backGenreAlbumList: function() {
		CF.setJoins([
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 1},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
	},
	
	backPlaylistList: function() {
		CF.setJoins([
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 1},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 0},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
		mms.clearMusicFilter();															// clear all previous music filters
		mms.clearRadioFilter();															// clear all previous radio filters
	},
	
	backRadioSourceList: function() {
		CF.setJoins([
				{join: mms.subAlbum, value: 0},
				{join: mms.subAlbumTitle, value: 0},				
				{join: mms.subArtist, value: 0},			
				{join: mms.subArtistAlbum, value: 0},			
				{join: mms.subArtistAlbumTitle, value: 0},
				{join: mms.subGenre, value: 0},			
				{join: mms.subGenreAlbum, value: 0},
				{join: mms.subGenreAlbumTitle, value: 0},	
				{join: mms.subPlaylist, value: 0},		
				{join: mms.subPlaylistTitle, value: 0},		
				{join: mms.subRadioSource, value: 1},
				{join: mms.subRadioStation, value: 0},				
				{join: mms.subPickListItem, value: 0},
				{join: mms.subQueue, value: 0},
			]);
		mms.clearMusicFilter();															// clear all previous music filters
		mms.clearRadioFilter();															// clear all previous radio filters
	},
	
	backRadioSourceStations: function() {
		CF.listRemove(mms.lstPickListItem);
		mms.Back();																		// Go back browsing history
	},
	
	forwardRadioSourceStations: function() {
		CF.listRemove(mms.lstPickListItem);
		mms.Forward();																		// Move forward browsing history
	},
	
	clearAll: function() {
		
		// clear all lists of previous entries
		CF.listRemove(mms.lstAlbum);				
		CF.listRemove(mms.lstArtist);				
		CF.listRemove(mms.lstGenre);				
		CF.listRemove(mms.lstPlaylist);			
		CF.listRemove(mms.lstRadioSource);
		CF.listRemove(mms.lstRadioStation);		
		CF.listRemove(mms.lstPickListItem);
		CF.listRemove(mms.lstQueue);
		
		// clear all arrays of previous entries
		mms.arrayAlbum = [];					// Album
		mms.arrayArtist = [];					// Artist
		mms.arrayGenre = [];					// Genre
		mms.arrayPlaylist = [];				// Playlist
		mms.arrayRadioSource = [];				// Radio Sources
		mms.arrayRadioStation = [],			// Radio Stations
		mms.arrayPickListItem = [];			// PickListItem
		mms.arrayQueue = [];					// Now Playing
		mms.artistLetters = [];				// Artist letters
		
		// clear the irrelevant text fields and slider values
		CF.setJoins([																		
				{join: "s4601", value: ""},
				{join: mms.txtPlayStatus, value: ""},
				{join: mms.txtTrackStatus, value: ""},				
				{join: mms.txtCoverArt, value: ""},			
				{join: mms.txtTrackTitle, value: ""},			
				{join: mms.txtAlbum, value: ""},
				{join: mms.txtArtist, value: ""},			
				{join: mms.txtTrackTime, value: ""},
				{join: mms.txtTrackDuration, value: ""},
				{join: mms.srchAlbum, value: ""},			
				{join: mms.srchArtist, value: ""},
				{join: mms.srchGenre, value: ""},			
				{join: mms.srchPlaylist, value: ""},
				{join: mms.srchRadioSource, value: ""},			
				{join: mms.srchQueue, value: ""},
				{join: mms.txtPlaylist, value: ""},
				{join: mms.txtVolumeLevel, value: ""},
				{join: mms.sldVolumeControl, value: 0},		// volume slider
				{join: mms.sldTrackTime, value: 0},			// track time feedback slider
		]);
	},
	
	// -----------------------------------------------------------------------------------------------------------------------------
	// Other actions
	// -----------------------------------------------------------------------------------------------------------------------------
	
	// Play All commands
	playAlbumTrue: 			function(guid) { mms.sendCmd("PlayAlbum " + guid + " True"); },		// Play selected Album. Will be added to the queue without interrupting playback.
	playAlbumFalse: 		function(guid) { mms.sendCmd("PlayAlbum " + guid + " False"); },		// Play selected Album. The queue will be cleared before the tracks are added.
	playArtistTrue: 		function(guid) { mms.sendCmd("PlayArtist " + guid + " True"); },		// Play selected Artist. Will be added to the queue without interrupting playback.
	playArtistFalse: 		function(guid) { mms.sendCmd("PlayArtist " + guid + " False"); },		// Play selected Artist. The queue will be cleared before the tracks are added.
	playGenreTrue: 			function(guid) { mms.sendCmd("PlayGenre " + guid + " True"); },		// Play selected Genre. Will be added to the queue without interrupting playback.
	playGenreFalse: 		function(guid) { mms.sendCmd("PlayGenre " + guid + " False"); },		// Play selected Genre. The queue will be cleared before the tracks are added.
	playPlaylistTrue: 		function(guid) { mms.sendCmd("PlayPlaylist " + guid + " True"); },		// Play selected Playlist. Will be added to the queue without interrupting playback.
	playPlaylistFalse: 		function(guid) { mms.sendCmd("PlayPlaylist " + guid + " False"); },	// Play selected Playlist. The queue will be cleared before the tracks are added.
	playTitleTrue: 			function(guid) { mms.sendCmd("PlayTitle " + guid + " True"); },		// Play selected Title. Will be added to the queue without interrupting playback.
	playTitleFalse: 		function(guid) { mms.sendCmd("PlayTitle " + guid + " False"); },		// Play selected Title. The queue will be cleared before the tracks are added.
	playRadioStation: 		function(guid) { mms.sendCmd("PlayRadioStation " + guid); },			// Play selected Radio Station. Will always clear the now playing queue.
	playNowPlayingItem: 	function(guid) { mms.sendCmd("JumpToNowPlayingItem " + guid); },		// Jump to the selected Item and begin playback.
	removeNowPlayingItem: 	function(guid) { mms.sendCmd("RemoveNowPlayingItem " + guid); },		// Remove the selected Item.
	
	// Browse library commands
	browseMusic: 			function() { mms.sendCmd("Browse Music"); },				// Browse Music
	browseRecordedTV: 		function() { mms.sendCmd("Browse RecordedTV"); },			// Browse Recorded TV
	browseMovies: 			function() { mms.sendCmd("Browse Movies"); },				// Browse Movies
	browseVideos: 			function() { mms.sendCmd("Browse Videos"); },				// Browse Videos
	browsePictures: 		function() { mms.sendCmd("Browse Pictures"); },			// Browse Pictures
	browseInstances: 		function() { mms.sendCmd("BrowseInstances"); },			// Browse Instances
	browseFavorites: 		function() { mms.sendCmd("BrowseFavorites"); },			// Browse Favorites
	browseRadioStations: 	function() { mms.sendCmd("BrowseRadioStations"); },		// Browse Radio Stations
	
	// Basic transport commands
	PlayPause: 				function() { mms.sendCmd("PlayPause"); },					// Play/Pause
	Play: 					function() { mms.sendCmd("Play"); },						// Play
	Pause: 					function() { mms.sendCmd("Pause"); },						// Pause
	Stop: 					function() { mms.sendCmd("Stop"); },						// Stop
	SkipNext: 				function() { mms.sendCmd("SkipNext"); },					// Skip Next
	SkipPrevious: 			function() { mms.sendCmd("SkipPrevious"); },				// Skip Previous
	ShuffleOn: 				function() { mms.sendCmd("Shuffle True"); },				// Shuffle On
	ShuffleOff: 			function() { mms.sendCmd("Shuffle False"); },				// Shuffle Off
	ShuffleToggle: 			function() { mms.sendCmd("Shuffle Toggle"); },				// Shuffle Toggle
	RepeatOn: 				function() { mms.sendCmd("Repeat True"); },				// Repeat On
	RepeatOff: 				function() { mms.sendCmd("Repeat False"); },				// Repeat Off
	RepeatToggle: 			function() { mms.sendCmd("Repeat Toggle"); },				// Repeat Toggle
	ScrobbleOn: 			function() { mms.sendCmd("Scrobble True"); },				// Scrobble On
	ScrobbleOff: 			function() { mms.sendCmd("Scrobble False"); },				// Scrobble Off
	ScrobbleToggle: 		function() { mms.sendCmd("Scrobble Toggle"); },			// Scrobble Toggle
	MuteOn: 				function() { mms.sendCmd("Mute True"); },					// Mute On
	MuteOff: 				function() { mms.sendCmd("Mute False"); },					// Mute Off
	MuteToggle: 			function() { mms.sendCmd("Mute Toggle"); },				// Mute Toggle
	VolumeUp: 				function() { mms.sendCmd("VolumeUp"); },					// Volume Up. Volume range 0 - 50.
	VolumeDown: 			function() { mms.sendCmd("VolumeDown"); },					// Volume Down. Volume range 0 - 50.
	SetVolume: 				function(level) { mms.sendCmd("SetVolume " + level); },					// Volume Down. Volume range 0 - 50.
	
	// Other remote commands
	ChannelUp: 				function() { mms.sendCmd("SendRemote ch+"); },				// Channel Up
	ChannelDown: 			function() { mms.sendCmd("SendRemote ch-"); },				// Channel Down
	Rewind: 				function() { mms.sendCmd("SendRemote Rewind"); },			// Rewind
	FastForward: 			function() { mms.sendCmd("SendRemote FastForward"); },		// Fast Forward
	Record: 				function() { mms.sendCmd("SendRemote Record"); },			// Record
	Information: 			function() { mms.sendCmd("SendRemote MoreInfo"); },		// Information
	Guide: 					function() { mms.sendCmd("Navigate TVGuide"); },			// Guide 
	Back_IR: 				function() { mms.sendCmd("SendRemote Back"); },			// Back (IR Remote)
	DVDMenu: 				function() { mms.sendCmd("SendRemote DVDMenu"); },			// DVDMenu
	GreenButton: 			function() { mms.sendCmd("Navigate Start"); },				// Green Button
	Up: 					function() { mms.sendCmd("SendRemote up"); },				// Up
	Down: 					function() { mms.sendCmd("SendRemote down"); },			// Down
	Left: 					function() { mms.sendCmd("SendRemote left"); },			// Left
	Right: 					function() { mms.sendCmd("SendRemote right"); },			// Right
	Select: 				function() { mms.sendCmd("SendRemote ok"); },				// Select OK
	NumPad1: 				function() { mms.sendCmd("SendRemote 1"); },				// NumPad1
	NumPad2: 				function() { mms.sendCmd("SendRemote 2"); },				// NumPad2
	NumPad3: 				function() { mms.sendCmd("SendRemote 3"); },				// NumPad3
	NumPad4: 				function() { mms.sendCmd("SendRemote 4"); },				// NumPad4
	NumPad5: 				function() { mms.sendCmd("SendRemote 5"); },				// NumPad5
	NumPad6: 				function() { mms.sendCmd("SendRemote 6"); },				// NumPad6
	NumPad7: 				function() { mms.sendCmd("SendRemote 7"); },				// NumPad7
	NumPad8: 				function() { mms.sendCmd("SendRemote 8"); },				// NumPad8
	NumPad9: 				function() { mms.sendCmd("SendRemote 9"); },				// NumPad9
	NumPad0: 				function() { mms.sendCmd("SendRemote 0"); },				// NumPad0
	NumPadEnter: 			function() { mms.sendCmd("SendRemote enter"); },			// NumPadEnter
	NumPadClear: 			function() { mms.sendCmd("SendRemote clear"); },			// NumPadClear
	Slideshow: 				function() { mms.sendCmd("Navigate Slideshow"); },			// Slideshow
	LiveTV: 				function() { mms.sendCmd("Navigate LiveTV"); },			// Live TV
	
	// SetMusicFilter commands
	setMusicFilter_Album:		function(guid) { mms.sendCmd("SetMusicFilter Album=" + guid); },			// Set Album filter 
	setMusicFilter_Artist:		function(guid) { mms.sendCmd("SetMusicFilter Artist=" + guid); },			// Set Artist filter
	setMusicFilter_Genre:		function(guid) { mms.sendCmd("SetMusicFilter Genre=" + guid); },			// Set Genre filter
	setMusicFilter_Playlist:	function(guid) { mms.sendCmd("SetMusicFilter Playlist=" + guid); },		// Set Playlist filter
	setMusicFilter_RadioSource:	function(guid) { mms.sendCmd("SetMusicFilter RadioSource=" + guid); },	// Set Radio Sources filter
	setMusicFilter_Queue:		function(guid) { mms.sendCmd("SetMusicFilter NowPlaying=" + guid); },		// Set Now Playing filter
	setMusicFilter_Search:		function(guid) { mms.sendCmd("SetMusicFilter Search=" + guid); },			// Search 
	clearMusicFilter:			function() { mms.sendCmd("SetMusicFilter Clear"); },						// Clear all Music filters
	
	// SetMusicFilter commands
	setRadioFilter_Album:		function(guid) { mms.sendCmd("SetRadioFilter Album=" + guid); },			// Set Album filter 
	setRadioFilter_Artist:		function(guid) { mms.sendCmd("SetRadioFilter Artist=" + guid); },			// Set Artist filter
	setRadioFilter_Genre:		function(guid) { mms.sendCmd("SetRadioFilter Genre=" + guid); },			// Set Genre filter
	setRadioFilter_Playlist:	function(guid) { mms.sendCmd("SetRadioFilter Playlist=" + guid); },		// Set Playlist filter
	setRadioFilter_RadioSource:	function(guid) { mms.sendCmd("SetRadioFilter RadioSource=" + guid); },		// Set Radio Sources filter
	setRadioFilter_RadioGenre:	function(guid) { mms.sendCmd("SetRadioFilter RadioGenre=" + guid); },	// Set Radio Sources filter
	setRadioFilter_Queue:		function(guid) { mms.sendCmd("SetRadioFilter NowPlaying=" + guid); },		// Set Now Playing filter
	setRadioFilter_Search:		function(guid) { mms.sendCmd("SetRadioFilter Search=" + guid); },			// Search 
	clearRadioFilter:			function() { mms.sendCmd("SetRadioFilter Clear"); },						// Clear all Radio filters
	
	// SetMediaFilter commands
	setMediaFilter_Album:		function(guid) { mms.sendCmd("SetMediaFilter Album=" + guid); },			// Set Album filter 
	setMediaFilter_Artist:		function(guid) { mms.sendCmd("SetMediaFilter Artist=" + guid); },			// Set Artist filter
	setMediaFilter_Genre:		function(guid) { mms.sendCmd("SetMediaFilter Genre=" + guid); },			// Set Genre filter
	setMediaFilter_Playlist:	function(guid) { mms.sendCmd("SetMediaFilter Playlist=" + guid); },		// Set Playlist filter
	setMediaFilter_RadioSource:	function(guid) { mms.sendCmd("SetMediaFilter RadioSource=" + guid); },		// Set Radio Sources filter
	setMediaFilter_Queue:		function(guid) { mms.sendCmd("SetMediaFilter NowPlaying=" + guid); },		// Set Now Playing filter
	setMediaFilter_Search:		function(guid) { mms.sendCmd("SetMediaFilter Search=" + guid); },			// Search 
	clearMediaFilter:			function() { mms.sendCmd("SetMediaFilter Clear"); },						// Clear all Media filters
	
	// AckButton commands
	deleteRadioStation:			function(guid) { mms.sendCmd("AckButton " + guid + " Delete the station"); },		// Message Box. Delete the station option.
	editRadioStation:			function(guid) { mms.sendCmd("AckButton " + guid + " Edit the station"); },		// Message Box. Edit the station option.
	cancelRadioStation:			function(guid) { mms.sendCmd("AckButton " + guid + " Cancel"); },					// Message Box. Cancel option. Default action.
	createRadioStation:			function(guid) { mms.sendCmd("AckButton " + guid); },								// Input Box. Pressing this option will send the string. Default action.
	cancelSearch:				function(guid) { mms.sendCmd(guid + "CANCEL"); },
	submitSearch:				function(guid, srchstring) { mms.sendCmd(guid + "OK " + srchstring); },
	getToken:					function(guid) { CF.setJoin("s1010", guid); },
	
	searchCancel: function() {	
			CF.getJoin(mms.btnCancel, function(join, value, tokens) {
			mms.cancelSearch(tokens["[guid]"]);	
			mms.Back();
		});
	},
	
	searchSubmit: function(srchstring) {	
			CF.getJoin(mms.btnCancel, function(join, value, tokens) { 
				mms.submitSearch(tokens["[guid]"], srchstring);	 
			});
	},
	
	//searchSubmit: function() {	mms.submitSearch(tokens["[guid]"]);	},
	//showToken: function() {	mms.getToken(tokens["[guid]"]);	},
	
	// CreateNewRadioStation
	// EditRadioStation
	
	// ======================================================================
    // Other commands
    // ======================================================================
	
	setPickListCount:  		    function(count) { mms.sendCmd("SetPickListCount " + count); },			// create a new radio station.
	setEncoding:  		    	function() { mms.sendCmd("SetEncoding 65001"); },						// create a new radio station.
	createRadioStation: 		function() { mms.sendCmd("CreateNewRadioStation"); },					// create a new radio station.
	editRadioStation: 			function() { mms.sendCmd("EditRadioStation"); },						// edit radio station.
	getStatus: 					function() { mms.sendCmd("GetStatus"); },								// Get a report of all status on startup.
	setCurrentInstance: 		function() { mms.sendCmd("SetInstance *");	},							// Select current instance.
	subcribeEventOn: 			function() { mms.sendCmd("SubscribeEvents True"); },					// Turns ON feedback of StateChanged events for CURRENT instance only.
	subcribeEventOff: 			function() { mms.sendCmd("SubscribeEvents False"); },					// Turns OFF feedback of StateChanged events for CURRENT instance only.
	subcribeAllEventOn: 		function() { mms.sendCmd("SubscribeEventsAll True"); },				// Turns ON feedback of StateChanged events for ALL instances.
	subcribeAllEventOff: 		function() { mms.sendCmd("SubscribeEventsAll False"); },				// Turns OFF feedback of StateChanged events for ALL instances.
	clearQueue:					function() { mms.sendCmd("ClearNowPlaying"); mms.browseQueue();},		// Stop all playing tracks and clear all now playing list.
	Shutdown:					function() { mms.sendCmd2("Shutdown"); },								// System Shutdown
	Reboot:						function() { mms.sendCmd2("Reboot"); },								// System Reboot
	
	Back: function() { 																					// Back
		CF.listRemove(mms.lstRadioSource);
		CF.listRemove(mms.lstRadioStation);
		CF.listRemove(mms.lstPickListItem);		
		mms.sendCmd("Back"); 
	},
	
	Forward: function() { 																				// Forward
		CF.listRemove(mms.lstRadioSource);
		CF.listRemove(mms.lstRadioStation);
		CF.listRemove(mms.lstPickListItem);
		mms.sendCmd("Forward"); 
	},								
	
	
	// Select the zone instance and update the now playing info.
	selectZone:	function(zone) { 
		mms.sendCmd("SetInstance "+zone);
		mms.getStatus();
		mms.browseQueue();		
	},		
	
	// Format the command string to send to system : CF.send(systemName, string [, outputFormat])
	sendCmd: function(command) { CF.send(mms.sysName, command+"\x0D\x0A"); },										// System 1 : Port 5004
	sendCmd2: function(command) { CF.send(mms.sys2Name, command+"\x0D\x0A"); },									// System 2 : Port 23
	
	// Only allow logging calls when CF is in debug mode - better performance in release mode this way
	log: function(msg) {
			if (CF.debug) {
				CF.log(msg);
			}
		}
};

CF.modules.push(
	{
		name:"Autonomic MMS5", 		// the name of the module (mostly for display purposes)
		setup:mms.setup,			// the setup function to call
		object: mms,       		// the object to which the setup function belongs
		version: "Beta v0.01"       // An optional module version number that is displayed in the Remote Debugger
	}
);


