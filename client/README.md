# Dev Duel - Client

## Overview

The client will be written using HTML, CSS, JavaScript and [jQuery](https://api.jquery.com/). JQuery is a cross-platform JavaScript library designed to simplify the client-side scripting of HTML - It has been included in the project skeleton. 

An extensive skeleton has been provided which includes live-reloading with a sturdy HTML foundation as well responsive and mobile-friendly stylesheets using  [flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/). The design is minimal and primarily focused on structure. It is up to the student to be creative and build on top of it and experiment with their own design.

### Technologies Used
- HTML/CSS/JavaScript
- [jQuery](https://api.jquery.com/) - Convenient DOM manipulation
- [flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) - Quick and easy layouts
- [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - Promise-based interface for fetching resources

### API endpoints available
Below are the endpoints that will be available to our front-end application. The examples will assume the API is running on `localhost:3000` for convenience.

---

#### `GET localhost:3000/api/user/:username`
Returns a profile for a given user

##### Example request:
`http://localhost:3000/api/user/gaearon`

##### Example response:
(The numbers in this example are mostly made up - it is meant to serve an example of the structure)
```json
{
    "username": "gaearon",
    "name": "Dan Abramov",
    "location": "London, UK",
    "bio": "Working on @reactjs. Co-author of Redux and Create React App. Building tools for humans.",
    "avatar-url": "https://avatars0.githubusercontent.com/u/810438?v=4",
    "titles": [
        "Jack of all Trades",
        "Mr. Popular"
    ],
    "favorite-language": "JavaScript",
    "public-repos": 227,
    "total-stars": 120580,
    "highest-starred": 45820,
    "perfect-repos": 2,
    "followers": 33015,
    "following": 171
}
```
---
#### `GET localhost:3000/api/users?`
Returns an array of profiles for the queried usernames

##### Example request:
`http://localhost:3000/api/users?username=gaearon&username=qbolt`

##### Example response:
(The numbers in this example are mostly made up - it is meant to serve an example of the structure)
```json
[{
    "username": "gaearon",
    "name": "Dan Abramov",
    "location": "London, UK",
    "bio": "Working on @reactjs. Co-author of Redux and Create React App. Building tools for humans.",
    "avatar-url": "https://avatars0.githubusercontent.com/u/810438?v=4",
    "titles": [
        "Jack of all Trades",
        "Mr. Popular"
    ],
    "favorite-language": "JavaScript",
    "public-repos": 227,
    "total-stars": 120580,
    "highest-starred": 45820,
    "perfect-repos": 2,
    "followers": 33015,
    "following": 171
}, {
    "username": "qbolt",
    "name": "Quinton Bolt",
    "location": "Memphis, TN",
    "bio": "Designer/Developer",
    "avatar_url": "https://avatars0.githubusercontent.com/u/17500092?v=4",
    "titles": [
        "Forker",
        "Mr. Popular"
    ],
    "favorite-language": "JavaScript",
    "public-repos": 42,
    "total-stars": 5,
    "highest-starred": 3,
    "perfect-repos": 2,
    "followers": 4,
    "following": 0
}]
```


### Profile

**This will expand on some specifics of various derived fields displayed for a profile.** An overview of the entire profile is provided on the [README.md](README.md) shown in the root of this repository. 

- The titles are made up for the purposes of this assessment and **are not** part of GitHub or their API. They will be derived and provided by the API. 
- The avatar_url will be displayed in an `<img>` tag.
- Favorite language is referring to the language field given to all repositories that indicate what language is used the most throughout a repository. This stat will be which appears most throughout all repositories.
- Highest single repository star count is referring to the number of stars on the repository that has the most stars. It is not referring to the name of the repository with the most stars.
- Total number of 'perfect repositories' is a made-up arbitrary stat referring to the number of repositories that have zero `open_issues`

### Inspect
For the `inspect` page, the student is given an HTML/CSS skeleton that has placeholder data. The username will be entered, the `inspect` button will be clicked, and a 'form submit' event will be fired. The `inspect.js` file already has an event listener created. It will be up to the student to `fetch` the data from the API for the user entered and manipulate the DOM using jQuery to fill in the values on the page and toggle the display of the container element. 

### Duel
Similar to the `inspect` page, an HTML/CSS skeleton is given which contains placeholder data. The student will need to get two usernames from the user and listen for a form submit event. There is no javascript given for this page. It is up to the student to implement everything required for the **duel** page as well as to çhoose how a winner is determined. Two usernames will be entered, submitted, and their `profile` data displayed. Using the fields that are received from the API and displayed to the user, the student will need to visually signify differences in the data displayed as well as make an overall winner apparent to the user.

---
### Error Handling
The API should handle the majority of errors that could happen such as a user not existing, github being down, or input validation for usernames. However, the API does not and should not limit or require the `api/users` route take a specific number of names. Front-end validation will be required to ensure the user enters two names on the `duel` page and display an appropriate error message if the user fails to do so. After ensuring the user has entered the correct number of names on both pages, it will proceed to call the API. After calling the API, if there are backend errors returned by the API, these should be displayed appropriately to the user.

