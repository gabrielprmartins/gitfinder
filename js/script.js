import GitHubApi from './modules/github-api.js';

const gitApi = new GitHubApi('.button-search', '.structure');
gitApi.init();