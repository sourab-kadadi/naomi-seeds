## Project setup

1. Use NodeJS v18.16.0
2. Use nestjs-cli v9.4.0


## Install node packages

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

## Debug mode (use this mode for Development)
$ npm run start:debug

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

npm run start:debug to start with debugger
## open localhost:2000/api to check the swagger page for listed endpoints


Steps To use debugger 

1. add this in vscode launch.json file

{
    "version": "0.2.0",
    "configurations": [
      {
        "name": "Debug NestJS",
        "type": "node",
        "request": "attach",
        "port": 9229,
        "restart": true,
        "timeout": 10000,
        "sourceMaps": true,
        "outFiles": ["${workspaceFolder}/dist/**/*.js"]
      }
    ]
  }
  
2. in the terminal run    npm run start:debug
3. select the debugger in the run and debug 
4. add debugger; where it is required

other option would be to use console.log()



NODE_OPTIONS="--inspect=0.0.0.0:9229" npm run start:debug


installing chrome on gitpod terminal
run the following below commands

sudo apt-get update

sudo apt-get install -y wget gnupg ca-certificates


wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/google-chrome-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/google-chrome-archive-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list

sudo apt-get update
sudo apt-get install -y google-chrome-stable


