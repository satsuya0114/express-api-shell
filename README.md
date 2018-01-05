# import model from database

##install

```
# install global
npm install -g mysql2 sequelize-auto nodemon
# install project node_modules
npm install 
# startup server with nodemon
npm run dev
```

[ref](https://github.com/sequelize/sequelize-auto)
[serquelize-auto github](https://github.com/sequelize/sequelize-auto)

```
sequelize-auto -o "models" -d nice -h aurora-dev.nice-cam.com -u nicecam20 -p 3306 -x nicecamera20 -e mysql
sequelize-auto -o "test/models" -d nice -h aurora-dev.nice-cam.com -u nicecam20 -p 3306 -x nicecamera20 -e mysql
```
