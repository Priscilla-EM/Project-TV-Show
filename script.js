//You can edit ALL of the code here
let allEpisodes = [];

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
