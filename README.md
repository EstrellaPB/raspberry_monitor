# Raspberry Monitor

Raspberry Monitor is an app that handles monitoring and management of raspberries devices. It serves data related to device sensors and statuses.

## Installation

Install npm dependencies.

```bash
npm install
```

Install mongoose data seeder. This package helps in seeding the mongo database and must be installed globally.

```bash
npm install -g mongoose-data-seed
```

Run seeders to have default data for users, roles and permissions. [Oficial documentation](https://www.npmjs.com/package/mongoose-data-seed).

```bash
md-seed run
```

## License
[Proprietary]