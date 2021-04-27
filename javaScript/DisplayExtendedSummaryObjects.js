// Author: Chris Petsche
// Artist Designer and Developer Portfolio
// DisplayExtendedSummaryObjects.js
// Version: 2.4.3
// Updated: 24 Nov 2019

// This script handles all the objects containing the display information for the 
// display extended summaries. Since each one will be unique in size, and the design
// is to only ever have one extention open at a time, this script holds the unique 
// bits of information to make them open to the proper size, as well as close if the
// viewer wishes to open another summary elsewhere. Each object will be named for the 
// display it's responsible for, and then linked via the ID sent in through the
// DisplayExtendedSummaryBehavior.js script. 

// Basic concept goes:
//  - When the DisplayExtendedSummaryBehavior.js calls in with an ID, it gets passed
//  through a switch statement. 
//      - If there is an ID that matches, set the object associated with ID as the
//      html display object needed for either the opening or closing operations of the
//      behavior script.
//          - The script uses the 3 properties available in each object: contentToFade
//          and windowToTransition to set the ID's of the html elements to adjust, as
//          well as the displayOpenHeight to know how large the specific summary window
//          needs to be to show the display content. 

// After several test cases and design refinements, the properties of the objects of the 
// basic displays was narrowed quite a bit. Part of the testing revealed that the content
// fade time and the window transition time could be consistant across all objects. In more
// than one way, this should have been the original design. But, discovering what variables 
// are needed and where they are the most efficient are steps in the development of any 
// system design.
// This will be the amount of time set to fade the extended summary display content in or out.
const _contentFadeTime = 0.3;
// This will be the amount of time set to transition the display window open or closed.
const _windowTransitonTime = 0.5;

// !!****** Display Extended Summary System: Object Selection Section ******!! //


// This will be the variable temporarily used to set the object the display will use
// to filter in the proper operation variables to open and close each different display.
var displayExtendedSummaryObject;

// As described above, the system will use a function to pass in a specific ID to be matched.
function DisplayExtentedSummaryToTransition (_extSumId)
{
    // The ID is ran through the following switch statement to find the appropriate object
    // preloaded with the information the extended summary behavior script needs.
    switch (_extSumId)
    {
        // If the ID sent in is the same as the 'ResetNewDisplayObject' in the following
        // case check...
        case "ResetNewDisplayObject":
            // Set the object to be used as the extended summary object detailed below in
            // the Object Description Section.
            displayExtendedSummaryObject = extSummary0;
            break;
        
        // But if the ID is the same as the next case check...
        case "Project1":
            // Set the object to be used as the following object also detailed below.
            displayExtendedSummaryObject = extSummary1;
            break;

        case "Project2":
            
            displayExtendedSummaryObject = extSummary2;
            break;

        case "Project3":
            
            displayExtendedSummaryObject = extSummary3;
            break;

        // In the case that the ID matches none of the other ID's listed above...
        default:
            // Send a message to the console letting a viewer accessing it know that
            // the ID sent is not recognized. Logically meaning it has no object.
            console.log ("DISPLAY ID NOT RECOGNIZED");
    }

    // Once the object has been set, unless it triggers the default case, the function
    // returns the object to the behavior script for use.
    return displayExtendedSummaryObject;
}


// !!!!!! ****** Display Extended Summary System: Object Declaration Section ****** !!!!!! //
// The following are the objects that will be used by the DisplayExtendedSummaryBehavior.js.
// It's these that the switch statement sets as the object to be used by its caller. Each
// will have its own set of variables. The majority of the variables will be the same or similar,
// but carry different values for the general features or functions of the extended displays.
// However, like the first object in the list, there are some that container very different
// information for varying purposes. 

// As the first object in the list, this will be the default empty object. And it is literally
// empty other than the ID it returns when a display is reset through the behavior script.
var extSummary0 = {
    // The ID variable set to empty as needed in the behavior system.
    resetNewID : "Empty"
};


// This is the first actual object in the list. After testing, its name will reflect it ID.
// Each object, per the current design, will contain the following generic variables to 
// perform its effects.
var extSummary1 = {
    // The content to fade is the ID in the html that the behavior script will use to
    // fade all the content in the desired display in and out.
    contentToFade : "sectionDisplayExtendedContent_Experiences_Project1",
    // Like the content, the window to transition is the html ID used to shrink and expand
    // the desired extended summary window.
    windowToTransition : "sectionDisplayExtendedWindow_Experiences_Project1",
    // This is the height of the window when fully open on screens larger than 470 pixels.
    displayOpenHeight : 110,
};

// For testing purposes, a seconds object with different values is created to check how the
// desired behavior works between two displays.
var extSummary2 = {
    
    contentToFade : "sectionDisplayExtendedContent_Experiences_Project2",
    windowToTransition : "sectionDisplayExtendedWindow_Experiences_Project2",
    displayOpenHeight : 225,
};

// Like the second object, this third is for the purposes of testing. With this though, the
// intent is to see if the diplays with leapfrog as designed between 3 or more as the number
// of displays is obviously going to grown once the site content is loaded into them.
var extSummary3 = {
    
    contentToFade : "sectionDisplayExtendedContent_Experiences_Project3",
    windowToTransition : "sectionDisplayExtendedWindow_Experiences_Project3",
    displayOpenHeight : 225,
};