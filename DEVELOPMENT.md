# Development Environment Setup

### Technologies Used
- [nodemon](https://github.com/remy/nodemon#nodemon) - Watches code and restarts server
- [live-server](https://expressjs.com/en/4x/api.html) - Watches code and serves static files
	
### Up and running
There are three scripts in the `package.json` that are used to serve our application.

**`npm run serve-api`** Uses `babel-node` and `nodemon` to transpile and run our express API. It will watch for changes to any of your JavaScript code in the `/server/` directory and reload the server automatically.

**`npm run serve-static`** - Uses `live-server` to serve our static HTML/CSS/JS files in our `/client/` directory.

**`npm run serve`** - Runs `serve-api` and `serve-static` in parallel

---

**`http://localhost:3000/api`** - Development URL for the Node API. To ensure it is running properly, navigate to `http://localhost:3000/api/health-check`

To change the port that the API is running on, edit the `PORT` in the environment's `.env` file. For development, it will be in `/server/.env.development`.

**`http://localhost:8080/`** - development URL for the static files that make up the website 

To change the port that the static files are served on, edit the `--port` flag within the `serve-static` script in the `package.json`. 

---

### That's it!
