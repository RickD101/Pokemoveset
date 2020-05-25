// jQuery on document ready function
$(()=>{

    // draw search bar function
    domManager.drawSearchBar();

});

const domManager = {
    // this method draws the initial searchbar screen
    drawSearchBar(){
        // first empty the container of all elements
        $('.container').children().remove();

        // draw the pokemon search bar and button
        $('.container').append('<div class="row d-flex align-items-center" style="height: 100vh; margin-top: 70;"></div>');
        const searchBar = $(
            '<input class="form-control form-control-lg" id="searchBar" type="text" placeholder="Search a Pokemon by name..."></input>')
        $('.row').append(searchBar);
    }
};

const logicManager = {

};