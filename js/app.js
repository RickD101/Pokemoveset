// jQuery on document ready function
$(()=>{

    // draw search bar method
    domManager.renderSearchBar();

});

// DOM manager object for controlling rendering and user input to the DOM
const domManager = {

    // this method draws the initial searchbar screen
    renderSearchBar(){
        // first empty the container of all elements
        $('.container').children().remove();

        // draw the pokemon search bar and button
        $('.container').append(
            `<div class="form-row d-flex align-content-center justify-content-center" 
            style="height: 100vh;"></div>`);
        const searchBar = $(`<div class="col-12 col-sm-6 p-1">
                                <input class="form-control form-control-lg" id="searchBar" 
                                type="text" placeholder="Search Pokémon..."></input>
                            </div>`);
        const genSelect = $(`<div class="p-1"><select class="form-control form-control-lg" id="genSelect">
                                <option>Generation 1</option>
                                <option>Generation 2</option>
                                <option>Generation 3</option>
                                <option>Generation 4</option>
                                <option>Generation 5</option>
                                <option>Generation 6</option>
                                <option>Generation 7</option>
                            </select></div>`);
        const goButton = $(`<div class="p-1"><button class="btn btn-primary btn-lg">Go!</button></div>`);
        
        // add the event listeners for Go button and enter key
        goButton.on('click',()=>{
            logicManager.searchPokemon($('#searchBar').val(), $('#genSelect').val());
        });
        searchBar.keypress((event) =>{ // not working properly atm
            if (event.which == 13){
                logicManager.searchPokemon($('#searchBar').val(), $('#genSelect').val());
            }
        });

        // append to the DOM
        $('.form-row').append(searchBar);
        $('.form-row').append(genSelect);
        $('.form-row').append(goButton);

    },

    // this method triggers the popover alert
    emptyInputAlert(){
        // add popover alert to searchBar
        $('#searchBar').popover({
            content: "Please input a Pokemon's name or Pokedex number!",
            placement: "top",
            animation: true,
            trigger: "manual"
        });

        $('#searchBar').popover('show');
        setTimeout(() => {
            $('#searchBar').popover('hide');
        }, 3000);
    },

    errorInputAlert(error){
        $('#searchBar').popover({
            content: error,
            placement: "top",
            animation: true,
            trigger: "manual"
        });

        $('#searchBar').popover('show');
        setTimeout(() => {
            $('#searchBar').popover('hide');
        }, 3000);
    },

    // this method draws the pokemon info screen
    renderPokemon(pokemon){
        // empty the container
        $('.container').children().remove();

        // render the basic structure
        $('.container').append(
            `<div class="row d-flex justify-content-center" style="margin-top: 86px;">
                <div class="col-3 results-col" id="info-col"></div>
                <div class="col-5 results-col" id="move-col"></div>
                <div class="col-4 results-col" id="saved-col"></div>
            </div>`);
        
        // render the info column
        $('#info-col').append(
            `<img class="pokemon-sprite" src=${pokemon.spriteURL}>`
        );
        $('#info-col').append(
            `<div class="pokemon-info-box pb-2">
                <div class="pokemon-name">${pokemon.name}</div>
                <div class="mb-1">#${pokemon.info.dexNumber}</div>
            </div>`
        );
        pokemon.info.type.forEach(type =>{
            $('.pokemon-info-box').append(
                `<span class="pokemon-type pokemon-type-${type}">${type}</span>`
            );
        });
        $('#info-col').append(
            `<div class="pokemon-stats pt-2">
                <div class="pokemon-stat-title">BASE STATS</div>
                <ul class="list-group list-group-flush stat-list">
                    <li class="list-group-item stat-top"><b>HP:</b> ${pokemon.info.stats.HP}</li>
                    <li class="list-group-item stat"><b>Attack:</b> ${pokemon.info.stats.ATK}</li>
                    <li class="list-group-item stat"><b>Defense:</b> ${pokemon.info.stats.DEF}</li>
                    <li class="list-group-item stat"><b>Special Attack:</b> ${pokemon.info.stats.SAK}</li>
                    <li class="list-group-item stat"><b>Special Defense:</b> ${pokemon.info.stats.SDF}</li>
                    <li class="list-group-item stat" id="last-stat"><b>Speed:</b> ${pokemon.info.stats.SPD}</li>
                </ul>
            </div>`
        );
    },

    // populate the move lists and add event listeners
    renderMoveList(gen){
        // render the basic tab structure
        $('#move-col').append(
            `<div class="move-list-title">Available moves in ${gen}</div>`
        );
        $('#move-col').append(
            `<nav>
                <div class="nav nav-tabs justify-content-center" id="nav-tab" role="tablist">
                    <a class="nav-item nav-link active" id="nav-levelUp-tab" data-toggle="tab" href="#nav-levelUp" role="tab">Level up</a>
                    <a class="nav-item nav-link" id="nav-machine-tab" data-toggle="tab" href="#nav-machine" role="tab">TM/HM</a>
                    <a class="nav-item nav-link" id="nav-egg-tab" data-toggle="tab" href="#nav-egg" role="tab">Egg</a>
                    <a class="nav-item nav-link" id="nav-tutor-tab" data-toggle="tab" href="#nav-tutor" role="tab">Tutor</a>
                </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="nav-levelUp" role="tabpanel"></div>
                <div class="tab-pane fade" id="nav-machine" role="tabpanel"></div>
                <div class="tab-pane fade" id="nav-egg" role="tabpanel"></div>
                <div class="tab-pane fade" id="nav-tutor" role="tabpanel"></div>
            </div>`
        );
    },

    renderMove(move, tab){
        let card = $(`<div class="card" style="width: 95%;"></div>`);
        let cardBody = $(
            `<div class="card-body">
                <span class="move-title">${move.name}</span>
                <span class="pokemon-type pokemon-type-${move.type}">${move.type}</span>
                <span class="pokemon-type move-category-${move.category}">${move.category}</span></br>
                <ul class="list-group list-group-horizontal move-stats">
                    <li class="list-group-item flex-fill move-stat move-stat-mid"><b>PWR:</b> ${move.power}</li>
                    <li class="list-group-item flex-fill move-stat move-stat-mid"><b>ACC:</b> ${move.accuracy}</li>
                    <li class="list-group-item flex-fill move-stat"><b>PP:</b> ${move.pp}</li>
                </ul>
            </div>`
        );
        if (tab === "levelUp"){
            $(cardBody).append(`<p class="card-text">Learns at level ${move.learnAt}.</p>`);
        }
        $(cardBody).append(`<p class="card-text">${move.description}</p>`);
        $(card).append(cardBody);
        $(`#nav-${tab}`).append(card);

    }

};

// logic manager to save and sort pokemon move data
const logicManager = {
    // this is the restructured object in which the currently searched Pokemon data is saved
    currentPokemon: {
        name: null,
        spriteURL: null,
        info: {
            dexNumber: null,
            type: [],
            stats: {
                HP: null,
                ATK: null,
                DEF: null,
                SAK: null,
                SDF: null,
                SPD: null
            }
        },
        moves: {
            levelUp: [],
            machine: [],
            tutor: [],
            egg: []
        }
    },
    
    // this method implements the API lookup and subsequent data analysis
    searchPokemon(name, generation){
        if(name){
            // modify punctuation etc. to suit API call
            name = name.replace(" ","-").toLowerCase();

            $.ajax({url:`https://pokeapi.co/api/v2/pokemon/${name}`})
            .then( // map pokemon info from API to in-built currentPokemon object
                (pokemon)=>{
                    this.currentPokemon.name = pokemon.name;
                    this.currentPokemon.spriteURL = pokemon.sprites.front_default;

                    this.currentPokemon.info.dexNumber = pokemon.id;
                    pokemon.types.forEach(type =>{
                        this.currentPokemon.info.type.push(type.type.name);
                    });

                    this.currentPokemon.info.stats.HP = pokemon.stats[5].base_stat;
                    this.currentPokemon.info.stats.ATK = pokemon.stats[4].base_stat;
                    this.currentPokemon.info.stats.DEF = pokemon.stats[3].base_stat;
                    this.currentPokemon.info.stats.SAK = pokemon.stats[2].base_stat;
                    this.currentPokemon.info.stats.SDF = pokemon.stats[1].base_stat;
                    this.currentPokemon.info.stats.SPD = pokemon.stats[0].base_stat;

                    // render the pokemon information screens
                    domManager.renderPokemon(this.currentPokemon);
                    domManager.renderMoveList(generation);

                    // call the move sorting function for each move listed
                    this.sortMoves(pokemon.moves, generation);

                    console.log(logicManager.currentPokemon); // need to remove later
                },
                (badResponse)=>{
                    domManager.errorInputAlert(badResponse.responseText);
                }
            )
            .catch(error=>{console.log(error)});
        }
        else{
            domManager.emptyInputAlert();
        }
    },

    // this method analyses the moves to pick only those from the selected generation
    // and sorts them by learn method
    sortMoves(moves, generation){
        moves.forEach(move =>{
            let genName;
            
            if (generation === 'Generation 1'){
                genName = 'red-blue';
            }
            else if (generation === 'Generation 2'){
                genName = 'gold-silver';
            }
            else if (generation === 'Generation 3'){
                genName = 'ruby-sapphire';
            }
            else if (generation === 'Generation 4'){
                genName = 'diamond-pearl';
            }
            else if (generation === 'Generation 5'){
                genName = 'black-white';
            }
            else if (generation === 'Generation 6'){
                genName = 'x-y';
            }
            else if (generation === 'Generation 7'){
                genName = 'sun-moon';
            }

            for (let i=0; i<move.version_group_details.length; i++){
            
                let moveInfo = {};

                if (move.version_group_details[i].version_group.name === genName){
                    
                    $.ajax({url: move.move.url})
                    .then((moveData) =>{
                        moveInfo.name = moveData.name.replace(/-/g," ");
                        moveInfo.type = moveData.type.name;
                        moveInfo.category = moveData.damage_class.name;
                        if (moveData.power){
                            moveInfo.power = moveData.power;
                        }
                        else{
                            moveInfo.power = "-";
                        }
                        if (moveData.accuracy){
                            moveInfo.accuracy = moveData.accuracy;
                        }
                        else{
                            moveInfo.accuracy = "-";
                        }
                        moveInfo.pp = moveData.pp;
                        moveInfo.description = moveData.effect_entries[0].short_effect.replace('$effect_chance', moveData.effect_chance);

                        if (move.version_group_details[i].move_learn_method.name === 'level-up'){
                            moveInfo.learnAt = move.version_group_details[i].level_learned_at;
                            this.currentPokemon.moves.levelUp.push(moveInfo);
                            domManager.renderMove(moveInfo,'levelUp');
                        }
                        else if (move.version_group_details[i].move_learn_method.name === 'machine'){
                            this.currentPokemon.moves.machine.push(moveInfo);
                            domManager.renderMove(moveInfo,'machine');
                        }
                        else if (move.version_group_details[i].move_learn_method.name === 'tutor'){
                            this.currentPokemon.moves.tutor.push(moveInfo);
                            domManager.renderMove(moveInfo,'tutor');
                        }
                        else if (move.version_group_details[i].move_learn_method.name === 'egg'){
                            this.currentPokemon.moves.egg.push(moveInfo);
                            domManager.renderMove(moveInfo,'egg');
                        }
                    },
                    (badResponse)=>{
                        moveInfo.name = move.move.name.replace(/-/g," ");
                        moveInfo.type = badResponse.responseText;
                        moveInfo.category = badResponse.responseText;
                        moveInfo.power = badResponse.responseText;
                        moveInfo.accuracy = badResponse.responseText;
                        moveInfo.pp = badResponse.responseText;
                        moveInfo.description = badResponse.responseText;

                        if (move.version_group_details[i].move_learn_method.name === 'level-up'){
                            moveInfo.learnAt = move.version_group_details[i].level_learned_at;
                            this.currentPokemon.moves.levelUp.push(moveInfo);
                            domManager.renderMove(moveInfo,'levelUp');
                        }
                        else if (move.version_group_details[i].move_learn_method.name === 'machine'){
                            this.currentPokemon.moves.machine.push(moveInfo);
                            domManager.renderMove(moveInfo,'machine');
                        }
                        else if (move.version_group_details[i].move_learn_method.name === 'tutor'){
                            this.currentPokemon.moves.tutor.push(moveInfo);
                            domManager.renderMove(moveInfo,'tutor');
                        }
                        else if (move.version_group_details[i].move_learn_method.name === 'egg'){
                            this.currentPokemon.moves.egg.push(moveInfo);
                            domManager.renderMove(moveInfo,'egg');
                        }
                    })
                    .catch(error=>{console.log(error)});
                }
            }
        });
    },

    // adds functionality for saving movesets
    saveMove(){
        console.log('it works');
    },

};