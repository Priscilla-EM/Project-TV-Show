//You can edit ALL of the code here

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
