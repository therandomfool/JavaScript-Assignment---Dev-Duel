import axios from "axios";

/**
 * Implements the `GET user` endpoint. Generates user data and returns it to the client.
 *
 * @param username of the GitHub user we are generating a response for.
 * @param response how the generated data is sent back to the client.
 */
export const generateUser = (username, response) => {
    (async() => {
        const githubUser = await getUser(username)
        const githubRepositories = await getRepositories(username)
        let data = generateData(githubUser)
        data.repositories = await generateRepositories(username, githubRepositories, data)
        const user = generateResponseBody(data)
        response.json(user)
    })()
}

/**
 * Implements the `GET users` endpoint. Generates user data and returns it to the client.
 *
 * @param usernames the array of usernames we are generating values of.
 * @param response how the users are returned to the client
 */
export const generateUsers = (usernames, response) => {
    (async() => {
        const queryUsernames = usernames.username
        let users = []
        for(let x = 0; x < queryUsernames.length; x++) {
            const username = queryUsernames[x]
            const githubUser = await getUser(username)
            const githubRepositories = await getRepositories(username)
            let data = generateData(githubUser)
            data.repositories = await generateRepositories(username, githubRepositories, data)
            const user = generateResponseBody(data)
            users.push(user)
        }
        response.json(users)
    })()
}

/**
 * Returns user object from GitHub's API.
 *
 * @param username of the user that is being fetched.
 * @returns {Promise<any>} the user information being returned by GitHub
 */
async function getUser(username) {
    const user = await axios.get(`users/${username}`);
    return user.data
}

/**
 * Returns a user's repositories from GitHub's API as an array of objects.
 *
 * @param username of the user whose repositories are being returned.
 * @returns {Promise<any>} repositories being returned.
 */

async function getRepositories(username, repositoryCount) {
    const pages = Math.floor(repositoryCount/100) +1
    let query = `user/${username}/repos?page=1&per_page=100`

    const response = await axios.get(query)
    let githubRepositories = response.data

    for (let i=2; i <= pages; i++) {
        query = `user/${username}/repos?page=${i}&per_page=100`
        const tempResponse = await axios.get(query);
        githubRepositories = githubRepositories.concat(tempResponse)
    }
    return githubRepositories
}


// async function getRepositories(username) {
//     const repositories = await axios.get(`users/${username}/repos`);
//     return repositories.data;
// }

/**
 * Returns the languages used in a specific user repository as an object. The object's keys represent the
 * language name, the values represent the amount of bits that each language uses in that project.
 *
 * @param username of the user who has the repository.
 * @param repository whose languages were fetching.
 * @returns {Promise<any>} the languages we're fetching.
 */
async function getLanguages(username, repository) {
    const languages = await axios.get(`repos/${username}/${repository}/languages`)
    return languages.data
}

/**
 * Organizes data to parse and iterate upon, this generates an object with the data used during user generation
 *
 * @param githubUser the github user we're storing the data for.
 * @returns See function to see what is being returned.
 */
function generateData(githubUser) {
    return {
        username: githubUser.login,
        name: githubUser.name,
        location: githubUser.location,
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
        languages: [],
        ponies: []
    }
}

// const totalStars = async () => {
//     let amount = 0;
//     repoData.forEach((repo) => {
//       amount += repo.stargazers_count;
//     });
//     return amount;
//   };


/**
 * Organizes the data we have stored from a user in the format that it needs to have before being sent back
 * to the client. Similar to generate data, but only with the relevant information for a response.
 * @param data
 * @returns see function for return type.
 */
function generateResponseBody(data) {
    return {
        username: data.username,
        name: data.name,
        location: data.location,
        email: data.email,
        bio: data.bio,
        avatar_url: data.avatar_url,
        titles: generateTitles(data),
        favorite_language: getMostUsedLanguage(data.languages),
        public_repos: data.public_repos,
        total_stars: data.stargazers_count,
        highest_starred: data.highestStarred,
        perfect_repos: data.perfectRepos,
        followers: data.followers,
        following: data.following
    };
}

/**
 * Generates an array with relevant information from the user repositories and populates the data relevant
 * to the response. Mainly used for parsing and storing data, this array of objects is not directly sent back
 * to the client, rather, information derived from it is.
 *
 * @param username of the GitHub user
 * @param githubRepositories GitHub repositories of the GitHub user
 * @param data of the GitHub user
 * @returns {Promise<[]>} array of objects each representing a repository of the user.
 */
async function generateRepositories(username, githubRepositories, data) {
    let repositories = []
    for(let x = 0; x < githubRepositories.length; x++) {
        const tempRepository = {
            name: githubRepositories[x].name,
            forked: githubRepositories[x].fork,
            stars: githubRepositories[x].stargazers_count,
            issues: githubRepositories[x].open_issues_count,
            languages: await generateLanguages(username, githubRepositories[x].name, data)
        }
        repositories.push(tempRepository)
        if(tempRepository.forked) data.forkCount++
        if(tempRepository.issues === 0) data.perfectRepos++
        data.starCount += tempRepository.stars
        if(tempRepository.stars > data.highestStarred) data.highestStarred = tempRepository.stars
    }
    data.languages = reduceLanguages(data)
    data.ponies = getPonies(data)
    return repositories
}

/**
 * Generates an array of languages representing the languages used in a specific repository, useful for some
 * of the titles that are being generated for the user, like One-Trick Pony and Jack of all Trades.
 *
 * @param username of the GitHub user.
 * @param name of the GitHub user's repository whose languages are being returned.
 * @param data of the user.
 * @returns {Promise<[]>} array of type [{ language: string, usage: number, pony: number }]
 */
async function generateLanguages(username, name, data) {
    const githubLanguages = await getLanguages(username, name)
    const languageName = Object.keys(githubLanguages)
    const languageUsage = Object.values(githubLanguages)
    let languages = []
    for(let x = 0; x < languageName.length; x++) {
        const language = {
            language: languageName[x],
            usage: languageUsage[x],
            pony: 1
        }
        languages.push(language)
        data.languages.push(language)
    }
    return languages
}

/**
 * Merges duplicate language objects to ensure that the master list of languages has unique values.
 * For example, if multiple repositories have JavaScript as a language and usage values of 10000, 40000, and
 * 100000, these values would be merged and there would only be one JavaScript value with the usage of
 * 150000. If the language is used in every public repository that the user owns, it means that the language is a
 * pony, which is also stored for title generation later.
 *
 * @param data of the user.
 * @returns [{language: string, usage: number, pony: boolean}]
 */
function reduceLanguages(data) {
    return data.languages.map(({ language }) => language)
        .filter((language, index, array) => array.indexOf(language) === index)
        .map(language => ({
            language,
            usage: data.languages.filter(entry => entry.language === language)
                .reduce((accum, { usage }) => accum + usage, 0),
            pony: data.languages.filter(entry => entry.language === language)
                .reduce((accum, { pony }) => accum + pony, 0) === data.public_repos
        }));
}

/**
 * Returns an array of strings that represent all the languages that are used in every public repository that the
 * user owns, useful for generating the One-Trick Pony title.
 *
 * @param data of the user.
 * @returns [string]
 */
function getPonies(data) {
    let ponies = []
    for(let x = 0; x < data.languages.length; x++) {
        if(data.languages[x].pony) {
            ponies.push(data.languages[x].language)
        }
    }
    return ponies
}

/**
 * Returns the most used language across every repository that the user owns.
 *
 * @param languages all the languages used in all the public repositories a user owns.
 * @returns string | null
 */
function getMostUsedLanguage(languages) {
    if(languages.length === 0) {
        return null
    }
    let mostUsed = languages[0]
    for(let x = 0; x < languages.length; x++) {
        if(mostUsed.usage < languages[x].usage) {
            mostUsed = languages[x]
        }
    }
    return mostUsed.language
}

/**
 * Generates and returns a user's titles based on specific requirements:
 *
 * - Forker: If more than half of the user's repositories are forked from other repositories.
 * - One-Trick Pony: If at least one language is used in all repositories that the user owns.
 * - Jack of all Trades: If more than 10 languages are used across all repositories that the user owns.
 * - Stalker: If the user follows more than twice as many users as the users following them.
 * - Mr. Popular: If the user is followed by more than twice of the users that they are following.
 * - Founder: If the account was created before or on 2009. GitHub was launched in 2008.
 * - Hatchling: If the account was created in 2021.
 * - One-Hit Wonder: If more than half of the user stars belong to a single repository.
 *
 * @param data of the user whose titles are being generated.
 * @returns [string]
 */
function generateTitles(data) {
    let titles = []
    if(data.forkCount > data.repositories.length / 2) {
        titles.push('Forker')
    }
    if(data.ponies.length > 0) {
        titles.push('One-Trick Pony')
    }
    if(data.languages.length > 10) {
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