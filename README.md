# JavaScript Assignment - Dev Duel
# Assignment Overview

For this assignment, students are tasked with developing a small full-stack application that interfaces with [GitHub's API](https://developer.github.com/v3/) in order to aggregate, transform, and display a given user's profile and repository data.  

The assignment is composed of two independent pieces that make up a simple full-stack application.
	
1. A [Node](https://nodejs.org/en/docs/) **server** exposing an API using [Express](https://expressjs.com/en/api.html)
2. A Web-based **client** using [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML), [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), and [jQuery](https://api.jquery.com/)


This specification is split into multiple parts. 
- [Assignment Overview](README.md) - Gives a general overview of the assignment and technical requirements
- [Development](DEVELOPMENT.md) - Instructions on setting up development environment and servers
- [Client](client/README.md) - Requirements/Information specific to client-side web application implementation
- [Server](server/README.md) - Requirements/Information specific to Node API implementation

---

## Requirements Overview

Students will implement a web application along with a supporting API to get the following data for a given user's GitHub profile. The backend will be implemented as a Node API using Express that will call GitHub's API to fetch data necessary to derive/display the data specified. The user will see a home page where they can choose between two options: **inspect** or **duel**.

## Token setup

In order to increase your rate limit with the GitHub API and improve overall testability of your application as you develop, you will need to create and use a GitHub token. Instructions for this process are included in the [token-setup/README.md](token-setup/README.md).


### Profile

Profiles are displayed on both the **inspect** page and the **duel** page. Both pages display profiles the same way. They are composed of the same fields and there should be no differences between a `profile` displayed on either page.

All `profile`s displayed on the website will be composed of the following fields
- User's full name, location, bio, and avatar URL.
- Titles
    - **Forker** - 50% or more repositories are forked
    - **One-Trick Pony** - 100% of repositories use the same language
    - **Jack of all Trades** - Uses more than 10 languages across all repositories
    - **Stalker** - The number of people this user is `following` is at least double the number of `followers`
    - **Mr. Popular** - The number of `followers` this user has is at least double the number of `following`
    - One title of the student's choosing
- Favorite language (based on most used language used for public repositories)
- Total number of public repositories
- Total number of stars across all repositories
- Highest single repository star count
- Total number of 'perfect projects' (projects that have zero open issues)
- Total number of followers
- Total number of following

### Inspect
On the **inspect** page, a client will enter a username, submit, and be displayed the user's `profile` data.

### Duel
For the **duel** page, it is left up to the student to choose how a winner is determined. Two usernames will be entered, submitted, and their `profile` data displayed. Using the fields that are received from the API and displayed to the user, the student will need to visually signify differences in the data displayed as well as make an overall winner apparent to the user.

---

## As mentioned in the Assignment Overview at the top of this page, additional information and requirements for the server/client can be found in their respective folder's `README.md`.

#### [server/README.md](server/README.md)
#### [client/README.md](client/README.md)
