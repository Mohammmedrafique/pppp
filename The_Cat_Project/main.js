document.addEventListener("DOMContentLoaded", () => {
  const breedsContainer = document.getElementById("breeds-container");
  const paginationContainer = document.getElementById("pagination-container");
  const catContainer = document.getElementById("cat-container");
  const apiKey =
    "live_d6o9nDICd8TnXPwKgFGTU4yN6yoje3v9flZQuX4vWZMziey7Hzm5cvj5jB8DGKWq";

  const breedsPerPage = 5;
  let currentPage = 1;

  fetchBreeds();

  function fetchBreeds() {
    fetch(
      `https://api.thecatapi.com/v1/breeds?limit=${breedsPerPage}&page=${currentPage}`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        displayBreeds(data);
        displayPagination();
      })
      .catch((error) => {
        console.error("Error fetching breeds:", error);
      });
  }

  function displayBreeds(breeds) {
    breedsContainer.innerHTML = "";

    breeds.forEach((breed) => {
      const breedCard = createBreedCard(breed);
      breedsContainer.appendChild(breedCard);
    });
  }

  function createBreedCard(breed) {
    const card = document.createElement("div");
    card.classList.add("breed-card");

    card.innerHTML = `
          <img src="${breed.image?.url || ""}" alt="${breed.name}">
          <h3>${breed.name}</h3>
          <p>${breed.description}</p>
          <p>Origin: ${breed.origin}</p>
          <p>Life Span: ${breed.life_span}</p>
          <p>Read More: <a href="${
            breed.wikipedia_url
          }" target="_blank">Wikipedia</a></p>
          <h4>${breed.temperament}</h4>
          <button onclick="viewImages('${breed.id}', '${
      breed.name
    }')">View Images</button>
      `;

    return card;
  }

  function displayPagination() {
    const totalPages = Math.ceil(50 / breedsPerPage);

    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.addEventListener("click", () => {
        currentPage = i;
        fetchBreeds();
      });
      paginationContainer.appendChild(pageButton);
    }
  }

  window.viewImages = (breedId, breedName) => {
    fetch(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=10`,
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((images) => {
        displayImages(images, breedName);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  };

  function displayImages(images, breedName) {
    const imageUrls = images.map((image) => image.url);
    localStorage.setItem("imageUrls", JSON.stringify(imageUrls));

    window.location.href = `cat.html?breedName=${encodeURIComponent(
      breedName
    )}`;
  }
});
