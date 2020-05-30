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
        $('#searchBar').keydown((event) =>{ // not working properly atm
            if (event.keyCode === 13){
                logicManager.searchPokemon($('#searchBar').val(), $('#genSelect').val());
            }
        })
        
        // append to the DOM
        $('.form-row').append(searchBar);
        $('.form-row').append(genSelect);
        $('.form-row').append(goButton);

        // add popover alert to searchBar
        $('#searchBar').popover({
            content: "Please input a Pokemon's name or Pokedex number!",
            placement: "top",
            animation: true,
            trigger: "manual"
        });
    },

    // this method triggers the popover alert
    emptyInputAlert(){
        $('#searchBar').popover('show');
        setTimeout(() => {
            $('#searchBar').popover('hide');
        }, 3000);
    },

    // this method draws the results screen
    renderPokemon(){
        // empty the container
        $('.container').children().remove();

        // render the basic structure
        $('.container').append(
            `<div class="row d-flex justify-content-center" style="margin-top: 80px;">
                <div class="col-3 m-1 pt-3 pb-3 results-col" id="info-col"></div>
                <div class="col-4 m-1 pt-3 pb-3 results-col" id="move-col"></div>
                <div class="col-4 m-1 pt-3 pb-3 results-col" id="saved-col"></div>
            </div>`);
        
        // render the info column
        $('#info-col').append(
            `<img class="pokemon-sprite" src=${logicManager.currentPokemon.spriteURL}>`
        );
        $('#info-col').append(
            `<div class="pokemon-info-box pb-2">
                <div class="pokemon-name">${logicManager.currentPokemon.name}</div>
                <div class="mb-1">#${logicManager.currentPokemon.info.dexNumber}</div>
            </div>`
        );
        logicManager.currentPokemon.info.type.forEach(type =>{
            $('.pokemon-info-box').append(
                `<span class="pokemon-type pokemon-type-${type}">${type}</span>`
            );
        });
        $('#info-col').append(
            `<div class="pokemon-stats pt-2">
                <div class="pokemon-stat-title">BASE STATS</div>
                <ul class="list-group list-group-flush stat-list">
                    <li class="list-group-item" id="first-stat">HP: ${logicManager.currentPokemon.info.stats.HP}</li>
                    <li class="list-group-item">Attack: ${logicManager.currentPokemon.info.stats.ATK}</li>
                    <li class="list-group-item">Defense: ${logicManager.currentPokemon.info.stats.DEF}</li>
                    <li class="list-group-item">Special Attack: ${logicManager.currentPokemon.info.stats.SAK}</li>
                    <li class="list-group-item">Special Defense: ${logicManager.currentPokemon.info.stats.SDF}</li>
                    <li class="list-group-item" id="last-stat">Speed: ${logicManager.currentPokemon.info.stats.SPD}</li>
                </ul>
            </div>`
        );
    },

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
            tm: [],
            tutor: [],
            egg: []
        }
    },
    
    // this method implements the API lookup and subsequent data analysis
    searchPokemon(name, generation){
        if(name){
            // modify punctuation etc. to suit API call
            name = name.toLowerCase();

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

                    pokemon.moves.forEach(move =>{
                        this.sortMoves(move, generation); // call the move sorting function for each move listed
                    });
                    console.log(logicManager.currentPokemon); // need to remove later
                    domManager.renderPokemon();
                },
                (badResponse)=>{
                    console.log(badResponse);
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
    sortMoves(move, generation){
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
                    moveInfo.name = moveData.name;
                    moveInfo.type = moveData.type.name;
                    moveInfo.category = moveData.damage_class.name;
                    moveInfo.power = moveData.power;
                    moveInfo.accuracy = moveData.accuracy;
                    moveInfo.pp = moveData.pp;
                    moveInfo.description = moveData.effect_entries[0].short_effect;

                    if (move.version_group_details[i].move_learn_method.name === 'level-up'){
                        moveInfo.learnAt = move.version_group_details[i].level_learned_at;
                        this.currentPokemon.moves.levelUp.push(moveInfo);
                    }
                    else if (move.version_group_details[i].move_learn_method.name === 'machine'){
                        this.currentPokemon.moves.tm.push(moveInfo);
                    }
                    else if (move.version_group_details[i].move_learn_method.name === 'tutor'){
                        this.currentPokemon.moves.tutor.push(moveInfo);
                    }
                    else if (move.version_group_details[i].move_learn_method.name === 'egg'){
                        this.currentPokemon.moves.egg.push(moveInfo);
                    }
                },
                (badResponse)=>{
                    console.log(badResponse);
                })
                .catch(error=>{console.log(error)});
            }
        }
    },


};