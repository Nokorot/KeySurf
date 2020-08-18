
/*  Keyboard Surfing - browser addon
Copyright (c) Somnia 2016-2018  */

"use strict";

var edat = {}

if (typeof edatIsFirefox=="boolean")
	edat.isFirefox = true;
else
	edat.isFirefox = false;

if (typeof edatDebugOn=="boolean") {
	edat.isDebugToConsole = true;
	edat.isDebugToDbox = true;

	edat.isDBoxKeyEnabled = true;
	edat.isDebugTargets = true;
	edat.isDBoxOnStart = true;
	}
else{
	edat.isDebugToConsole = false;
	edat.isDebugToDbox = false;

	edat.isDBoxKeyEnabled = false;
	edat.isDebugTargets = false;
	edat.isDBoxOnStart = false;
	}

var gloIsDisabled=false;
var enabledOnStartList={};
var prefs=null;
var isFirstRun = true;
var allMyTabs = {};
var version = chrome.runtime.getManifest().version;
var lastActiveTabId = null;
var lastKeyState = null;
var isApplyLastKeyState = false;

GetPrefsFromStorage();

function siteFromUrl(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

function OnPageScriptLoaded(tabId)
{
	var options = {};

	options.isFirefoxWE = edat.isFirefox;
	options.version = version;

	options.isDBoxKeyEnabled = edat.isDBoxKeyEnabled;
	options.isDebugTargets = edat.isDebugTargets;
	options.isDBoxOnStart = edat.isDBoxOnStart;
	options.isFirstRun = isFirstRun;

	options.isDisableFrameprocOnInactive = true;
	options.isDisableFrameprocOnIdle = true;

	options.isDisabled = gloIsDisabled;
	if (lastActiveTabId != null)
		if (allMyTabs.hasOwnProperty(""+lastActiveTabId))
			options.isDisabled = allMyTabs[""+lastActiveTabId].isDisabled;
	options.isForceSmoothTime = false;
 
    chrome.tabs.get(tabId, function(tab) {
        var site = siteFromUrl(tab.url); 

	    options.isDisabled = (site in enabledOnStartList) 
            ? !enabledOnStartList[site] : options.isDisabled;

    	allMyTabs[""+tabId] = {
    			id: tabId,
    			isDisabled: options.isDisabled
    			};
        SendMessage(tabId, "startScript", {options: options, prefs:prefs });
    });
	SendMessage(tabId, "startScript", {options: options, prefs:prefs });


}

function OnTabUpdate(tabId, changed, tab)
{ }

function OnTabRemoved(tabId, removeInfo)
{
	delete allMyTabs[""+tabId];
	if (lastActiveTabId==tabId){
		lastActiveTabId=null;
		UpdateGloActiveTabId();
		}
}

function PreferencesAcquired(items)
{
	if (items.isNumAlways) items.isNumXtb = false;

	gloIsDisabled = !items.isKSEnabledOnStart;
    enabledOnStartList = items.enabledOnStartList;
	prefs={};
	prefs.isNumpadInBoxEnabled = items.isNumAlways;
	prefs.isNumpadEnabled = items.isNumAlways || items.isNumXtb;
	prefs.isLeftEnabled = items.isLeftEnabled;
	prefs.isRightEnabled = items.isRightEnabled;
	prefs.isPreferTabs = items.isPreferTabs;
	prefs.isKSEnabledOnStart = items.isKSEnabledOnStart;
	isFirstRun = items.isFirstRun;

	chrome.storage.onChanged.addListener(OnPreferencesChange);
	chrome.tabs.onRemoved.addListener(OnTabRemoved);
	chrome.runtime.onMessage.addListener(ReceiveMsg);
	chrome.windows.onFocusChanged.addListener(OnWindowActivated);
	chrome.tabs.onActivated.addListener(OnTabActivated);
    chrome.tabs.onUpdated.addListener(OnTabUpdate);
	chrome.browserAction.onClicked.addListener(OnIconClick);

	if (isFirstRun)
		chrome.tabs.create({url:"https://en.wikipedia.org"});
}

function OnIconClick(tab)
{
	if (!allMyTabs.hasOwnProperty(""+tab.id))
		return;

	SendMessage(tab.id, "onToolbarButtonClick", {} );
}

function UpdateGloActiveTabId()
{
	chrome.tabs.query(
			{active:true,windowType:"normal", lastFocusedWindow: true},
			function(tabArray){
				if (tabArray.length>0)
					lastActiveTabId=tabArray[0].id;
				}
			);
}

function Fncall_CurrentActiveTabInFocusedWindow(fn)
{
	chrome.tabs.query(
			{active:true,windowType:"normal", currentWindow: true},
			function(tabArray){
				if (tabArray.length>0)
					fn(tabArray[0]);
				}
			);
}
function Fncall_AllTabsInFocusedWindow(fn)
{
	chrome.tabs.query(
			{windowType:"normal", currentWindow: true},
			function(tabArray){
				if (tabArray.length>0)
					fn(tabArray);
				}
			);
}
function SetActiveTab(tabId)
{
	chrome.tabs.update(tabId,{active: true} );
}
function SwitchToTab(relPos)
{
	Fncall_CurrentActiveTabInFocusedWindow( function(tab){
		Fncall_AllTabsInFocusedWindow(function(tabs){
			var len = tabs.length;
			if (len<1) return;
			var i=0;
			for(; i<len; i++)
				if (tab.id == tabs[i].id)
					break;
			if (i==len) return;
			i= (i+relPos+len+len)%len;

			var tabId=tabs[i].id;
			SendApplyLastKeyState(tabId);
			SetActiveTab(tabId);
			});
		});
}

function OnTabActivated(activeInfo)
{
	/*chrome.windows.getCurrent(function (window){
			OnFocusChanged(window.id);
			});	*/
	chrome.windows.getLastFocused(function (window){
			if (!chrome.runtime.lastError)
				OnFocusChanged(window.id);
			});
	UpdateGloActiveTabId();
}

function OnWindowActivated(windowId)
{
	/*chrome.windows.getCurrent(function (window){
			if(typeof window!="undefined" && window!=null)
				OnFocusChanged(window.id);
			});	*/
	chrome.windows.getLastFocused(function (window){
			if (!chrome.runtime.lastError)
				OnFocusChanged(window.id);
			});
	UpdateGloActiveTabId();
}

//function OnFocusChanged(windowId)
function OnFocusChanged(windowIdOfFocusedWindow)
{
	//var activeTabId = activeInfo.tabId;
	//var winId = activeInfo.windowId;
	for (var tabIdStr in allMyTabs){
		if (!allMyTabs.hasOwnProperty(tabIdStr)) continue;
		var tabId = allMyTabs[tabIdStr].id;
		chrome.tabs.get(
				tabId,
				function(tab) {

					if((typeof tab)=="undefined" || tab==null)
						return;
					if (tab.active && tab.windowId == windowIdOfFocusedWindow) {
						SendMessage(tab.id, "tabActiveChange", { isActive: true } );
						if (isApplyLastKeyState) {
							SendApplyLastKeyState(tab.id);
							isApplyLastKeyState = false;
							}
						}
					else
						SendMessage(tab.id, "tabActiveChange", { isActive: false } );
					}
				);
		}
}

function OnPreferencesChange(changes, namespace)
{
	if ("isKSEnabledOnStart" in changes){
		gloIsDisabled = !changes["isKSEnabledOnStart"].newValue;
		prefs.isKSEnabledOnStart = changes["isKSEnabledOnStart"].newValue;
		}
	if ("enabledOnStartList" in changes){
        enabledOnStartList = changes["enabledOnStartList"].newValue;
        }
	if ("isLeftEnabled" in changes){
		prefs.isLeftEnabled = changes["isLeftEnabled"].newValue;
		}
	if ("isRightEnabled" in changes){
		prefs.isRightEnabled = changes["isRightEnabled"].newValue;
		}
	if ("isPreferTabs" in changes){
		prefs.isPreferTabs = changes["isPreferTabs"].newValue;
		}
	if ("isNumXtb" in changes){
		var isNumXtb = changes["isNumXtb"].newValue;
		if (isNumXtb) {
			prefs.isNumpadEnabled = true;
			prefs.isNumpadInBoxEnabled = false;
			}
		else{
			prefs.isNumpadEnabled = false;
			prefs.isNumpadInBoxEnabled = false;
			}
		}
	if ("isNumAlways" in changes){
		var isNumAlways = changes["isNumAlways"].newValue;
		if (isNumAlways) {
			prefs.isNumpadInBoxEnabled = true;
			prefs.isNumpadEnabled = true;
			}
		else{
			if (prefs.isNumpadInBoxEnabled == true)
				prefs.isNumpadEnabled = false;
			prefs.isNumpadInBoxEnabled = false;
			}
		}

	SendMessageAllMyTabs("preferencesChange", {prefs: prefs});
}

function SendApplyLastKeyState(tabId)
{
	SendMessage(tabId,"keyState",{"realKeyState": lastKeyState});
}

function SendMessage(tabId, name, dat){
	if (dat==null)
		dat = {};
	dat.name=name;
	chrome.tabs.sendMessage(tabId, dat);
	if (edat.isDebugToConsole)
		console.log("MSG sent from controller\n");
	}

function SendMessageAllMyTabs(name, dat){
	for (var tabIdStr in allMyTabs){
		if (!allMyTabs.hasOwnProperty(tabIdStr)) continue;
		SendMessage(allMyTabs[tabIdStr].id, name, dat)
		}
	}

function ReceiveMsg(dat, sender, sendResponse)
{
	if (!sender.tab) {
		if (edat.isDebugToConsole)
			console.log("Ctrl-ReceiveMsg: No tabId, message from another extenstion?");
		return;
		}
	var tabId = sender.tab.id;

	if (!dat.actName){
		CL(tabId, "Ctrl-ReceiveMsg without actName");
		return;
		}
	if (typeof tabId != "number"){
		CL(tabId, "Ctrl-ReceiveMsg tabId not a number");
		return;
		}
	var actName = dat.actName;
	lastKeyState = dat.realKeyState;
	isApplyLastKeyState = false;

	CL(tabId, "('"+actName+"'from"+tabId+")");

	if (actName=="OnPageScriptLoaded"){
		OnPageScriptLoaded(tabId);
		return;
		}
	if (actName=="FirstRunOff"){
		isFirstRun=false;
		chrome.storage.local.set({isFirstRun: isFirstRun,} ,function() {} );
		return;
		}
	if (actName=="OpenInNewTab"){
		lastActiveTabId =tabId;
		var url = dat.url;
		if (typeof url!="string") return;
		//chrome.tabs.create({url:url, openerTabId:tabId }); //supply windowId?
		chrome.tabs.create({url:url});
		}
	else if (actName=="OpenInNewWindow"){
		lastActiveTabId =tabId;
		var url = dat.url;
		if (typeof url!="string") return;
		chrome.windows.create({url:url});
		}
	else if (actName=="Open"){
		lastActiveTabId =tabId;
		var url = dat.url;
		if (typeof url!="string") return;
		chrome.tabs.update(tabId, {url:url});
		}
	else if (actName=="NewWindow"){
		lastActiveTabId =tabId;
		if (edat.isFirefox)
			chrome.windows.create({url:"about:home"});
		else
			chrome.windows.create({url:"chrome://newtab"});
		}
	else if (actName=="NewTab"){
		lastActiveTabId =tabId;
		if (edat.isFirefox)
			chrome.tabs.create({url:"about:home"});
		else
			chrome.tabs.create({url:"chrome://newtab"});
		}
	else if (actName=="NextTab"){
		lastActiveTabId =tabId;
		SwitchToTab(1);
		}
	else if (actName=="PrevTab"){
		lastActiveTabId =tabId;
		SwitchToTab(-1);
		}
	else if (actName=="Homepage"){
		if (edat.isFirefox)
			chrome.tabs.update(tabId, {url:"about:home"});
		else
			chrome.tabs.update(tabId, {url:"chrome://newtab"});
		}
	else if (actName=="Reload"){
		chrome.tabs.reload(tabId);
		}
	else if (actName=="TabClose"){
		isApplyLastKeyState = true;
		chrome.tabs.remove(tabId);
		}
	else if (actName=="Disable"){
		if (allMyTabs.hasOwnProperty(""+tabId))
			allMyTabs[""+tabId].isDisabled = true;
		}
	else if (actName=="Enable"){
		if (allMyTabs.hasOwnProperty(""+tabId))
			allMyTabs[""+tabId].isDisabled = false;
		}
	else if (actName=="ZoomIn"){
		ChangeZoom(tabId, 1/0.9);
		}
	else if (actName=="ZoomOut"){
		ChangeZoom(tabId, 0.9);
		}
	}

function ChangeZoom(tabId, factor)
{
	chrome.tabs.getZoom(tabId, function(zoomFactor) {
		chrome.tabs.setZoom(tabId, factor*zoomFactor);
		}
		);
}

function CL(tabId,str)
{
	if (edat.isDebugToConsole) console.log(str);
	if (edat.isDebugToDbox)
		SendMessage(tabId,"debugMessage",{str:str});
}

function GetPrefsFromStorage()
{
	chrome.storage.local.get(
					{
					isKSEnabledOnStart: true,
					isNumAlways: false,
					isNumXtb: true,
					isRightEnabled: true,
					isLeftEnabled: true,
					isFirstRun: true,
					isPreferTabs: true,
                    enabledOnStartList: {}
					},
				PreferencesAcquired
				);
}
