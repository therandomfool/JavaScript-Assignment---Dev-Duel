import axios from "axios";

export const generateUser = (username, response) => {
    (async() => {
        const githubUser = await getUser(username)
        const githubRepositories = await getRepositories(username, githubUser.public_repos)
        let data = generateData(githubUser)
        data.repositories = await generateRepositories(username, githubRepositories, data)
        const user = generateResponseBody(data)
        response.json(user)
    })()
}

export const generateUsers = (usernames, response) => {
    (async() => {
        const queryUsernames = usernames.username
        let users = []
        for(let x = 0; x < queryUsernames.length; x++) {
            const username = queryUsernames[x]
            const githubUser = await getUser(username)
            const githubRepositories = await getRepositories(username, githubUser.public_repos)
            let data = generateData(githubUser)
            data.repositories = await generateRepositories(username, githubRepositories, data)
            const user = generateResponseBody(data)
            users.push(user)
        }
        response.json(users)
    })()
}

export async function getUser(username) {
    const user = await axios.get(`users/${username}`);
    return user.data
}

export async function getRepositories(username, repositoryCount) {
    const pages = Math.floor(repositoryCount / 100) + 1
    let query = `users/${username}/repos?page=1&per_page=100`
    const response = await axios.get(query);
    let githubRepositories = response.data
    for(let x = 2; x <= pages; x++) {
        query = `users/${username}/repos?page=${x}&per_page=100`
        const tempResponse = await axios.get(query);
        githubRepositories = githubRepositories.concat(tempResponse.data)
    }
    return githubRepositories;
}

function generateData(githubUser) {
    return {
        username: githubUser.login,
        name: githubUser.name !== null ? githubUser.name : 'No name provided',
        location: githubUser.location !== null ? githubUser.location : 'No location provided',
        email: githubUser.email !== null ? githubUser.email : 'No email provided.',
        bio: githubUser.bio !== null ? githubUser.bio : 'No bio provided.',
        avatar_url: githubUser.avatar_url,
        public_repos: githubUser.public_repos,
        total_stars: githubUser.starCount,
        highest_starred: githubUser.highestStarred,
        perfect_repos: githubUser.perfectRepos,
        followers: githubUser.followers,
        following: githubUser.following,
        starCount: 0,
        highestStarred: 0,
        perfectRepos: 0,
        forkCount: 0,
        createdYear: parseInt((githubUser.created_at).substr(0, 4), 10),
        repositories: [],
        languages: []
    }
}

async function generateRepositories(username, githubRepositories, data) {
    let repositories = []
    for(let x = 0; x < githubRepositories.length; x++) {
        const tempRepository = {
            name: githubRepositories[x].name,
            forked: githubRepositories[x].fork,
            stars: githubRepositories[x].stargazers_count,
            issues: githubRepositories[x].open_issues_count,
            language: githubRepositories[x].language
        }
        data.languages.push(tempRepository.language)
        repositories.push(tempRepository)
        if(tempRepository.forked) data.forkCount++
        if(tempRepository.issues === 0) data.perfectRepos++
        data.starCount += tempRepository.stars
        if(tempRepository.stars > data.highestStarred) data.highestStarred = tempRepository.stars
    }
    return repositories
}

function generateResponseBody(data) {
    return {
        username: data.username,
        name: data.name,
        location: data.location,
        email: data.email,
        bio: data.bio,
        avatar_url: data.avatar_url,
        titles: generateTitles(data),
        favorite_language: getFavoriteLanguage(data.languages),
        public_repos: data.public_repos,
        total_stars: data.starCount,
        highest_starred: data.highestStarred,
        perfect_repos: data.perfectRepos,
        followers: data.followers,
        following: data.following
    };
}

function generateTitles(data) {
    let titles = []
    if(data.forkCount > data.repositories.length / 2) {
        titles.push('Forker')
    }
    if(getPony(data.languages)) {
        titles.push('One-Trick Pony')
    }
    if(getUniqueLanguages(data.languages).length > 10) {
        titles.push('Jack of all Trades')
    }
    if(data.following > data.followers * 2) {
        titles.push('Stalker')
    }
    if(data.followers > data.following * 2) {
        titles.push('Mr. Popular')
    }
    if(data.createdYear <= 2009) {
        titles.push('Founder')
    }
    else if(data.createdYear === 2021) {
        titles.push('Hatchling')
    }
    if(data.starCount * 0.5 < data.highestStarred) {
        titles.push('One-Hit Wonder')
    }
    return titles
}

function getFavoriteLanguage(languages) {
    let compare = '';
    let mostFrequentLanguage = '';
    languages.reduce((acc, val) => {
        if(val in acc) {
            acc[val]++;
        }
        else {
            acc[val] = 1;
        }
        if(acc[val] > compare) {
            compare = acc[val];
            mostFrequentLanguage = val;
        }
        return acc;
    }, {})
    return mostFrequentLanguage
}

function getPony(languages) {
    let pony = true
    if(languages.length === 0) {
        return pony
    }
    for(let x = 1; x < languages.length && pony; x++) {
        if(languages[x - 1] !== languages[x]) {
            pony = false
        }
    }
    return pony
}

function getUniqueLanguages(languages) {
    return languages.filter((language, index, ar) => ar.indexOf(language) === index)
}