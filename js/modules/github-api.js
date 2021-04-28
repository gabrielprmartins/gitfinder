export default class GitHubApi {
  constructor(button) {
    this.button = document.querySelector(button);

    this.addGitSearchEvent = this.addGitSearchEvent.bind(this);
  }

  formatInputValue(event) {
    this.input = event.target.previousElementSibling.value.trim();
  }
  
  fetchUser(event) {
    event.preventDefault();
    if (this.input.length > 0) {
      event.target.disabled = true;
      this.urlUser = 'https://api.github.com/users';
      fetch(`${this.urlUser}/${this.input}`)
      .then(response => response.json())
      .then(json => {
        if (json.message !== 'Not Found') {
          const { login, name, bio, followers, following, html_url, avatar_url } = json;
          this.templateUser = `
            <section class="user-data">
              <div class="column">
                <a href="${html_url}" class="username">@${login}</a>
                <h1 class="main-title">${name}</h1>
                <h2 class="title user-desc">${bio ? bio : ''}</h2>
                <strong class="follow">${followers} followers | ${following} following</strong>
                <div class="options">
                  <a href="#repositories" class="btn btn-rep">Repositories</a>
                  <a href="" class="btn btn-search">New Search</a>
                </div>
              </div>
              <figure class="user-img">
                <img src="${avatar_url}" alt="${name}">
              </figure>
            </section>
          `;
          
          this.structure = document.querySelector('.structure');
          this.structure.classList.remove('main');
          this.structure.classList.add('animate', 'user-main');
          this.structure.innerHTML = this.templateUser;

        } else {
          alert('Username not found');
        }
      });
      return;
    }
    alert('Please, write before search.');
  }

  fetchRepositories() {
    this.urlRepositories = `https://api.github.com/users/${this.input}/repos`;
    fetch(`${this.urlRepositories}`)
    .then(response => response.json())
    .then(json => {
      json.forEach(({ name, stargazers_count, forks, description, language, html_url }) => {
        this.templateRepositories += `
          <a href="${html_url}" target="_blank" class="rep-item">
            <h2 class="rep-title">${name}</h2>
            <p class="paragraph p-rep">${description ? description : ''}</p>
            <ul class="rep-info">
              <li>${language ? language : ''}</li>
              <li class="stars">${stargazers_count}</li>
              <li class="forks">${forks}</li>
            </ul>
          </a>
        `;
      });

      this.structure.innerHTML += `
        <section class="repositories" id="repositories">
          <h1 class="main-title">All your repositories</h1>
          <div class="grid-rep">
            ${this.templateRepositories.replace('undefined', '')}
          </div>
        </section>
      `;

      const backButton = this.structure.querySelector('.btn-search');
      backButton.addEventListener('click', window.onload);
    });
  }

  addGitSearchEvent() {
    this.button.addEventListener('click', this.formatInputValue);
    this.button.addEventListener('click', this.fetchUser);
    this.button.addEventListener('click', this.fetchRepositories);
  }

  init() {
    if (this.button) {
      this.addGitSearchEvent();
    }
    return this;
  }
}
