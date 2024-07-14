// ## **Part 1: Number Facts**

// 1. Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number. (Make sure you get back JSON by including the ***json*** query key, specific to this API. [Details](http://numbersapi.com/#json).

axios.get("http://numbersapi.com/24#json")
.then(res => {console.log(res.data)})
.catch(err => { console.log("Error", err)})

// 2. Figure out how to get data on multiple numbers in a single request. Make that request and when you get the data back, put all of the number facts on the page.

let URL_List = [
    axios.get("http://numbersapi.com/24#json"), 
    axios.get("http://numbersapi.com/52#json"), 
    axios.get("http://numbersapi.com/48#json"), 
    axios.get("http://numbersapi.com/95#json"), 
    axios.get("http://numbersapi.com/48#json")
]

Promise.all(URL_List)
.then(allRes => {
    let $ul = $('<ul></ul>');
    for (const res of allRes){
        let $li = $('<li></li>').text(res.data);
        $ul.append($li);
    }
    $('.list_of_nums').append($ul);
})
.catch(err => { console.log(err) })

// 3. Use the API to get 4 facts on your favorite number. Once you have them all, put them on the page. It’s okay if some of the facts are repeats.
//     *(Note: You’ll need to make multiple requests for this.)*

let URL_List_2 = [
    axios.get("http://numbersapi.com/24#json"), 
    axios.get("http://numbersapi.com/24#json"), 
    axios.get("http://numbersapi.com/24#json"), 
    axios.get("http://numbersapi.com/24#json")
]

Promise.all(URL_List_2)
.then(allRes => {
    let $ul = $('<ul></ul>');
    for (const res of allRes){
        let $li = $('<li></li>').text(res.data);
        $ul.append($li);
    }
    $('.list_of_nums').append($ul);
})
.catch(err => { console.log(err) })

// ## **Part 2: Deck of Cards**

// 1. Make a request to the [Deck of Cards API](http://deckofcardsapi.com/) to request a single card from a newly shuffled deck. Once you have the card, ***console.log*** the value and the suit (e.g. “5 of spades”, “queen of diamonds”).

axios.get("https://deckofcardsapi.com/api/deck/new/draw/?count=1")
.then(res => { 
    let card = res.data.cards[0]
    console.log(`${card.value} OF ${card.suit}`)
})
.catch(err => { console.log("Error", err)})

// 2. Make a request to the deck of cards API to request a single card from a newly shuffled deck. Once you have the card, make a request to the same API to get one more card from the **same** deck.
//     Once you have both cards, ***console.log*** the values and suits of both cards.

let deck_id = ""
let card_1 = ""
let card_2 = ""

axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
.then(res => {
    deck_id = res.data.deck_id
    return axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
})
.then(res => {
    card_1 = res.data.cards[0]
    return axios.get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
})
.then(res => {
    card_2 = (res.data.cards[0])
    console.log(`Deck ID: ${deck_id}. CARD 1: ${card_1.value} OF ${card_1.suit}. CARD 2: ${card_2.value} OF ${card_2.suit}`)
})
.catch(err => { console.log("Error", err)})

// 3. Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card. Every time you click the button, display a new card, until there are no cards left in the deck.

$(document).ready(function() {

    let new_deck_id = ""

    axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(res => {
        new_deck_id = res.data.deck_id
    })
    .catch(err => { console.log("Error", err)})

    $('.card_game').append('<button class="draw_card">Draw Card</button>');

    $('.draw_card').on('click', function() {
        axios.get((`https://deckofcardsapi.com/api/deck/${new_deck_id}/draw/?count=1`))
            .then(res => {
                console.log(res.data)
                const card_drawn = res.data.cards[0]
                $('.card_game').append(`<p>${card_drawn.value} OF ${card_drawn.suit}</p>`);
            })
            .catch(err => {
                console.error("Error drawing card:", err);
                $('.card_game').append(`<p style="color:red;">No More Cards</p>`);
            });
    });
});

// ## **Further Study**

// 1. Figure out how to make a single request to the [Pokemon API](https://pokeapi.co/) to get names and URLs for every pokemon in the database.

// 2. Once you have names and URLs of all the pokemon, pick three at random and make requests to their URLs. Once those requests are complete, ***console.log*** the data for each pokemon.

let pokemon_1 = {}
let pokemon_2 = {}
let pokemon_3 = {}
let pokemon_1_info = {}
let pokemon_2_info = {}
let pokemon_3_info = {}

axios.get("https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0")
.then(res => { 
    let all_pokemon = res.data.results

    const random1 = Math.floor(Math.random() * 1302) + 1;
    const random2 = Math.floor(Math.random() * 1302) + 1;
    const random3 = Math.floor(Math.random() * 1302) + 1;

    pokemon_1 = all_pokemon[`${random1}`]
    pokemon_2 = all_pokemon[`${random2}`]
    pokemon_3 = all_pokemon[`${random3}`]

    return axios.get(pokemon_1.url)
})
.then( res => {
    pokemon_1_info = res.data
    return axios.get(pokemon_2.url)
})
.then( res => {
    pokemon_2_info = res.data
    return axios.get(pokemon_3.url)
})
.then( res => {
    pokemon_3_info = res.data

    console.log(pokemon_1_info)
    console.log(pokemon_2_info)
    console.log(pokemon_3_info)
})
.catch(err => { console.log("Error", err)})


// 3. Start with your code from 2, but instead of logging the data on each random pokemon, store the name of the pokemon in a variable and then make another request, this time to that pokemon’s ***species*** URL (you should see a key of ***species*** in the data). Once *that* request comes back, look in the ***flavor_text_entries*** key of the response data for a description of the species written in English. If you find one, ***console.log*** the name of the pokemon along with the description you found.

//     Example: “ducklett: They are better at swimming than flying, and they happily eat their favorite food, peat moss, as they dive underwater.”

let pokemon_1_name = ""
let pokemon_2_name = ""
let pokemon_3_name = ""
let pokemon_1_species = {}
let pokemon_2_species = {}
let pokemon_3_species = {}
let pokemon_1_flavor_text = ""
let pokemon_2_flavor_text = ""
let pokemon_3_flavor_text = ""

axios.get("https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0")
.then(res => { 
    let all_pokemon = res.data.results

    const random1 = Math.floor(Math.random() * 1302) + 1;
    const random2 = Math.floor(Math.random() * 1302) + 1;
    const random3 = Math.floor(Math.random() * 1302) + 1;

    pokemon_1_name = all_pokemon[`${random1}`].name
    pokemon_2_name = all_pokemon[`${random2}`].name
    pokemon_3_name = all_pokemon[`${random3}`].name

    return axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon_1_name}`)
})
.then( res => {
    pokemon_1_species = res.data
    for(let flavor of res.data.flavor_text_entries){
        // console.log(flavor)
        if (flavor.language.name == 'en'){
            pokemon_1_flavor_text = flavor.flavor_text
            break;
        }
    }
    return axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon_2_name}`)
})
.then( res => {
    pokemon_2_species = res.data
    for(let flavor of res.data.flavor_text_entries){
        if (flavor.language.name == 'en'){
            pokemon_2_flavor_text = flavor.flavor_text
            break;
        }
    }
    return axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon_3_name}`)
})
.then( res => {
    pokemon_3_species = res.data
    for(let flavor of res.data.flavor_text_entries){
        if (flavor.language.name == 'en'){
            pokemon_3_flavor_text = flavor.flavor_text
            break;
        }
    }
    console.log(`"${pokemon_1_name}: ${pokemon_1_flavor_text}"`)
    console.log(`"${pokemon_2_name}: ${pokemon_2_flavor_text}"`)
    console.log(`"${pokemon_3_name}: ${pokemon_3_flavor_text}"`)
})
.catch(err => { console.log("Error", err)})

// 4. **BONUS** Instead of relying on ***console.log***, let’s create a UI for these random pokemon. Build an HTML page that lets you click on a button to generate data from three randomly chosen pokemon. Include the name of the pokemon, an image of the pokemon, and the description of its species which you found in 3.

$(document).ready(function() {

    $('.pokemon_cards').append('<button class="random_pokemon">Random Pokemon</button>');

    let pokemon_list = {}

    axios.get("https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0")
    .then(res => { 
        pokemon_list = res.data.results
    })
    .catch(err => {
        console.error("Error drawing card:", err);
        $('.pokemon_cards').append(`<p style="color:red;">An Error Occured</p>`);
    });

    $('.random_pokemon').on('click', function() {

        const random = Math.floor(Math.random() * 1302) + 1;
        let random_pokemon_name = pokemon_list[`${random}`].name
        let random_pokemon_image, random_pokemon_id, random_pokemon_description
        
        axios.get(`https://pokeapi.co/api/v2/pokemon-species/${random_pokemon_name}`)
        .then(res => {
            random_pokemon_id = res.data.id
            for(let flavor of res.data.flavor_text_entries){
                if (flavor.language.name == 'en'){
                    random_pokemon_description = flavor.flavor_text
                    break;
                }
            }
            return axios.get(`https://pokeapi.co/api/v2/pokemon/${random_pokemon_id}/`)
        })
        .then(res => {
            random_pokemon_image = res.data.sprites.front_shiny
            $('.pokemon_cards').append(`<div class="pokemon_card">
                <h2>${random_pokemon_name}</h2>
                <img src="${random_pokemon_image}"/>
                <p>${random_pokemon_description}</p>
                </div>`);
        })
        .catch(err => {
            console.error("Error generating pokemon:", err);
        });
    });

});
