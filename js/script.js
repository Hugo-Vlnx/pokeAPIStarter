class Type {
  constructor(name, image = '') {
    this.name = name;
    this.image = image;
    this.color = this.getColorHexa();
  }

  getColorHexa() {
    switch (this.name) {
      case "grass": return "#679052";
      case "fire": return "#e04848";
      case "water": return "#6278aa";
      case "poison": return "#a56adb";
      case "electric": return "#dbdb6a";
      case "fairy": return "#db6ad7";   
      case "flying": return "#8dc2c8";
      case "bug": return "#c5e785"; 
      case "ground": return "#795d5d";
      case "fighting": return "#994949";
      case "psychic": return "#594360";
      case "steel": return "#c2c2c2";
      case "rock": return "#4e3c3c";
      case "dark": return "#2c2c2c";
      case "ghost": return "#202349";
      case "ice": return "#93b6d3";
      case "dragon": return "#d3c593";
      default: return "grey";
    }
  }
}

class Pokemon {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.arrTypes = data.types.map(t => new Type(t));
    this.hp = data.stats.find(s => s.name === 'hp').value;
    this.attack = data.stats.find(s => s.name === 'attack').value;
    this.defense = data.stats.find(s => s.name === 'defense').value;
    this.special_attack = data.stats.find(s => s.name === 'special-attack').value;
    this.speed = data.stats.find(s => s.name === 'speed').value;
  }

  displayCard() {
    const article = document.createElement('article');
    const mainType = this.arrTypes[0];
    const color = mainType.color; 

    article.style.backgroundColor = color;
    article.style.borderColor = color;

    article.innerHTML = `
      <figure>
        <picture>
          <img src="${this.image}" alt="Image ${this.name}" />
        </picture>
        <figcaption>
          <span class="types" style="background-color: ${color};">${mainType.name}</span>
          <h2>${this.name}</h2>
          <ol>
            <li>Points de vie : ${this.hp}</li>
            <li>Attaque : ${this.attack}</li>
            <li>Défense : ${this.defense}</li>
            <li>Attaque spécial : ${this.special_attack}</li>
            <li>Vitesse : ${this.speed}</li>
          </ol>
        </figcaption>
      </figure>
    `;

    return article;
  }
}

const main = document.querySelector('main');
const typeButtons = document.querySelectorAll('.type-btn');
const sortSelect = document.getElementById('generation-select');
let selectedTypes = ['all'];

async function fetchPokemonData(types) {
  try {
    const response = await fetch('./pokemon.json');
    const data = await response.json();
    
    main.innerHTML = ''; 

    let rawPokemons = data.pokemon;
    if (!types.includes('all') && types.length > 0) {
      rawPokemons = data.pokemon.filter(p => p.types.some(t => types.includes(t)));
    }

    let pokemons = rawPokemons.map(p => new Pokemon(p));

    const sortValue = sortSelect.value;

    pokemons.sort((a, b) => {
      switch (sortValue) {
        case "1":
          return b.name.localeCompare(a.name);
        case "2":
          return b.hp - a.hp;
        case "3":
          return b.attack - a.attack;
        case "4":
          return b.arrTypes[0].name.localeCompare(a.arrTypes[0].name);
        case "5":
          return b.special_attack - a.special_attack;
        case "6":
          return b.defense - a.defense;
        case "7":
          return b.speed - a.speed;
        default:
          return 0;
      }
    });

    pokemons.forEach(pokemon => {
      main.appendChild(pokemon.displayCard());
    });

  } catch (error) {
    console.error(error);
  }
}

typeButtons.forEach(btn => {
  btn.addEventListener('click', (event) => {
    const type = event.target.dataset.type;
    
    if (type === 'all') {
      selectedTypes = ['all'];
      typeButtons.forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
    } else {
      const allBtn = document.querySelector('.type-btn[data-type="all"]');
      allBtn.classList.remove('active');
      selectedTypes = selectedTypes.filter(t => t !== 'all');
      
      if (selectedTypes.includes(type)) {
        selectedTypes = selectedTypes.filter(t => t !== type);
        event.target.classList.remove('active');
      } else {
        selectedTypes.push(type);
        event.target.classList.add('active');
      }
      
      if (selectedTypes.length === 0) {
        selectedTypes = ['all'];
        allBtn.classList.add('active');
      }
    }
    fetchPokemonData(selectedTypes);
  });
});

sortSelect.addEventListener('change', () => {
  fetchPokemonData(selectedTypes);
});

fetchPokemonData(['all']);