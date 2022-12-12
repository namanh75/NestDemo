## Running the app

```bash
# Run
$ npm run start

# Run in watch mode
$ npm run start:dev

# change your database
In the file app.module.ts replace your Mysql
```

## Test API

```bash
# api register
API: http://localhost:3000/users/register
Method: POST
Data: {
    username:"username",
    password:"password"
} 

# api login
http://localhost:3000/auth/login
Method: POST
Data: {
    username:"username",
    password:"password"
} 
Headers: {
    'Authorization': 'Bearer ' + access_token
}

# api logout
http://localhost:3000/auth/logout
Method: GET
Headers: {
    'Authorization': 'Bearer ' + refresh_token
}
# api refresh token
http://localhost:3000/auth/refresh-token/:username
Method: GET
Headers: {
    'Authorization': 'Bearer ' + refresh_token
}
```
