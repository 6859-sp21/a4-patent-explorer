# Patent Explorer
Where do bright ideas come from?

Ashley Hartwell  
Bryan Wen Xi Ong  
Eamon Whalen
6.859 Interactive Data Visualization
April 16, 2021
Patent Explorer

[Webpage](https://6859-sp21.github.io/a4-patent-explorer/)


## Design Rationale
Overall visualization concept and data encoding
One question that was important to our team is the same one that we pose to the users upon visiting our website - Where do ideas come from? Of course there are many ways to answer this question but with respect to our dataset the answers fall on two axes; location and company. Furthermore, due to the global reach of innovation and multinational identity of many companies, a secondary question may be how are these companies producing ideas related and just how far is their intellectual reach. This led us to create an interactive visualization that examines the geospatial distribution of a selection of filed patents from the years 2015 - 2019. 

We used the analogy of bright ideas as patents on the map to bright lights on earth being viewed from space. Each patent is represented by a translucent yellow dot. This means that if there are multiple patents assigned to the same city, or longitude and latitude value, that space will appear darker than an area with only one patent assigned. 

### User Instructions
Upon loading the visualization the user is greeted with text instructions to learn how to  explore the data set. Initially the instructions disappeared when the user began interacting with the map via zoom or selection, but feedback we were given suggested that users may want to be reminded of the functionality. In the final version, instructions remain on the screen and zooming out to the original extent or panning allows the user to view them again. 
 
### Map interactions
The map interactions instituted are as follows; scroll to zoom, double click to zoom to selection, click and drag to pan, and hover to get more info on a particular data point. These interactions are common across many map based visualizations on the web and implementing them here takes advantage of prior knowledge that a user may have.

### Search Bar 
The search bar is displayed at the middle of the page with the instructions “type a company name” to allow users to see what patents on the map are associated with specific companies. The search bar autofills as you type, and also returns a message of no results if the company you are searching for is unavailable. When you have found the company you are looking for, clicking on the text, will highlight all the points from the company in the color orange on the map and enlarge them so that they stand out. Clicking the “x” near the text on the search bar clears the selection and allows the user to repeat this process. Originally the team had an idea that would allow users to click on a specific point on the map and then show a linked node network between the patent associated with that point, and others with the same company name. Upon further reflection it was decided that this would not only provide visual clutter, but perhaps wouldn’t be the most useful way for users to interact with the set. During our peer critique we saw some teams utilize a search bar function effectively and decided it would fit the needs of this project

### Year Slider
Not only was the data in this set geo-spatial, but it was also temporal. One challenge of working with a data set of this size is the tradeoff between the amount of information displayed at once on a chart and the lag or delay that incurs on the user end. In addition displaying all the points in the set would lead to a very crowded plot. As a result we decided to implement a year slider for the 5 years available for exploration. The filtering of the data by year gives the user another dimension to explore and helps address some of these issues. 

### Tooltips
Tooltips were implemented as a way to give the user a bit more information about the patents. In the data set we chose, we had the location name and the company the patent belonged to and decided to display that information on hover. When you hover over a point, a white tooltip appears and the point changes colors from yellow to white, that is to aid in readability of the information, but also to ensure that the user knows generally which point they are currently selecting. In our original iteration of this we had the points increase inside to indicate selection on hover, but users found it confusing and thought that the expansion of size was encoding some other information. 


## Overview of Development Process
Data Exploration
(Bryan) The data was found on the PatentsView site and separated into different csv files. Time was needed to understand the patents and their corresponding data tables, before the actual downloading of specific files. Next, because of the large amount of data spanning over 40 years, some time was spent sizing the data down using python and saving the eventual dataset. Afterwards, the data exploration was done using Tableau for quick and easy manipulation. Insights such as geographic patterns and company trends were found through trying out different forms of data visualization and data transformations. This entire section took roughly 5 hours, with a larger proportion attributed to the explorations.

### Data Processing
(Bryan+Ashley)
Initially the dates were written in a string format “xx/xx/xxxx'' that was difficult to work with plus there were inconsistencies in how that string was formatted in the original csv file, with respect to spacing, null values, or missing information. A matlab script was used to pull the year information from the date field and then append it to our main data set. This took 2 hours.

### Map
(Bryan+Eamon) The latitude and longitude points for each country were loaded from a .json file and rendered as svg paths. A background div object was added behind the countries to enable interacting with the map while the cursor is over the ocean. The two main ways that the user interacts with the map are pan and zoom, both of which are ended in the d3.event.transform object. Limits on both pan and zoom were implemented such that the user cannot leave the map. Overall the implementation of the map took us roughly 8 hours. 

### Search Bar
(Eamon) The search bar was implemented using the autocomplete.js package, which provides an API for autocomplete html text input. Upon keydown, the package automatically updates a results list with the top N results for a given query. I implemented the onSelection() function to color and expand patent markers based on the selected organization name, as well as a function to restore the default marker style upon pressing the “X” button or hitting backspace. Learning to interact with the autocomplete.js API and correctly handle events took the most time. The implementation of the search bar took me roughly 5 hours.

### Tooltips
(Ashley) The tooltips were implemented based on the example provided in the intro to d3 workshop. Modifications had to be made because this code makes use of d3 v5 and not d3 v6. In addition some different color styling was selected to better align with our visualization aesthetic and goals. Implementation took 3 hours, as there was some issues understanding the difference of event listener implementation between the two versions of d3

### Slider
(Bryan) The slider was first implemented in html where a range was created which corresponds to the 5 years in our dataset. Yearly increments were chosen over months or days to show enough data points on the map with every change and also to not overwhelm the users with too many choices. I noticed that the way the previous versions of the js file was structured does not allow for the update of filtered data according to years as we changed the slider, so a sizable amount of the code had to be revamped (see old code folder for older version). The process of trying to implement the slider with the old code, noticing the limitations, and eventually changing the code and implementing the slider spanned a couple of days and took me approximately 10 hours. 

### Visual Design
(Everyone) Initially we were specifying styling in the javascript file, but as the codebase grew it became useful to keep all styling in the CSS file and to update class and id labels in the javascript. We found it useful to use the Chrome inspector to interactively explore color changes before adding them to the CSS. The only challenging part of styling from a technical perspective was identifying the correct classes/ids for specific components of the search bar and slider objects. Overall we spent roughly 2 hours on styling.


## Inspiration and Acknowledgements

### Source of Data: 
Patents from Patentsview.org
Map data from https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json

### Visualization D3 Sources: 
Tootips modified from Intro to D3 - Workshop 2
Map functionality inspired by Mapping Data with D3 - D3 Workshop Series
Search bar implemented via autocomplete.js
