//You can edit ALL of the code here
let allEpisodes = [];


document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const episodeSelect = document.getElementById("episode-select");
  const showSelect = document.getElementById("show-select"); // Add a <select id="show-select"></select> in HTML
  const root = document.getElementById("root");
  const episodeCount = document.getElementById("episode-count");
  
  let allEpisodes = [];
  const showsCache = {}; // Cache for episodes
  const showsListCache = []; // Cache for shows

  // Format S01E02
  function formatEpisodeCode(season, number) {
    return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
  }

  // Fetch all shows once
  function fetchAllShows() {
    fetch("https://api.tvmaze.com/shows")
      .then((res) => res.json())
      .then((shows) => {
        showsListCache.push(...shows);
        shows.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        shows.forEach((show) => {
          const option = document.createElement("option");
          option.value = show.id;
          option.textContent = show.name;
          showSelect.appendChild(option);
        });
      })
      .catch(() => {
        root.innerHTML = "<p style='color: red;'>Could not load show list.</p>";
      });
  }

  // Fetch episodes by show ID (only once per show)
  function fetchEpisodesForShow(showId) {
    if (showsCache[showId]) {
      allEpisodes = showsCache[showId];
      displayEpisodes(allEpisodes);
      populateEpisodeDropdown();
      return;
    }

    root.innerHTML = "<p>Loading episodes...</p>";
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((res) => res.json())
      .then((episodes) => {
        showsCache[showId] = episodes;
        allEpisodes = episodes;
        displayEpisodes(allEpisodes);
        populateEpisodeDropdown();
      })
      .catch(() => {
        root.innerHTML = "<p style='color: red;'>Could not load episodes.</p>";
      });
  }

  function displayEpisodes(episodes) {
    root.innerHTML = "";
    episodes.forEach((episode) => {
      const episodeDiv = document.createElement("div");
      episodeDiv.classList.add("episode");

      episodeDiv.innerHTML = `
        <h3>${episode.name} (${formatEpisodeCode(episode.season, episode.number)})</h3>
        <img src="${episode.image ? episode.image.medium : ''}" alt="Episode image">
        <p>${episode.summary}</p>
      `;
      root.appendChild(episodeDiv);
    });
    episodeCount.textContent = `${episodes.length} episode(s) found`;
  }

  function filterEpisodes() {
    const searchTerm = searchBar.value.toLowerCase();
    const filtered = allEpisodes.filter(ep =>
      ep.name.toLowerCase().includes(searchTerm) || ep.summary.toLowerCase().includes(searchTerm)
    );
    displayEpisodes(filtered);
  }

  function populateEpisodeDropdown() {
    episodeSelect.innerHTML = '<option value="">Select an episode</option>';
    allEpisodes.forEach((ep) => {
      const option = document.createElement("option");
      option.value = ep.id;
      option.textContent = `${formatEpisodeCode(ep.season, ep.number)} - ${ep.name}`;
      episodeSelect.appendChild(option);
    });
  }

  function jumpToEpisode() {
    const selectedId = episodeSelect.value;
    if (!selectedId) return;
    const selectedEpisode = allEpisodes.find(ep => ep.id == selectedId);
    displayEpisodes([selectedEpisode]);
  }

  // Event listeners
  searchBar.addEventListener("input", filterEpisodes);
  episodeSelect.addEventListener("change", jumpToEpisode);
  showSelect.addEventListener("change", (e) => {
    const showId = e.target.value;
    if (showId) fetchEpisodesForShow(showId);
  });

  fetchAllShows(); // Load on startup
});
 
function fetchEpisodes() {
  const root = document.getElementById("root");
  root.innerHTML = "<p>Loading episodes... please wait.</p>";

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch episodes. Please try again later.");
      }
      return response.json();
    })
    .then((data) => {
      allEpisodes = data;
      setup(); // 👈 start the rest of your app after fetch is successful
    })
    .catch((error) => {
      console.error(error);
      root.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

function setup() {
  makePageForEpisodes(allEpisodes);
  setupSearch(allEpisodes);
  EpisodeSelector(allEpisodes);
}

function setupSearch(allEpisodes) {
  const searchInput = document.getElementById("search");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
      return nameMatch || summaryMatch;
    });

    makePageForEpisodes(filteredEpisodes);
  });
}

function EpisodeSelector(allEpisodes) {
  const dropdown = document.getElementById("episode-select");
  dropdown.innerHTML = '<option value="">Select an Episode</option>';

  allEpisodes.forEach((episode) => {
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;

    const option = document.createElement("option");
    option.value = `episode-${episode.id}`;
    option.textContent = `${episodeCode} - ${episode.name}`;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener("change", (event) => {
    const episodeId = event.target.value;
    if (episodeId) {
      const target = document.getElementById(episodeId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

function makePageForEpisodes(episodeList) {
  render(episodeList);

  const footer = document.getElementById("footer");
  footer.innerHTML = ""; // Clear old credit in order to prevent duplicates

  // Credit note to TVMaze
  const credit = document.createElement("p");
  credit.innerHTML =
    'Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
  footer.appendChild(credit);
}

function render(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous content

  // Add episode count
  const count = document.getElementById("episode-count");
  count.textContent = `Got ${episodeList.length} episode(s)`;

  // create a container(div) to hold all the details of an episode
  episodeList.forEach((episode) => {
    const episodeDiv = document.createElement("div");
    episodeDiv.id = `episode-${episode.id}`;
    episodeDiv.classList.add("episode");

    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;

    // Create title for an episode
    const title = document.createElement("h2");
    title.textContent = `${episode.name} (${episodeCode})`;

    // Create an image for an episode
    const img = document.createElement("img");
    img.src = episode.image ? episode.image.medium : "placeholder.jpg";
    img.alt = episode.name;

    // Create a summary of the episode
    const summary = document.createElement("p");
    summary.innerHTML = episode.summary;

    // Create a link to the episode on TVMaze
    const link = document.createElement("a");
    link.href = episode.url;
    link.textContent = "View on TVMaze";
    link.target = "_blank";

    // Append all elements to episodeDiv
    episodeDiv.append(title, img, summary, link);

    // Append episodeDiv to the root element
    rootElem.appendChild(episodeDiv);
  });
}

window.onload = fetchEpisodes; // Start fetching episodes when page loads

