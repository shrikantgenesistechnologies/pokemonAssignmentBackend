# Pokemon App Backend

## To Start local dev enviornment

### Need to install all dependencies:

```bash
npm ci
```

If you are facing issues running `npm ci` then please try with following cmd:

```bash
npm install
```

### Create `.env` by copying `.env.example` file. Cretae database named `pokemon` and update your mysql database credentials in `.env` file:

```bash
DB_USERNAME=<username>
DB_PASSWORD=<password>
```

Run seeder command:

```bash
npm run seeder
```

If database credentials are valid then seeder will execute successfully.

### Start application:

```bash
npm run start
```
### Swagger URL:

```bash
http://localhost:4000/api
```