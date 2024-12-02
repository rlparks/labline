# labline

Quickly see lab contacts in an emergency. Developed for UGA's Environmental Safety Division.

![home page](/.github/home.png)

After starting the stack for the first time, create the database schema by running

```
docker exec -it labline npm run db:push
```

At any time after this, you can create a new user by setting the environment variable `CREATE_ACCOUNT` to the username of your OIDC account and restarting the labline container.
