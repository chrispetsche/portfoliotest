// Author: Chris Petsche
// Artist Designer and Developer Portfolio
// DisplayExtendedSummaryBehavior.js
// Version: 3.7.9
// Updated: 24 Nov 2019 

// The opening and closing of each display extended summary is ran through this script.
// After designing and coding the NavButtonDisplayBehavior.js, the idea came to use the
// same general idea to give the viewer more content on any project containing an extented 
// summary if they'd like just a little bit detail before viewing the full project through
// the VIEW PROJECT button within all displays. Each display will send in its ID, and then 
// the system will be set based on whether or not there is a display currently open, and if 
// so compare its ID to the new one being sent in. If there is one open and it's not a match,
// close it out as an old display and then set a new display to open with the parameters of 
// the ID sent.

// This current version is to test the initial toggle logic for the system, to set the objects
// that will feed the functional variables of both the opening and closing operations.

// Basic concept goes:
//  - If the view calls in to toggle a display, it sends in the ID of the display
//      - If the ID is the same as a current open display
//          - Use the ID to set the old display parameters
//          - Reset the parameters for a new  display to be opened
//          - Then execute the closing of the window that's open.
//      - If though, the ID being sent in does not match
//          - If the current value of the new display ID is not 'Empty' or null
//              - Use the ID current in the new display to set the old display parameters
//              and execute its closing operations.
//              - The set the new display parameters of the ID being sent in and open the 
//              display a viewer wishes to see. 
//          - But if the current value of the new display ID is 'Empty' or null
//              - Use the ID being sent in to set the new display parameters and open the display. 


// !!****** Display Extended Summary System: Display Toggle and Reset Section ******!! //
// In this section, the viewer is able ot call in and set off the effects of one to two
// displays. It contains a small list of needed variables and two functions. One for the
// toggling, and the other to reset the new display window object below. 

// When a viewer calls in to have a display transitioned, the toggle function below will
// check its ID against the value of this variable. By default it's set to 'Empty' per
// the system design requirements.
var _newDisplayWindowId = "Empty";

// This is one of two object variables the behavior system uses to open and close displays.
// The new display is factored in to be the opening display. It will hold all the information
// to perform the task as it is called on in the operations functions to come. 
var _newDisplayWindow;
// When the operations functions run their checks to perform certain tasks, each display has
// two variables that lets the system know, first: if the new display window object is currently
// open or not. By default all displays are closed. So this variable is preset to false.
var _newDisplayWindowOpen = false;
// Second: the system needs to know if the display is even set to open at all. Since all displays
// are closed by default and the viewer hasn't yet been able to open one, this variable is also
// preset to false.
var _setOpenNewDisplayWindow = false;

// Since the new display is seen as the opening object, the old is the closing. And therefore
// hold the closing information.
var _oldDisplayWindow;
// Like the display check variable in the new display case, this will let the system know that
// the old display is not currently closed. 
var _oldDisplayWindowClosed = false;
// And this same goes for letting the system know that the display is not set to be closed, yet.
var _setCloseOldDisplayWindow = false;

// This is the toggle function that viewers will call through the toggle buttons in the displays.
// As described, the toggle button sends in the ID of the extended display it is to toggle, and 
// that ID is ran through a series of checks to determine the behavior that is to happen.
function ToggleDisplayExtendedSummaryWindow (_displayId)
{
    // If the ID being passed in is equal to the ID current set in the new display object...
    if(_displayId == _newDisplayWindowId)
    {
        // Then the display is already opend, so use the ID being passed in to set the old display 
        // for closing.
        _oldDisplayWindow = DisplayExtentedSummaryToTransition (_displayId);
        
        // Set old display to be closed...
        _setCloseOldDisplayWindow = true;
        // Reset the old display window to not closed as it may have changed
        // during the processing to come...
	    _oldDisplayWindowClosed = false;
        // And call to set the timers for the first apart of the closing effect.
        InitiateEffectTimers (false, true);
        
        // Then call to reset the new display and ready it for another call.
        ResetNewDisplayWindowParameters ();
        // Lastly, to finalize the reset, set the new display window to not open.
	    _newDisplayWindowOpen = false;
    }

    // If the ID being passed in is not equal to the ID currently set in the new display...
    else if(_displayId != _newDisplayWindowId)
    {
        // And the currently set ID is not equal to 'Empty' or null...
        if(_newDisplayWindowId != "Empty" && _newDisplayWindowId != null)
        {
            // Another display must be open. So, use its ID to set the old display for closing.
            _oldDisplayWindow = DisplayExtentedSummaryToTransition (_newDisplayWindowId);

            // Set old display to close
            _setCloseOldDisplayWindow = true;
            // Make sure the system knows it's not currently closed
	        _oldDisplayWindowClosed = false;
            // And then, set the timers for the first part of the closing effect.
            InitiateEffectTimers (false, true);

            // The new display ID can now be set as the ID being passed in and...
            _newDisplayWindowId = _displayId;
            // the new display object can be set for opening.
            _newDisplayWindow = DisplayExtentedSummaryToTransition (_newDisplayWindowId);
            
            // Set new display to open
            _setOpenNewDisplayWindow = true;
            // Let the system know that the display is not currently open
	        _newDisplayWindowOpen = false;
            // Then, set the timers for the first stage of the opening effects. 
            InitiateEffectTimers (true, true);
        }

        // But should the ID currently set in the new object be equal to 'Empty' or null...
        else if(_newDisplayWindowId == "Empty" || _newDisplayWindowId == null)
        {
            // Then no displays are currently open and the new display ID can be set to 
            // the ID being passed in, and then...
            _newDisplayWindowId = _displayId;
            // the new display object is set to open.
            _newDisplayWindow = DisplayExtentedSummaryToTransition (_newDisplayWindowId);
            
            // Set new display to open
            _setOpenNewDisplayWindow = true;
            // Again, let the system know the display is not currently open...
	        _newDisplayWindowOpen = false;
            // And set the first stage timers.
            InitiateEffectTimers (true, true);
        }
    }
}

// When the new display object is called to be reset, this is the function that handles the process.
function ResetNewDisplayWindowParameters ()
{
    // The new display object is set to be the first object in the list with the "empty" variables.
    _newDisplayWindow = DisplayExtentedSummaryToTransition ('ResetNewDisplayObject');
    // Then the new display's ID is reset to the default 'Empty'.
    _newDisplayWindowId = _newDisplayWindow.resetNewID;
}


// !!****** Display Extended Summary System: Display Toggle and Reset Section ******!! //
// This section of the script handles the input from the viewer when they want to change
// the status of the extended displays. It also handles resetting the object values after
// the new display is closed.

// This is the timer that will be used
// to fade the display content in.
var newContentFadeTimer = 0;
// This is the timer used to open an
// extended summary display.
var newWindowTransitonTimer = 0;
// This is the total amount of time it
// takes for the new display window to
// do its transition from closed to open.
var totalOpeningTimer = 0;
// This will be the height of the new
// display when open.
var openHeight = 0;

// This is the timer used to fade the
// content of an old summary display
// when closing it.
var oldContentFadeTimer = 0;
// This is the timer used to transition
// an old display closed.
var oldWindowTransitonTimer = 0;
// This is the total amount of time needed
// for an old summary display to close.
var totalClosingTimer = 0;
// The height of a display when closed.
var closingHeight = 0;

// As some things are oddly compressed at smaller screen
// sizes, this function checks the limits of that compression
// in order to scale the display height to the proper size. 
// It takes in two variables that says whether it's a new or
// old display, and which display it is calling.
function WindowDisplayHeight (_new, _display)
{
    // The upper limit is the screen size
	// that determines if the device
	// the viewer is using is a mobile.
	// It's at this value that the odd
	// compressing begins.
    upperScreenLimit = 470;
    // Every 50 pixels the display window needs
	// to be adjusted to hold the content.
	// A mid range is set here.
    midScreenLimit = upperScreenLimit - 50;
    // A minimal limit is set so that the viewer
	// will eventually be told that if they
	// are trying to view on a device with a
	// smaller screen than this value, it
	// won't work for them.
    minimalScreenLimit = upperScreenLimit - 100;

    // If it's a new display calling in...
    if(_new)
    {
        // Set the open height to zero.
        openHeight = 0;
    }
    
    // But if it's an old display calling...
    else if(!_new)
    {
        // Set the closing height to zero.
        closingHeight = 0;
    }

    // Create a variable to determine the current screen width.
    currentScreenWidth = screen.width;

    // And check the screen width against the above limits.
	// If the current screen width is greater than the
	// upper limit...
    if(currentScreenWidth > upperScreenLimit)
    {
        //  Then just set the open height to the 
	    // displays designed non-mobile value and 
	    // return that value.
	    return _display.displayOpenHeight;
    }

    // But if the current screen width is less than the upper limit and still greater than
	// or equal to the mid range value...
    else if(currentScreenWidth < upperScreenLimit && currentScreenWidth >= midScreenLimit)
    {
        // Create a value to set the new height to the 
	    // designed non-mobile height plus 24 pixels.
        newHeight = _display.displayOpenHeight + 24;

        // Then return the new height value.
        return newHeight;
    }

    // Or if the current screen width is less than the mid range value and still greater than
	// or equal to the minimal...
    else if(currentScreenWidth < midScreenLimit && currentScreenWidth >= minimalScreenLimit)
    {
        // Create a value to set the new height to the 
	    // designed non-mobile height plus 48 pixels.
        newHeight = _display.displayOpenHeight + 48;

        // Then return the new height value.
        return newHeight;
    }

    // But should the current screen width be less than the minimal limit...
    else if(currentScreenWidth < minimalScreenLimit)
    {
	    // Let the viewer know that the content cannot be opened.
	    console.log ("This scaling is not available! Larger screen size is required!!!!");
    }
}

// This function is used to set the timers used to open and close the displays, 
// as well as fade their content in and out. It takes two variables to check if
// it's a new display, and which timer is to be set. The first stage or second.
function InitiateEffectTimers (_new, _firstStage)
{
    // If it's a new display...
    if(_new)
    {
        // And if the new display window is set to be open and the window
	    // is not open...
        if(_setOpenNewDisplayWindow && !_newDisplayWindowOpen)
        {
            // And the system is requesting the first
		    // stage be set...
            if(_firstStage)
            {
                // Set the open window height to be the new display height.
                openHeight = WindowDisplayHeight (true, _newDisplayWindow);
                // The new window timer is set to the window transition timer.
                newWindowTransitonTimer = _windowTransitonTime;
                // And the total amount of time to make the entire transition
		        // is set to equal the content fade time plus the window 
		        // transition time of the new window.
                totalOpeningTimer = _contentFadeTime + newWindowTransitonTimer;
            }

            // But if it's not calling for the first stage...
            else if(!_firstStage)
            {
                // The new content fade timer is set to 
		        // the content fade time designed for 
		        // the system.
                newContentFadeTimer = _contentFadeTime;
            }
        }
    }

    // If the display is not new, however...
    else if(!_new)
    {
        // And the old display is set to be closed 
	    // and is not currently closed...
        if(_setCloseOldDisplayWindow && !_oldDisplayWindowClosed)
        {
            // If the system is calling 
		        // for the first stage...
            if(_firstStage)
            {
                // Set the old content fade timer to the 
		        // system designed content fade time.
                oldContentFadeTimer = _contentFadeTime;
                // And set the total closing timer to the content fade time
		        // plus the window transition time.
                totalClosingTimer = _contentFadeTime + _windowTransitonTime;
            }

            // But if not calling for the first stage...
            else if(!_firstStage)
            {
                // Set the closing display height
		        // to the old window closed height.
                closingHeight = WindowDisplayHeight (false, _oldDisplayWindow);
                // Set the old display transition timer to 
		        // the window transition time.
                oldWindowTransitonTimer = _windowTransitonTime;
            }
        }
    }
}


// !!****** Extended Summary Display : Ops Section ******!! //
// All the effects of the extended summary displays will be
// processed below.

// This is the only function of this behavior that is called from
// the SiteClockWorks.js script so that it's updated according to
// the designed time intervals. 
function ChangeDisplayExtendedWindowStatus ()
{
    // The function to run all the 
	// behavior related timer is called.
    RunSystemTimers ();

// *********************** New Displays *******************************
// The processes of this function are split between new displays and old
// ones. They can run at the same time, but do slightly different thigs
// as a new display is consider as one that is to open, and an old one
// is to close. Even though the general effects are the same but in 
// opposition to each other, the two stages they undergo happen at
// different times. The new opens then display window and then fades the
// buttons into view.

    // If the new display window is set to be opened, the window is not currently open
    // and the total opening timer is greater than zero...
    if(_setOpenNewDisplayWindow && !_newDisplayWindowOpen && totalOpeningTimer > 0)
    {
        // If the new window transition timer is greater than zero...
        if(newWindowTransitonTimer > 0)
        {
            // Create a percentage for the current transition value by taking 1 and
            // reducing it bey the value of the transition timer dividied by the 
            // amount of time it takes to transition the display open.
            percentageOfTransition = 1-(newWindowTransitonTimer / _windowTransitonTime);

            // Then create a variable for the height to set the display
            // at as it opens by multiplying the displays open height value
            // by the percentage created above.
            newDisplayHeight = openHeight * percentageOfTransition;

            // Check the new height to see if it's
            // less than zero. If it is...
            if(newDisplayHeight < 0)
            {
                // Set the new display height to zero.
                newDisplayHeight = 0;
            }

            // However, if the new height is greater than
            // the designed height when open...
            else if(newDisplayHeight > openHeight)
            {
                // Then set the new display height to the
                // designed open height for the window.
                newDisplayHeight = openHeight;
            }

            // Create a variable to hold the value of the cast
            // new height joined with the unit of measure as a
            // string for the css.
            currTopDisplayHeight = String(newDisplayHeight) + "px";
            
            // Then effect the html element set by the new display object
            // by the current height value.
            document.getElementById(_newDisplayWindow.windowToTransition).style.height = currTopDisplayHeight;
	    }

        // But if the transition timer is less than or equal to zero...
        else if(newWindowTransitonTimer <= 0)
        {
            // If the new content fade timer is less than
            // or equal to zero...
            if(newContentFadeTimer <= 0)
            {
                // Call to set the second stage timers
                // for the new display.
                InitiateEffectTimers (true, false);
            }

            // But if the new content fade timer is
            // greater than zero...
	        else if(newContentFadeTimer > 0)
            {
                // Effect the html element set by the new display object
                // by setting its display attribute to 'inline-block'.
                document.getElementById(_newDisplayWindow.contentToFade).style.display = "inline-block";

                // Create a variable to hold the percentage value of the fading by taking
                // 1 and reducing it by the current content fade timer divided by the time
                // it takes to fade the content.
                percentageOfContentFaded = 1-(newContentFadeTimer / _contentFadeTime);
                // The effect the html elements opacity by applying the percentage created above.
                document.getElementById(_newDisplayWindow.contentToFade).style.opacity = percentageOfContentFaded;
            }
	    }
    }

    // But if the new display window is set to be opened, the window is not current open and
    // the total opening timer is less than or equal to zero...
    else if(_setOpenNewDisplayWindow && !_newDisplayWindowOpen && totalOpeningTimer <= 0)
    {
        // The new display window is now open.
        _newDisplayWindowOpen = true;
        // And it no longer needs to be set to
        // make the transition open.
        _setOpenNewDisplayWindow = false;
    }

// *********************** Old Displays *******************************
// As mentioned above, the new display opens the display window and then
// fades the buttons into view. But the old display must fade the buttons
// back out before the window display begins to close.

    // If the old display window is set to be closed, it is not yet closed and the
    // total closing timer is greater than zero...
    if(_setCloseOldDisplayWindow && !_oldDisplayWindowClosed && totalClosingTimer > 0)
    {
        // If the content fade timer is greater than zero...
        if(oldContentFadeTimer > 0)
        {
            // Create a variable to hold the percentage of the transition as 
            // the content fades out by dividing the old content fade timer by
            // the total content fade time.
            percentageOfContentFaded = oldContentFadeTimer / _contentFadeTime;
            // Then effect the html element, set by the old display object, by
            // applying the percentage created above to the the opacity attribute.
            document.getElementById(_oldDisplayWindow.contentToFade).style.opacity = percentageOfContentFaded;
        }

        // But if the old content fade timer is less than or equal to zero...
        else if(oldContentFadeTimer <= 0)
        {
            // Finish effecting the content by setting its display value to 'none'.
            document.getElementById(_oldDisplayWindow.contentToFade).style.display = "none";

            // If the old display window transition
            // timer is less than or equal to zero...
            if(oldWindowTransitonTimer <= 0)
            {
                // Call to set the second stage timers
                // for the old display window.
                InitiateEffectTimers (false, false);
            }

            // But if the old window transition timer
            // is greater than zero...
            else if(oldWindowTransitonTimer > 0)
            {
                // Create a variable to hold the percent value set by dividing the
                // old transition window transition timer by the time it takes to
                // transition the window.
                percentageOfTransition = oldWindowTransitonTimer / _windowTransitonTime;
        
                // Create a variable to hold the numerical value of the
                // display windows height as it transitions by multipling
                // the closing height of the old display by the percentage
                // set above.
                newDisplayHeight = closingHeight * percentageOfTransition;
        
                // Check the new height to see if the
                // value is less than zero...
                if(newDisplayHeight < 0)
                {
                    // Then the display height is zero.
                    newDisplayHeight = 0;
                }
        
                // But if the height is ever greater than zero...
                else if(newDisplayHeight > closingHeight)
                {
                    // The height is equal to the 
                    // designed closing height.
                    newDisplayHeight = closingHeight;
                }
        
                // Create a variable to hold the value of the new height
                // cast to a string and joined to the unit of measure
                // needed for the css.
                currTopDisplayHeight = String(newDisplayHeight) + "px";
                // Then effect the html element set by the old window object by
                // applying the value set in the string variable above.
                document.getElementById(_oldDisplayWindow.windowToTransition).style.height = currTopDisplayHeight;
            }
        }
    }

    // But should the old display be set to close, the display is not yet closed and the
    // total closing timer is less than or equal to zero...
    else if(_setCloseOldDisplayWindow && !_oldDisplayWindowClosed && totalClosingTimer <= 0)
    {
        // Set the old display window to closed.
        _oldDisplayWindowClosed = true;
        // Then the display no longer needs to be
        // set for closing.
        _setCloseOldDisplayWindow = false;
    }
}

// This function handles the counting down of 
// the applicable timers needed to run the 
// above effects.
function RunSystemTimers ()
{
// ******************** New Window Timers ******************** //

    // If the new content fade timer is greater than zero...
    if(newContentFadeTimer > 0)
    {
        // Reduce it by the designed incrementation value.
        newContentFadeTimer -= _effectTimeIncrementation;
    }

    // If the new window transition timer is greater than zero...
    if(newWindowTransitonTimer > 0)
    {
        // Reduce it by the designed incrementation value.
        newWindowTransitonTimer -= _effectTimeIncrementation;
    }

    // If the total opening timer is greater than zero...
    if(totalOpeningTimer > 0)
    {
        // Reduce it by the designed incrementation value.
        totalOpeningTimer  -= _effectTimeIncrementation;
    }

// ******************** Old Window Timers ******************** //

    // If the old content fade timer is greater than zero...
    if(oldContentFadeTimer > 0)
    {
        // Reduce it by the designed incrementation value.
        oldContentFadeTimer  -= _effectTimeIncrementation;
    }

    // If the old window transition timer is greater than zero...
    if(oldWindowTransitonTimer > 0)
    {
        // Reduce it by the designed incrementation value.
        oldWindowTransitonTimer  -= _effectTimeIncrementation;
    }

    // If the total closing timer is greater than zero...
    if(totalClosingTimer > 0)
    {
        // Reduce it by the designed incrementation value.
        totalClosingTimer  -= _effectTimeIncrementation;
    }
}
