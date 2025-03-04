# labline

Quickly see lab contacts in an emergency. Developed for UGA's Environmental Safety Division.

![home page](/.github/home.png)

Currently, the database requires some initial setup using the SQL files in /src/lib/server/db/schema

At any time after this, you can create a new user by setting the environment variable `CREATE_ACCOUNT` to the username of your OIDC account and restarting the labline container.
