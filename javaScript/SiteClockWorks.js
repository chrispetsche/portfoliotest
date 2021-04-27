// Author: Chris Petsche
// Generic Site Script
// SiteClockWorks.js
// Version: 4.1
// Updated: 16 Nov 2019

// This script will be stored and versioned for all my web development projects until
// a better way of updating behaviors is discovered. For now though, it will be the
// first thing called when any page loads, and will continue running so that all the
// effects and time based elements of the site are updated according to their designs.
// Based on the current understanding of web timing, one can set whatever timing needed
// with a setInterval that plays on how many milli-seconds have passed since a date from 
// the 1970's, and divide by multiples of 10 for the milli to the whole second.
//
// Only the needed parts of timing will be ran, with the rest being commented out to make
// sure the sites performance remains efficient. It's very unlikely that every fraction of
// time below will be needed on a site.


// !!****** Site Clock Works: Common Timing Functions Section ******!! // 
// Below are the typical functions used in languages such as C# for updating code based
// on different intervals of time. In those languages, the actually timing of the computer
// is used instead of the date mentioned above. For every frame an individuals computer
// passes through, there are a variety of updates that can be preformed. But this system
// will use functions ran every second to every 10th, 100th, or 1000th of a second. And 
// They are named for their incrementation value. 
//
// Their purpose is only to keep the code readable and less confusing for clipping in function
// calls than it might be within the interval functions in the lower half of this script that
// drives them.
//
// Inside these functions are where the other scripts place their function calls depending
// on the interval they should be called at. Things like slideshows might be called per so
// many seconds, whereas an animation requires a faster update to make any on screen motion
// appear seamless and smooth. 


// All systems require a starting point. Anything behavior that needs to happen as soon as the 
// site launches is called through this function.
function OnStart()
{
	SetBackgroundVideoParameters ();

    // Both function calls below are what causes the navigation buttons at the top and bottom
    // of the page to close, so the viewer has more area to view.
    SetNavButtonDisplayWindowAutoTransitionTimer (true);
    SetNavButtonDisplayWindowAutoTransitionTimer (false);
}

// Anything that needs to be updated every second is called
// through this function. 
/*function Update() 
{
    
}*/

// Anything that needs to be updated every tenth of a second is 
// called through this function.
/*function UpdatePerTenth() 
{
    
}*/

// Anything that needs to be updated every hundredth of a second 
// is called through this function.
function UpdatePerHunth() 
{
    // Calls to operate the navigation buttons at the top and bottom of
    // the page, if they are to open or close.
    ChangeSiteNavButtonDisplayWindowStatus ();

    // Calls to operate the extented summary displays for the project
    // preview pages, should the viewer want to open or close some.
    ChangeDisplayExtendedWindowStatus ();
}

// Anything that needs to be updated every thousandth of a second 
// is called through this function.
/*function UpdatePerThouth() 
{
    
}*/

// !!****** Site Clock Works: Running Temporial Calculation Functions Section ******!! // 
// In this half of the script is the incremental timing functions. They are an interval
// set on a looping cycle that feeds off the date mentioned at the top of the script, and
// then incremented on a specific multiple of ten that results in the fraction of time
// since the viewer launched the site. Fractions that can obviously be very useful when
// being creative.

// Counts up per second, from 0. Tracking time since site launch.
// Also drives the standard update function.
/*function SiteTime() {
    const now = Date.now();
    const then = now + 1 * 1000;

    setInterval(() => {
        
        const secondsPassed = (Math.round ((then - Date.now()) / 1000)) * -1;
        // Since this function cycles per every whole second, it calls the 
        // basic update function above.
	    //Update();
        
    }, 1000);
}*/

// Counts up per tenth of a second, from 0. Tracking time since site launch.
// Also drives the tenth of a second update function.
/*function SiteTenthTime() {
    const now = Date.now();
    const then = now + 1 * 100;

    setInterval(() => {
        
        const secondsPassed = (Math.round ((then - Date.now()) / 100)) * -1;
        // Since this function cycles per every 10th of a second, it calls the 
        // per tenth update function above.
	    UpdatePerTenth();
        
    }, 100);
}*/

// Counts up per hundredth of a second, from 0. Tracking time since site launch.
// Also drives the hundredth of a second update function.
function SiteHunthTime() {
    const now = Date.now();
    const then = now + 1 * 10;

    setInterval(() => {
        
        const secondsPassed = (Math.round ((then - Date.now()) / 10)) * -1;
        // Since this function cycles per every 100th of a second, it calls the 
        // per hundredth update function above.
	    UpdatePerHunth();
        
    }, 10);
}

// Counts up per thousandth of a second, from 0. Tracking time since site launch.

// Also drives the thousandth of a second update function.
/*function SiteThouthTime() {
    const now = Date.now();
    const then = now + 1 * 1;

    setInterval(() => {
        
        const secondsPassed = (Math.round ((then - Date.now()) / 1)) * -1;
        // Since this function cycles per every 1000th of a second, it calls the 
        // per thousandth update function above.
	    UpdatePerThouth();
        
    }, 1);
}*/

// !!****** Site Clock Works: Site Behavior Ignition Section ******!! // 
// Similar to, but not the same as the OnStart function at the top of the script,
// the activation function below kicks everything off from the onload call within
// the html. As pointed out, the top half of the script is to easily clip in behavior
// calls without making the entire script messy and unreadable. There will never be
// any additons to the lower sections that drive the updates in the upper, as the
// intervals are the only calls made in the activation function below. Obviously it is
// also the only function that can never be commented out, or why have the script at all.
// But, each of the intervals that will not be used must be commmented out.

// Initiates all driving functions for the site.
function ActivateSiteBehavior ()
{
    OnStart ();
    //SiteTime ();
	//SiteTenthTime ();
	SiteHunthTime ();
	//SiteThouthTime ();
}

