const d = document,
  $main = d.querySelector("main"),
  $links = d.querySelector(".links");

async function loadPokemons(url) {
  try {
    $main.innerHTML = `<img class="loader" src="../ASSETS/spinning-circles.svg" alt="Cargando...">`;

    let res = await fetch(url),
      json = await res.json(),
      $template = "",
      $prevLink = "",
      $nextLink = "";

    // console.log(json); //Muestra el primer resultado de consultar la api

    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    for (let i = 0; i < json.results.length; i++) {
      // console.log(json.results[i]); //muestra cada pokemon con su nombre y su url donde viene su informacion

      try {
        let res = await fetch(json.results[i].url), //res va a tener la informacion
          pokemon = await res.json(); //trae la informacion de cada API de cada pokemon en formato json

        console.log(res, pokemon); //Pokemon ya va a traer la informacion de cada pokemon completa
        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        //La variable template se va a ir llenando con cada pokemon
        $template += `
        <figure>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <figcaption>${pokemon.name}</figcaption>
        </figure>
        `;
      } catch (err) {
        console.log(err);
        let message =
          err.statusText || "Ocurrio un error al consumir la PokeAPI";
        $template += `
          <figure>
          <figcaption>Error ${err.status}: ${message}</figcaption>
          </figure>
          `;
      }
    }

    $main.innerHTML = $template;
    $prevLink = json.previous ? `<a href="${json.previous}">⏮️</a>` : "";
    $nextLink = json.next ? `<a href="${json.next}">⏭️</a>` : "";
    $links.innerHTML = $prevLink + " " + $nextLink;
  } catch (err) {
    let message = err.statusText || "Ocurrio un error al consumir la PokeAPI";
    $main.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
  }
}

let pokeAPI = "https://pokeapi.co/api/v2/pokemon/";

d.addEventListener("DOMContentLoaded", (e) => loadPokemons(pokeAPI));

d.addEventListener("click", (e) => {
  if (e.target.matches(".links a")) {
    e.preventDefault();

    loadPokemons(e.target.getAttribute("href"));
  }
});

//En este caso se usara for debido a que es una estrucura bloqueante ne lugar de foreach, foreach no va a esperar a recibir la informacion
