// Author: Chris Petsche
// Artist Designer and Developer Portfolio
// NavButtonDisplayBehavior.js
// Version: 2.7.1
// Updated: 10 Nov 2019

// The purpose of this script is to run the behavior of the navigation buttons at the
// top and bottom of the screen. It is designed so that the toggle buttons associated
// opens and closes the display nav buttons are contained in by fading the buttons in
// and out, along with shrinking and expanding the display window. There are timers for 
// both displays that will make their window automatically close. The timer is set as      
// soon as the site launches, and after a display is open so that the center of the
// screen is open to show the viewer more area on the page. Beyond the basic 
// functionality is the simple effects that are only for cosmetic flare.

// Basic concept goes:
//  - Window open on launch
//  - If the toggle button's pressed or auto close timer hits zero:
//      - Fade display buttons in. And just before they completely fade, shrink window.
//  - If window is closed and toggle button pressed:
//      - Expand window. And just before completely open, fade display buttons in. 



// !!****** Nav Button Display Behavior System: Main Ops Section ******!! //
// In this section the viewer input is taken in, the main ops variables are set, and the
// functions of the system are updated via the SiteClockWorks.js script.

// Since the entire system is called on a 1/100th second cycle, any timers running
// within it need to be incremented at the same rate in order to keep everything
// synced and in time. This is also a value that will never change and is therefore
// set to a constant. 
const _effectTimeIncrementation = 0.01;

// Variable set when the top display functions complete all their tasks during
// the change from open to close, or close to open. 
var _topClosed = false;
// Variable set when the top display functions are to start running their tasks
// to make the change from open to close, or close to open. 
var _topSetToClose = false;
// Timer set as a buffer between the window display transition and the buttons fading
// to simulate the desired effect as the display opens or closes. 
var _topSecondaryTransitionTimer = 0;
// When set to something above zero, the time will represent the number of seconds
// until the top display will automatically close.
var _autoTopDisplayWindowTransitionTime = 0;

// There are two displays that are able to run at seperate times due to the second set
// of ops variables for the bottom display.
var _btmClosed = false;
var _btmSetToClose = false;
var _btmSecondaryTransitionTimer = 0;
var _autoBtmDisplayWindowTransitionTime = 0;


// !!! SINGLE CALL FUNCTIONS !!! //

// Function called to change the state of the navigation button displays from open to closed, or
// from closed to open. It takes in a single parameter telling the inner content that it's either
// the top or the bottom display wanting to change. The function can be called from the viewer
// toggle buttons in the html files and from the automatic close function below.
function ToggleButtonDisplayStatus (_changeTop)
{
    // If viewer wants to change the open/closed status of the button display at the top of the page
    // or its appropriate auto close timer calls in...
    if(_changeTop)
    {
        // and the button display is currently not closed and not set to close...
        if(!_topClosed && !_topSetToClose)
        {
            // the viewer is obviously calling to close the display. 
            // So the system sets the display to be closed. 
            _topSetToClose = true;
            // Set up the system to make the tranisiton as the top display.
            InitiateButtonDisplayTransition (_changeTop);
        }

        // but if the button display is currently closed and set to close...
        else if(_topClosed && _topSetToClose)
        {
            // the viewer is calling to open the display.
            _topSetToClose = false;
            // Again, set up the system to make the tranisiton as the top display.
            InitiateButtonDisplayTransition (_changeTop);
        }      
    }

    // If viewer wants to change the open/closed status of the button display at the bottom of the page, or
    // like the top, the automatic close timer calls in...
    else if(!_changeTop)
    {
        // and the button display is currently not closed and not set to close...
        if(!_btmClosed && !_btmSetToClose)
        {
            // the viewer is obviously calling to close the display. 
            // So the system sets the display to be closed. 
            _btmSetToClose = true;
            // Set up the system to make the tranisiton as the bottom display.
            InitiateButtonDisplayTransition (_changeTop);
        }
        
        // but if the button display is currently closed and set to close...
        else if(_btmClosed && _btmSetToClose)
        {
            // the viewer is calling to open the display, and the system
            // the display to be opened.
            _btmSetToClose = false;
            // Once again, set up the system to make the tranisiton as the top display.
            InitiateButtonDisplayTransition (_changeTop);
        }
    } 
}

// As each transition is based on a set of timers counting down at specific stages, from open to 
// closed and then closed to open, this function sets the timer for the first element to transition 
// and a secondary timer that will eventually be a parameter in setting the timer for the second 
// element to be transitioned. It takes in a parameter telling the inner content if it's the top or
// bottom display that's being set.
function InitiateButtonDisplayTransition (_top)
{
    // If the top is to be set...
    if(_top)
    {
        // And the top is not closed as well as set to close...
        if(!_topClosed && _topSetToClose)
        {
            // Set buttons transition timer first!
            SetDisplayButtonsTransitionTimer (_top);

            // Then, set timer to close the display window just before buttons completely fade out.
            SetSecondaryTransitionTimer (_top, _topSetToClose);
        }
        
        // But, if the top is close and it is not set to close...
        else if(_topClosed && !_topSetToClose)
        {
            // Set display window transition timer first!
            SetDisplayWindowTransitionTimer (_top);
            // The display buttons should start to fade in just before display window is completely open. 
            SetSecondaryTransitionTimer (_top, _topSetToClose);
        }
    }

    // If it's no the top being requested, set the bottom...
    else if(!_top)
    {
        // Then, under the same conditions as the top display...
        if(!_btmClosed && _btmSetToClose)
        {
            // Set buttons transition timer first!
            SetDisplayButtonsTransitionTimer (_top);

            // Set timer to close the display window just before buttons completely fade out.
            SetSecondaryTransitionTimer (_top, _btmSetToClose);
        }
        
        // or...
        else if(_btmClosed && !_btmSetToClose)
        {
            // Set display window transition timer first!
            SetDisplayWindowTransitionTimer (_top);
            // The display buttons should start to fade in just before display window is 
            // completely open. 
            SetSecondaryTransitionTimer (_top, _btmSetToClose);
        }
    }
}

// Sets the timer for the display window to open or close. It takes in a variable
// that lets the functions know whether it's the top or bottom display that is to
// make the transition.
function SetDisplayWindowTransitionTimer (_top)
{
    // If it is the top that is to transition...
    if(_top)
    {
        // Then the current time of the top window timer is set to 
        // the top display close preset time.
        _currTopDisplayWindowCloseTime = _topDisplayWindowCloseTime;
    }

    // But if the bottom is to transtion...
    else if(!_top)
    {
        // The current time of the bottom window timer is set to the
        // bottom display close preset time.
        _currBtmDisplayWindowCloseTime = _btmDisplayWindowCloseTime;
    }
}

// Sets that navigation button fade timers. Takes a variable to know
// whether it's the top or bottom buttons that are to fade.
function SetDisplayButtonsTransitionTimer (_top)
{
    // If it's the top buttons...
    if(_top)
    {
        // The current fade time is set to the top displays preset
        // button fade time.
        _currTopButtonFadeTime = _topButtonFadeTime;
    }

    // But it's the bottom buttons that are to fade...
    else if(!_top)
    {
        // The current fade time is set to the bottom displays
        // preset button fade time.
        _currBtmButtonFadeTime = _btmButtonFadeTime;
    }
}

// As each transition has two stages to it, this function sets
// the secondary or buffer timer between those two stages. It
// takes in two variables that specify whether it's the top or
// bottom displays buffer that needs to be set, and if the 
// display is to open or close. 
function SetSecondaryTransitionTimer (_top, _close)
{
    // If it's the top and it's to close...
    if(_top && _close)
    {
        // The buttons fade first, so the buffer
        // doesn't need to be as long.
        _topSecondaryTransitionTimer = 0.15;
    }

    // But if it's the top and it's top open...
    else if(_top && !_close)
    {
        // The buttons need to wait for the
        // display to open before fading in.
        // So this time it must be longer,
        // but more so than the bottom as 
        // the display window itself is longer.
        _topSecondaryTransitionTimer = 1.95;
    }

    // If it's the not the top to be set, and it's
    // to be closed...
    else if(!_top && _close)
    {
        // Like the top, the buttons will fade
        // first. So the timer doesn't need to
        // be as long.
        _btmSecondaryTransitionTimer = 0.2;
    }

    // But if it's not the top to be set, and it's
    // not be be closed...
    else if(!_top && !_close)
    {
        // The buttons again need to wait for the
        // display window to open before fading in.
        // Since this display is shorter than the
        // top, the buffer doesn't need to be as 
        // long on opening.
        _btmSecondaryTransitionTimer = 1.5;
    }
}

// Sets the auto close timer for both the top and bottom 
// navigation button display. It will be called every time
// a page loads, and every time a window is opened. It takes
// in a variable to set either the top or bottom display timer.
function SetNavButtonDisplayWindowAutoTransitionTimer (_top)
{
    // If the top is callled...
    if(_top)
    {
        // The set the top auto close timer.
        _autoTopDisplayWindowTransitionTime = 3;
    }

    // If it's not the top...
    else if(!_top)
    {
        // Set the bottom auto close timer.
        _autoBtmDisplayWindowTransitionTime = 4;
    }
}


// !!! DRIVE FUNCTIONS !!! //
// Functions that are called through the SiteClockWorks.js to keep them
// updated on a specified time cycle.

// This function is designed to check if the displays are to transition
// and then all on the other functions to perform the tasks that make
// the effect on the screen. It is also the only function called through
// the SiteClockWorks.js. So it governs the timing of all related systems.
function ChangeSiteNavButtonDisplayWindowStatus ()
{
    // The auto close timers are called to
    // continously count down.
    RunDisplayAutoCloseTimer ();
    // The secondary or buffer timers are
    // also constantly called to count down.
    RunSecondaryTransitionTimer ();

    // The function is ran on two sets of nested conditionals, based on the two
    // variables that the entire system fluctuates on other than time. Whether
    // it's the top or bottom display being effected, and if it's to open or close.

// ****** TOP DISPLAY ******

    // If open, but set top be closed...
    if(!_topClosed && _topSetToClose)
    {
        // If the top buttons are not currently faded and they're not set to fade...
        if(!_currTopButtonsFaded && !_setTopButtonsToFade)
        {
	        // Then set them to fade out.
            _setTopButtonsToFade =  true;
        }
	
	    // But if the top buttons are not currently faded and they are set to fade...
        else if(!_currTopButtonsFaded && _setTopButtonsToFade)
        {
	        // Then call to fade the buttons out!
            FadeButtons ();
        }

        // Check the secondary transition timer to see if the display window should close.
        // If it's less than or equal to zero...
        if(_topSecondaryTransitionTimer <= 0)
        {
            // If the display window close timer is less than zero, the display is not currently closed and it is
            // not set to be closed...
            if(_currTopDisplayWindowCloseTime <= 0 && !_currTopDisplayWindowClosed && !_setTopDisplayWindowClosed)
            {
	            // Set the window to be closed,
                _setTopDisplayWindowClosed = true;
		        // Then call to set the transition timer to apply a smooth close effect.
                SetDisplayWindowTransitionTimer (true);
            }

	        // If the display window is not closed and it is set to be closed...
            if(!_currTopDisplayWindowClosed && _setTopDisplayWindowClosed)
            {
		        // Call to close the display window!
                TransitionDisplayWindows ();
            }

	        // But if the top display window is closed and is set to be closed...
            if(_currTopDisplayWindowClosed && _setTopDisplayWindowClosed)
            {
                // And, if the buttons in the display
                // are also currently faded...
                if(_currTopButtonsFaded)
                {
                    // Set the top display as currently closed.
                    _topClosed = true;
                }
            }
        }
    }

    // If the top display is currently closed, but set to not be closed...
    else if(_topClosed && !_topSetToClose)
    {
         // Confirm window itself is not open and is set to be.
         if( _currTopDisplayWindowClosed && _setTopDisplayWindowClosed)
        {
            // So it can be set to open.
            _setTopDisplayWindowClosed = false;
        }

        // If the window is close, but is set to be opened...
        else if(_currTopDisplayWindowClosed && !_setTopDisplayWindowClosed)
        {
            // Call to open the display window.
            TransitionDisplayWindows ();
        }

        // But if the top window is not currently close, and not set to be...
        else if(!_currTopDisplayWindowClosed && !_setTopDisplayWindowClosed)
        {
            // And, the top buttons are not visable...
            if(!_currTopButtonsFaded)
            {
                // The top display is open.
                _topClosed = false;
            }
        }

         // Since the buttons need to wait until the display window is open
         // before they fade in, the secondary transition timer is checked to 
         // see if it is less than or equal to zero. If so...
         if(_topSecondaryTransitionTimer <= 0)
         {
             // Then if top button fade timer is less than or equal to zero, the top
             // button are currently faded out, and they are not set to fade in...
            if(_currTopButtonFadeTime <= 0 && _currTopButtonsFaded && _setTopButtonsToFade)
            {
                // Set them to fade in,
                _setTopButtonsToFade = false;
                // And call to set the button transiton timer.
                SetDisplayButtonsTransitionTimer (true);
            }

            // If the buttons are currently faded out, and they are not set to be faded out...
            if(_currTopButtonsFaded && !_setTopButtonsToFade)
            {
                // Call to fade them in.
                FadeButtons ();
            }
    
            // If the top buttons are not currently faded, and they are not set to be faded...
            else if(!_currTopButtonsFaded && !_setTopButtonsToFade)
            {
                // Call to set auto close timer.
                SetNavButtonDisplayWindowAutoTransitionTimer (true);
            }
        }
    }


// ****** BOTTOM DISPLAY ******
// The bottom display is ran exactly the same as the top. It just runs through
// the variables specific to the effects of the bottom display.
    
    if(!_btmClosed && _btmSetToClose)
    {
        if(!_currBtmButtonsFaded && !_setBtmButtonsToFade)
        {
            _setBtmButtonsToFade =  true;
        }
	
        else if(!_currBtmButtonsFaded && _setBtmButtonsToFade)
        {
            FadeButtons ();
        }

        if(_btmSecondaryTransitionTimer <= 0)
        {
            if(_currBtmDisplayWindowCloseTime <= 0 && !_currBtmDisplayWindowClosed && !_setBtmDisplayWindowClosed)
            {
                _setBtmDisplayWindowClosed = true;
               
                SetDisplayWindowTransitionTimer (false);
            }

            if(!_currBtmDisplayWindowClosed && _setBtmDisplayWindowClosed)
            {
                TransitionDisplayWindows ();
            }

            if(_currBtmDisplayWindowClosed && _setBtmDisplayWindowClosed)
            {
                if(_currBtmButtonsFaded)
                {
                    _btmClosed = true;
                }
            }
        }
    }

    else if(_btmClosed && !_btmSetToClose)
    {
        if( _currBtmDisplayWindowClosed && _setBtmDisplayWindowClosed)
        {
            _setBtmDisplayWindowClosed = false;
        }

        else if(_currBtmDisplayWindowClosed && !_setBtmDisplayWindowClosed)
        {
            TransitionDisplayWindows ();
        }

        else if(!_currBtmDisplayWindowClosed && !_setBtmDisplayWindowClosed)
        {
            if(!_currBtmButtonsFaded)
            {
                _btmClosed = false;
            }
        }
  
        if(_btmSecondaryTransitionTimer <= 0)
        {
            if(_currBtmButtonFadeTime  <= 0 && _currBtmButtonsFaded && _setBtmButtonsToFade)
            {
                _setBtmButtonsToFade = false;
        
                SetDisplayButtonsTransitionTimer (false);
            }

            if(_currBtmButtonsFaded && !_setBtmButtonsToFade)
            {
                FadeButtons ();
            }
    
            else if(!_currBtmButtonsFaded && !_setBtmButtonsToFade)
            {
                SetNavButtonDisplayWindowAutoTransitionTimer (false);
            }
        }
    }
}

// !!!! Here the two timers at the top 
// of the above function are ran. !!!!

// This function handles the counted down
// of the display auto close timers.
function RunDisplayAutoCloseTimer ()
{
    // If the top auto close timer is greater than zero...
    if(_autoTopDisplayWindowTransitionTime > 0)
    {
        // Reduce the timer by the effects timing incrementation.
        _autoTopDisplayWindowTransitionTime -= _effectTimeIncrementation;
    }
    // If the timer is less than or equal to zero, 
    // and the top display is not closed...
    if(_autoTopDisplayWindowTransitionTime <= 0 && !_topClosed)
    {
        // Call to tell the top display to close.
        ToggleButtonDisplayStatus (true);
    }

    // Like the top, if the bottom auto close timer is greater than zero...
    if(_autoBtmDisplayWindowTransitionTime > 0)
    {
        // Reduce the timer by the effects timing incrementation.
        _autoBtmDisplayWindowTransitionTime -= _effectTimeIncrementation;
    }
    // If though, the timer is less than or equal to zero,
    // and the bottom display is not closed...
    if(_autoBtmDisplayWindowTransitionTime <= 0 && !_btmClosed)
    {
        // Call to close the bottom display.
        ToggleButtonDisplayStatus (false);
    }
}

// This function runs the secondary, or buffer timers between
// the two stages of the opening and closing effects.
function RunSecondaryTransitionTimer ()
{
    // If the top secondary timer is greater than zero...
    if(_topSecondaryTransitionTimer > 0)
    {
        // Reduce the timer by the effects timing incrementation.
        _topSecondaryTransitionTimer -= _effectTimeIncrementation;
    }

    // If the bottom secondary timer is greater than zero...
    if(_btmSecondaryTransitionTimer > 0)
    {
        // Reduce the timer by the effects timing incrementation.
        _btmSecondaryTransitionTimer -= _effectTimeIncrementation;
    }
}

// ****** !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ****** //


// !!****** Nav Button Display Behavior System: Display Window Ops Section ******!! // 
// In this section, the window displays that hold that navigation buttons undergo
// their transitions from open to closed, and closed to open.

// Sets the page element set as the top display that will be effected in this script.
var topButtonDisplay = document.getElementById("previewPageNavButtonDisplay");

// The amount of pixels the top display window will extent to when open. 
const _topNavButtonDisplayWindowOpenHeight = 175;
// Designated amount of time to allow the display window to open and close. 
const _topDisplayWindowCloseTime = 0.3;
// Determines if the top display is currently faded out or not. 
var _currTopDisplayWindowClosed = false;
// Determines if the top display window is desired open or closed.
var _setTopDisplayWindowClosed = false;
// Amount of time the top display has before its transition is complete.
var _currTopDisplayWindowCloseTime = 0;


// Sets the page element set as the top display that will be effected in this script.
var btmButtonDisplay = document.getElementById("professionalDocumentationPageNavButtonDisplay");

// The amount of pixels the bottom display window will extent to when open. 
const _btmNavButtonDisplayWindowOpenHeight = 75;
// Designated amount of time to allow the bottom display window to open and close. 
const _btmDisplayWindowCloseTime = 0.3;
// Determines if the bottom display is currently faded out or not. 
var _currBtmDisplayWindowClosed = false;
// Determines if the bottom display window is desired open or closed.
var _setBtmDisplayWindowClosed = false;
// Amount of time the bottom display has before its transition is complete.
var _currBtmDisplayWindowCloseTime = 0;

// In this function where the window transitions occur.
function TransitionDisplayWindows ()
{

    // *************************************************** TOP *******************************************************
	// Like in the above, the function is split between processing the top transition and
	// processing the bottom transition. That way the view can do them independently or at
	// the same time.
    
	// If the top display is set to close, the current timer is greater than zero, and the window
	// is not currently closed...
    if(_setTopDisplayWindowClosed && _currTopDisplayWindowCloseTime > 0 && !_currTopDisplayWindowClosed)
    {
	    // Reduce its timer by the system incrementation.
        _currTopDisplayWindowCloseTime -= _effectTimeIncrementation;

        // To set the current window height, a percentage variable is created by dividing the 
        // current amount of time on the transition timer by the total amount of time it takes
        // the window to do a complete transition.
        percentageOfTransition = _currTopDisplayWindowCloseTime / _topDisplayWindowCloseTime;

        // Another variable is created to specify the height of the window as it transitions by
        // multiplying the height of the window when it's open by the percentage of the transition
        // created above.
        newDisplayHeight = _topNavButtonDisplayWindowOpenHeight * percentageOfTransition;

        // The new height goes through a quick check
        // to make sure it doesn't resize outside the
        // desired scales. So, if the new window height
        // is ever less than zero...
        if(newDisplayHeight < 0)
        {
		    // Then set it to zero.
            newDisplayHeight = 0;
        }

        // But if the height is ever greater than the height is designed
        // to be when open...
        else if(newDisplayHeight > _topNavButtonDisplayWindowOpenHeight)
        {
		    // Set the height to the designed open height.
            newDisplayHeight = _topNavButtonDisplayWindowOpenHeight;
        }

        // One last variable is created as the attribute in the css requires
        // a string as its value. So the current height is cast to a string
        // and connected to the scaling unit to set the height in, which is
        // in pixels.
        currTopDisplayHeight = String(newDisplayHeight) + "px";

        // The html element is then effected by the cast value above.
        topButtonDisplay.style.height = currTopDisplayHeight;
    }

	// Or if the window is set to close, the timer is less than or equal to zero and the window 
	// is not currently closed...
    else if(_setTopDisplayWindowClosed && _currTopDisplayWindowCloseTime <= 0 && !_currTopDisplayWindowClosed)
    {
	    // Set the window elements padding to zero.
        topButtonDisplay.style.padding = "0";
	    // Set the windows height to zero.
        topButtonDisplay.style.height = "0";
	    // Set the window as being currently closed.
        _currTopDisplayWindowClosed = true;

        // Tell the whole system that the
        // top window is closed and the 
        // buttons have been faded.
        _topClosed = true;
    }

	// But if the is not set to be closed, the timer is greater than zero and the window 
	// is not currently closed...
    else if(!_setTopDisplayWindowClosed && _currTopDisplayWindowCloseTime > 0 && _currTopDisplayWindowClosed)
    {
	    // Reduce its timer by the system incrementation.
        _currTopDisplayWindowCloseTime -= _effectTimeIncrementation;

        // Create the percentage that will now open the window by taking 1 and reducing it by
        // the current amount of time left on the transition timer divided by the total amount
        // of time to make the whole transition.
        percentageOfTransition = 1-(_currTopDisplayWindowCloseTime / _topDisplayWindowCloseTime);
        // Then the new height value is created as the total window height when open is multiplied
        // by the percentage set above.
        newDisplayHeight = _topNavButtonDisplayWindowOpenHeight * percentageOfTransition;

        // The new height is ran through another check
        // to first make sure that if the value is
        // ever less than zero...
        if(newDisplayHeight < 0)
        {
		    // Then the new height is zero.
            newDisplayHeight = 0;
        }

        // But if the height is ever greater than the designed height
        // when open...
        else if(newDisplayHeight > _topNavButtonDisplayWindowOpenHeight)
        {
		    // The new height is set to the designed height.
            newDisplayHeight = _topNavButtonDisplayWindowOpenHeight;
        }

        // Same as before, the value of the height must be a string.
        // So the new height is cast to a string variable and attached
        // to a string depicting the unit of measure needed for the css.
        currTopDisplayHeight = String(newDisplayHeight) + "px";

        // Then the html element is effected by the 
	    // current height value.
        topButtonDisplay.style.height = currTopDisplayHeight;
    }

	// Lastly, if the the window is not set to be closed, the transition timer is less than or equal to
	// zero and the window is not currently closed...
    else if(!_setTopDisplayWindowClosed && _currTopDisplayWindowCloseTime <= 0 && _currTopDisplayWindowClosed)
    {
        // Set the html's designed padding values.
        topButtonDisplay.style.padding = "5px 0 0";

        // Set the window as currently not closed.
        _currTopDisplayWindowClosed = false;
    }


    // *************************************************** BOTTOM *******************************************************
	// The second half of the function is the same as the first. Only handling the transition of
	// the bottom display window through its specific variables.

    if(_setBtmDisplayWindowClosed && _currBtmDisplayWindowCloseTime > 0 && !_currBtmDisplayWindowClosed)
    {
        _currBtmDisplayWindowCloseTime -= _effectTimeIncrementation;

        percentageOfTransition = _currBtmDisplayWindowCloseTime / _btmDisplayWindowCloseTime;

        newDisplayHeight = _btmNavButtonDisplayWindowOpenHeight * percentageOfTransition;

        if(newDisplayHeight < 0)
        {
            newDisplayHeight = 0;
        }

        else if(newDisplayHeight > _btmNavButtonDisplayWindowOpenHeight)
        {
            newDisplayHeight = _btmNavButtonDisplayWindowOpenHeight;
        }

        currBtmDisplayHeight = String(newDisplayHeight) + "px";
        
        btmButtonDisplay.style.height = currBtmDisplayHeight;
    }

    else if(_setBtmDisplayWindowClosed && _currBtmDisplayWindowCloseTime <= 0 && !_currBtmDisplayWindowClosed)
    {
        btmButtonDisplay.style.padding = "0";
        btmButtonDisplay.style.height = "0";
        _currBtmDisplayWindowClosed = true;

        _btmClosed = true;
    }

    else if(!_setBtmDisplayWindowClosed && _currBtmDisplayWindowCloseTime > 0 && _currBtmDisplayWindowClosed)
    {
        _currBtmDisplayWindowCloseTime -= _effectTimeIncrementation;

        percentageOfTransition = 1-(_currBtmDisplayWindowCloseTime / _btmDisplayWindowCloseTime);

        newDisplayHeight = _btmNavButtonDisplayWindowOpenHeight * percentageOfTransition;

        if(newDisplayHeight < 0)
        {
            newDisplayHeight = 0;
        }

        else if(newDisplayHeight > _btmNavButtonDisplayWindowOpenHeight)
        {
            newDisplayHeight = _btmNavButtonDisplayWindowOpenHeight;
        }

        currBtmDisplayHeight = String(newDisplayHeight) + "px";
        
        btmButtonDisplay.style.height = currBtmDisplayHeight;
    }

    else if(!_setBtmDisplayWindowClosed && _currBtmDisplayWindowCloseTime <= 0 && _currBtmDisplayWindowClosed)
    {
	    btmButtonDisplay.style.padding = "5px 0 0";

        _currBtmDisplayWindowClosed = false;
    }
}



// !!****** Nav Button Display Behavior System: Display Buttons Ops Section ******!! // 
// This section handles the effects of the navigation buttons. Like the window displays
// the following variables are used to set and effect the specific properties in a 
// designed fashion.


// Sets the page element set as the top display that will be effected in this script.
var topButtons = document.getElementsByClassName("navButton_Header");

// Designated amount of time to allow the display window to open and close. 
const _topButtonFadeTime = 0.4;
// Determines if the top display is currently faded out or not. 
var _currTopButtonsFaded = false;
// Determines if the top display window is desired open or closed.
var _setTopButtonsToFade = false;
// Amount of time the top display has before its transition is complete.
var _currTopButtonFadeTime = 0;

// Sets the page element set as the top display that will be effected in this script.
var btmButtons = document.getElementsByClassName("navButton_Footer");

// Designated amount of time to allow the bottom display window to open and close. 
const _btmButtonFadeTime = 0.3;
// Determines if the bottom display is currently faded out or not. 
var _currBtmButtonsFaded = false;
// Determines if the bottom display window is desired open or closed.
var _setBtmButtonsToFade = false;
// Amount of time the bottom display has before its transition is complete.
// Amount of time the top display has before its transition is complete.
var _currBtmButtonFadeTime = 0;

// This is the function that is called to faded the 
// buttons in and out.
function FadeButtons ()
{
    // *************************************************** TOP *******************************************************
	// Same as the previous functions, this is split between the top and bottom
	// button processing.

	// If the top buttons are set to be faded, the fade timer is greater than zero and
	// the buttons are not currently faded...
    if(_setTopButtonsToFade && _currTopButtonFadeTime > 0 && !_currTopButtonsFaded)
    {
	    // Reduce the fade timer be the system incrementation.
        _currTopButtonFadeTime -= _effectTimeIncrementation;

        // Create the percentage to set the fading value at by dividing the
        // current fade time by the total amount of time to complete a fade.
        percentageOfButtonFade = _currTopButtonFadeTime / _topButtonFadeTime;

        // Then the html elements are effect in mass though
        // a for loop that will run until all the buttons
        // in the class array have been effected.
        var i;
        for (i = 0; i < topButtons.length; i++) 
        {
            // All the buttons of the top navigation button
            // display have their opacity value set to the
            // fade percentage created above.
            topButtons[i].style.opacity = percentageOfButtonFade;
        };
    }

	// However, if the buttons are set to be faded, the fade timer is less than or equal
	// to zero and the buttons are not currently faded...
    else if(_setTopButtonsToFade && _currTopButtonFadeTime <= 0 && !_currTopButtonsFaded)
    {
        // Run each of the html button elements
	    // through a for loop. 
        var i;
        for (i = 0; i < topButtons.length; i++) 
        {
            // Set each of their display
            // value to 'none'.
            topButtons[i].style.display = "none";
        };

	    // Set the buttons as currently faded out.
        _currTopButtonsFaded = true;
    }

	// But if the button are not set to be faded, the current fade time is greater 
	// zero and the button are currently faded out...
    else if(!_setTopButtonsToFade && _currTopButtonFadeTime > 0 && _currTopButtonsFaded)
    {
	    // Pass them through yet another for loop to...
        var i;
        for (i = 0; i < topButtons.length; i++) 
        {
		    // Set their display value back to an 'inline-block'.
            topButtons[i].style.display = "inline-block";
        };

	    // Reduce the fade timer by the designed incrementation.
        _currTopButtonFadeTime -= _effectTimeIncrementation;

        // Create the value to set the buttons fade as by taking 1 and reducing by the
        // current fade time divided by the total amount of time it take to complete
        // a whole fade effect.
        percentageOfButtonFade = 1-(_currTopButtonFadeTime / _topButtonFadeTime);

        // Then one last time pass the buttons through
        // a for loop to...
        var i;
        for (i = 0; i < topButtons.length; i++) 
        {
		    // Set their opacity values as the percentage created above.
            topButtons[i].style.opacity = percentageOfButtonFade;
        };
    }

	// And lastly, if the buttons are not set to be faded, the fade timer is less than
	// or equal to zero and the buttons are currently faded...
    else if(!_setTopButtonsToFade && _currTopButtonFadeTime <= 0 && _currTopButtonsFaded)
    {
	    // Set the buttons as not currently faded.
        _currTopButtonsFaded = false;
    }

    // *************************************************** BOTTOM *******************************************************
	// Just like all the rest, all else below is the same as above. Only different variables are used to
	// effect the bottom navigation buttons instead of the top ones.
	
    if(_setBtmButtonsToFade && _currBtmButtonFadeTime > 0 && !_currBtmButtonsFaded)
    {
        _currBtmButtonFadeTime -= _effectTimeIncrementation;

        percentageOfButtonFade = _currBtmButtonFadeTime / _btmButtonFadeTime;

        var i;
        for (i = 0; i < btmButtons.length; i++) 
        {
            btmButtons[i].style.opacity = percentageOfButtonFade;
        };
    }

    else if(_setBtmButtonsToFade && _currBtmButtonFadeTime <= 0 && !_currBtmButtonsFaded)
    {
        var i;
        for (i = 0; i < btmButtons.length; i++) 
        {
            btmButtons[i].style.display = "none";
        };

        _currBtmButtonsFaded = true;
    }

    else if(!_setBtmButtonsToFade && _currBtmButtonFadeTime > 0 && _currBtmButtonsFaded)
    {
        var i;
        for (i = 0; i < btmButtons.length; i++) 
        {
            btmButtons[i].style.display = "inline-block";
        };

        _currBtmButtonFadeTime -= _effectTimeIncrementation;

        percentageOfButtonFade = 1-(_currBtmButtonFadeTime / _btmButtonFadeTime);

        var i;
        for (i = 0; i < btmButtons.length; i++) 
        {
            btmButtons[i].style.opacity = percentageOfButtonFade;
        };
    }

    else if(!_setBtmButtonsToFade && _currBtmButtonFadeTime <= 0 && _currBtmButtonsFaded)
    {
        _currBtmButtonsFaded = false;
    }
}

