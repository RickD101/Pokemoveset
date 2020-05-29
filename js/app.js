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
        
        // add the event listeners
        goButton.on('click',()=>{
            logicManager.searchPokemon($('#searchBar').val(), $('#genSelect').val());
        });
        
        // append to the DOM
        $('.form-row').append(searchBar);
        $('.form-row').append(genSelect);
        $('.form-row').append(goButton);
    }

    // this method draws the results screen
};

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
    
    searchPokemon(name, generation){
        if(name){
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
                        this.sortMoves(move, generation);
                    });
                    console.log(logicManager.currentPokemon);
                },
                (badResponse)=>{
                    console.log(badResponse);
                }
            )
            .catch(error=>{console.log(error)});
        }
    },

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
                (badResponse)=>{console.log(badResponse)})
                .catch(error=>{console.log(error)});
            }
        }
    }
};