# express-api-shell

This is a express api project shell include unitTest (Jest) and database sequelize simple example

### version 
* nodeJS required : 6.9.4^ 
* EJS required : ES6


### install

```
npm install -g mysql2 sequelize-auto nodemon

npm install 

npm run dev
```

### import model from database

* [serquelize-auto github](https://github.com/sequelize/sequelize-auto)

```
sequelize-auto -o "models" -d nice -h aurora-dev.nice-cam.com -u nicecam20 -p 3306 -x nicecamera20 -e mysql
sequelize-auto -o "test/models" -d nice -h aurora-dev.nice-cam.com -u nicecam20 -p 3306 -x nicecamera20 -e mysql
```
