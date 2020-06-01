# Pokémoveset - The Pokémon moveset generator

This web app is designed to assist with previewing and planning Pokémon movesets
for a given Pokémon generation. The user can search any Pokémon by name or number and
then select the generation for which the available moves will be presented. The user
can then drag and drop these moves into custom moveset boxes which can be used as a
guide for creating a moveset within an actual Pokémon game.

## Technologies and approach taken

This project is currently a front-end based product. Javascript is primarily used to achieve
the desired behaviour of the app. To manage the appearance of the app, a combination of Javascript,
Bootstrap and custom CSS is used. In order to extend the functionality of the Javascript, external 
libraries (mostly jQuery) are incorporated into the base HTML file.

### Functionality of the app
When a search is invoked, the jQuery AJAX function is utilised to make an API request to PokeAPI, 
an external Pokémon API which hosts a multitude of data on every Pokémon. If the search is valid,
the Pokémon data is collected from the API call (which returns a JSON object) and selected data is 
saved to the logicManager object within the main Javascript file for the app (app.js). Additional 
AJAX requests are required for each move as this data is not present within the original Pokémon 
JSON object returned from PokeAPI. As this data is collected, methods within the logicManager object
categorise and sort the information. This information is then passed to the domManager object which 
is responsible for rendering items to the DOM (browser based UI). This is achieved using jQuery 
functionality such as append.

The interactive functionality of the drag and drop for saving moves is achieved using the draggable
and droppable methods found within the jQueryUI library. The dragging and dropping call methods within
both the logicManager and domManager objects to save and display the moves respectively.

### Appearance of the app
Bootstrap is used extensively to both manage the general layout of the app and provide some limited
repsonsive design. A sizable amount of custom CSS tweaks were required to achieve the desired appearance
of the app. Currently, the appearance of the app breaks down below a certain screen size meaning 
the app is not suitable for use on smaller devices such as smartphones. This will hopefully be addressed
in the future.

## For the Future

Currently, the app is mostly functional but some issues are present. Additionally, the app is still limited
in some areas. Some future problems to be addressed are:
* Add support for smaller screens (<992px)
* Add support for mobile devices (drag and drop not functional on touch screens)
* Would like to attach await logic to the secondary API call when moves are looked up (so that the move objects are rendered after all moves are loaded not as each one is loaded)

Some addtional featutres being considered include:
* Ability to change to next/previous Pokémon and/or generation from within results screen
* Add button to clear entire movesets
* Add functionality to save movesets either locally or server-side (after learning how to do this!)
* Additional tooltip style info for moves within movesets when hovered over
* Ability to sort and filter moves based on type etc.