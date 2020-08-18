
module.export = function a(T) {

// ( type, LeftKey, RightKey, NumpadKey, EffectedByOnOff, KeyCode, ActionIdentifyer) 

// types:
//  3: Mod key
//  4: Action key
//  9: Scroll key
//  20: Move key
//  30: Arrow key
//  31: Home/end/page up/page down
//  99: On Off button

u.T = {};
T(99, 0, 0, 0, 0, "Pause", "OnOff");
T(9, 0, 0, 1, 1, "Numpad7", "num7");
T(9, 0, 1, 0, 1, "KeyI", "num7"); // Was KeyU
T(9, 1, 0, 0, 1, "KeyR", "num7");
T(9, 0, 0, 1, 1, "Numpad9", "num9");
T(20, 0, 1, 0, 1, "KeyO", "num9");
T(20, 1, 0, 0, 1, "KeyW", "num9");
T(9, 0, 0, 1, 1, "Numpad1", "num1");
T(9, 0, 1, 0, 1, "KeyM", "num1"); 
T(9, 0, 1, 0, 1, "KeyU", "num1");  // Extra
T(9, 1, 0, 0, 1, "KeyC", "num1");
T(9, 0, 0, 1, 1, "Numpad2", "num2");
T(9, 0, 1, 0, 1, "Comma", "num2");
T(9, 1, 0, 0, 1, "KeyZ", "num2");
T(9, 0, 0, 1, 1, "Numpad3", "num3");
T(9, 0, 1, 0, 1, "Period", "num3");
T(9, 1, 0, 0, 1, "KeyX", "num3");
T(9, 0, 0, 1, 1, "NumpadDecimal", "numDec");
T(20, 1, 0, 0, 1, "KeyQ", "numDec");
T(20, 0, 1, 0, 1, "KeyP", "numDec");
T(9, 0, 0, 1, 1, "NumpadDivide", "num/");
T(9, 1, 0, 0, 1, "Digit3", "num/");
T(9, 0, 1, 0, 1, "Digit9", "num/");
T(9, 0, 0, 1, 1, "NumpadMultiply", "num*");
T(9, 1, 0, 0, 1, "Digit2", "num*");
T(9, 0, 1, 0, 1, "Digit0", "num*");
T(9, 0, 0, 1, 1, "NumpadSubtract", "num-");
T(20, 0, 0, 1, 1, "Numpad8", "numUp");
T(20, 0, 0, 1, 1, "Numpad5", "numDown");
T(20, 0, 0, 1, 1, "Numpad4", "numLeft");
T(20, 0, 0, 1, 1, "Numpad6", "numRight");

// RgihtKeys:
T(20, 0, 1, 0, 1, "KeyK", "numUp");
T(20, 0, 1, 0, 1, "KeyJ", "numDown");
T(20, 0, 1, 0, 1, "KeyH", "numLeft"); // Was KeyJ
T(20, 0, 1, 0, 1, "KeyL", "numRight");

// LeftKeys:
T(20, 1, 0, 0, 1, "KeyE", "numUp");
T(20, 1, 0, 0, 1, "KeyD", "numDown");
T(20, 1, 0, 0, 1, "KeyF", "numRight");
T(20, 1, 0, 0, 1, "KeyS", "numLeft");


T(3, 0, 0, 1, 1, "Numpad0", "mod");
T(3, 1, 1, 0, 1, "Space", "mod");
T(4, 0, 0, 1, 0, "NumpadEnter", "action1");
T(4, 0, 1, 0, 1, "Semicolon", "action1");
T(4, 0, 1, 0, 1, "Quote", "action2");
// T(4, 0, 1, 0, 1, "KeyH", "action1");
T(4, 1, 0, 0, 1, "KeyG", "action1");
T(4, 1, 0, 0, 1, "KeyA", "action1");
T(4, 0, 0, 1, 0, "NumpadAdd", "action2");
T(4, 0, 1, 0, 1, "Slash", "action2");
T(4, 0, 1, 0, 1, "KeyN", "action2");
T(4, 1, 0, 0, 1, "KeyV", "action2");
T(30, 0, 0, 0, 1, "ArrowUp", "up");
T(30, 0, 0, 0, 1, "ArrowDown", "down");
T(30, 0, 0, 0, 1, "ArrowLeft", "left");
T(30, 0, 0, 0, 1, "ArrowRight", "right");
T(31, 0, 0, 0, 0, "PageUp", "pgup");
T(31, 0, 0, 0, 0, "PageDown", "pgdn");
T(31, 0, 0, 0, 1, "Home", "home");
T(31, 0, 0, 0, 1, "End", "end");
T(20, 1, 1, 0, 1, "KeyY", "txtUp");
T(20, 1, 1, 0, 1, "KeyT", "txtUp");
T(20, 1, 1, 0, 1, "KeyB", "txtDn");

return u;

}
