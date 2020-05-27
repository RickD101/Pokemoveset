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
        $('.container').append('<div class="form-row d-flex align-content-center justify-content-center" style="height: 100vh; margin-top: 70;"></div>');
        const searchBar = $(
            '<div class="col-12 col-sm-6 p-1"><input class="form-control form-control-lg" id="searchBar" type="text" placeholder="Search a Pokemon by name..."></input></div>');
        const goButton = $(`<div class="p-1"><button class="btn btn-primary btn-lg">Go!</button></div>`);
        $('.form-row').append(searchBar);
        $('.form-row').append(goButton);
    }
};

const logicManager = {

};