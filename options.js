/*  Keyboard Surfing - browser addon 
Copyright (c) Somnia 2016-2018  */


// Saves options to chrome.storage.sync.

function save_options() 
{  
  try{
    var isKSEnabledOnStart = document.getElementById('isKSEnabledOnStart').checked;
    var isNumAlways = document.getElementById('numAlways').checked;
    var isNumXtb = document.getElementById('numXtb').checked;  
    var isRightEnabled = document.getElementById('isRightEnabled').checked;
    var isLeftEnabled = document.getElementById('isLeftEnabled').checked;
    var isPreferTabs = document.getElementById('isPreferTabs').checked;
    var enabledOnStartList = JSON.parse(document.getElementById('enabledOnStartList').value);

    if (isNumAlways) isNumXtb = false;
    
    //document.getElementById('like').checked = !likesColor;  
    chrome.storage.local.set(
				{    
				isKSEnabledOnStart: isKSEnabledOnStart,
				isNumAlways: isNumAlways,
				isNumXtb: isNumXtb,
				isRightEnabled: isRightEnabled,
				isLeftEnabled: isLeftEnabled,
				isPreferTabs: isPreferTabs,
				enabledOnStartList: enabledOnStartList
				},
			function() {
				// Update status to let user know options were saved.
				var status = document.getElementById('status');
                status.innerHTML = " Options saved. ";
				status.style.visibility = 'visible';
				setTimeout( function() { status.style.visibility = 'hidden'; }, 1500);
				}
			);
  } catch (e) {
    // Notefy the user the the list was not parsed
	var status = document.getElementById('status');
    status.innerHTML = " Error: The Options was not saved. ";
	status.style.visibility = 'visible';
	setTimeout( function() { status.style.visibility = 'hidden'; }, 1500);

  }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() 
{
 
    console.log(localStorage);
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.local.get(
					{    
					isKSEnabledOnStart: true,
					isNumAlways: false,
					isNumXtb: true,
					isRightEnabled: true,
					isLeftEnabled: true,
					isPreferTabs: true,
                    enabledOnStartList: {}
					}, 
				function(items) {
					if (items.isNumAlways) items.isNumXtb = false;
					document.getElementById('isKSEnabledOnStart').checked = items.isKSEnabledOnStart;
					document.getElementById('numAlways').checked = items.isNumAlways;
					document.getElementById('numXtb').checked = items.isNumXtb;
					document.getElementById('numNever').checked = !items.isNumXtb && !items.isNumAlways;
					document.getElementById('isRightEnabled').checked = items.isRightEnabled;
					document.getElementById('isLeftEnabled').checked = items.isLeftEnabled;
					document.getElementById('isPreferTabs').checked = items.isPreferTabs;					
					document.getElementById('enabledOnStartList').value = JSON.stringify(items.enabledOnStartList, null, 4);
					}
				);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

