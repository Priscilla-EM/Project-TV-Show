//You can edit ALL of the code here

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
 
