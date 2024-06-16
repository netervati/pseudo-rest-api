# Getting started

**PseudoRESTAPI** uses GitHub OAuth to authenticate its users. First, you need to create a GitHub account before you can sign in the platform. Once this is done, you can now login.

## Creating your first app

Think of apps as fake servers, which can help you organize and group your fake endpoints.

- To create an app, click the **New App** button on the dashboard and complete the form. Click, the **Proceed** button afterwards.

- You will notice that after saving, a notification will appear on the page displaying your app's secret key. Make sure to copy this secret key as <u>this will be the only time that you will see it!<u>

- Afterwards, click your new app. This will redirect you to the **Models** page.

- The next step is to create your first model, but before that, let's grab your API key. Click the settings button on the left navigation bar, then copy the API key below your app description. Unlike the secret key, you can always view your API key on the **Settings** page.

Now that you've obtained your API key, let's create your models!

## Designing and populating your models

- Click the models button on the left navigation bar. This will redirect you to the **Models** page where you will design the schema and generate the data for your fake database.

- To create your first model, click the **New Model** button. Design your model based on your needs, then click **Proceed**.

- After saving, the model should appear as a tab menu in the page. Click on the new model and then click the insert (`+`) model data button.

- Adjust the slider based on the number of data that you want to generate, and complete the form. Then, click **Proceed**.

- The table should now display your fake data.

## Testing your fake server

You can test your API endpoint using cURL with the following format:

```js
curl -X GET \
  https://gateway.pseudorestapi.com/{model-name} \
  -H "Accept: application/json" \
  -u {api-key}:{secret-key}
```

That's it! You've now created your fake server.
