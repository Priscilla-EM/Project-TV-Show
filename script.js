//You can edit ALL of the code here

document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const episodeSelect = document.getElementById("episode-select");
  const root = document.getElementById("root");
  const episodeCount = document.getElementById("episode-count");
  let allEpisodes = getAllEpisodes();

  function displayEpisodes(episodes) {
      root.innerHTML = "";
      episodes.forEach(episode => {
          const episodeElement = document.createElement("div");
          episodeElement.classList.add("episode");
          episodeElement.innerHTML = `
              <h3>${episode.name} (S${String(episode.season).padStart(2, '0')}E${String(episode.number).padStart(2, '0')})</h3>
              <img src="${episode.image ? episode.image.medium : ''}" alt="Episode image">
              <p>${episode.summary}</p>
          `;
          root.appendChild(episodeElement);
      });
      episodeCount.textContent = `${episodes.length} episode(s) found`;
  }

  function filterEpisodes() {
      const searchTerm = searchBar.value.toLowerCase();
      const filteredEpisodes = allEpisodes.filter(episode => 
          episode.name.toLowerCase().includes(searchTerm) || 
          episode.summary.toLowerCase().includes(searchTerm)
      );
      displayEpisodes(filteredEpisodes);
  }

  function populateEpisodeDropdown() {
      episodeSelect.innerHTML = '<option value="">Select an episode</option>';
      allEpisodes.forEach(episode => {
          const option = document.createElement("option");
          option.value = episode.id;
          option.textContent = `S${String(episode.season).padStart(2, '0')}E${String(episode.number).padStart(2, '0')} - ${episode.name}`;
          episodeSelect.appendChild(option);
      });
  }

  function jumpToEpisode() {
      const selectedId = episodeSelect.value;
      if (!selectedId) return;
      const selectedEpisode = allEpisodes.find(ep => ep.id == selectedId);
      displayEpisodes([selectedEpisode]);
  }

  searchBar.addEventListener("input", filterEpisodes);
  episodeSelect.addEventListener("change", jumpToEpisode);

  displayEpisodes(allEpisodes);
  populateEpisodeDropdown();
});


function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  // create a container(div) to hold all the details of an episode
  episodeList.forEach((episode) => {
    const episodeDiv = document.createElement("div");
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

    // Credit note to TVMaze
    const credit = document.createElement("p");
    credit.innerHTML =
      'Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
    rootElem.appendChild(credit);

    // Append all elements to episodeDiv
    episodeDiv.append(title, img, summary, link);

    // Append episodeDiv to the root element
    rootElem.appendChild(episodeDiv);
  });
}

window.onload = setup;



