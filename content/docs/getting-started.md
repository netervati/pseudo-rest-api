# Getting started

**PseudoRESTAPI** uses GitHub OAuth to authenticate its users. First, you need to create a GitHub account before you can sign in the application. Once this is done, you can now proceed with the basic concepts:

- **Project** - refers to your mock server. Once you create a project, you will be given an API key and secret key to access your API endpoints.

- **APIs** - refers to the RESTful API endpoints. Each endpoint can be assigned with a resource, which will be returned in the endpoint's response.

- **Resources** - refers to the fake database. There are two sub modules here:

<ul class="ml-6">

  <li><b>Resource Models</b> - let's you define the schema for each database table.</li>

  <li><b>Resource Data</b> - the fake data that populates your table.</li>

</ul>

## Creating your first project

Once you log in the application, click the **New Project** button and complete the form:

![Create Project](https://cgspqoueygtgcuofenqv.supabase.co/storage/v1/object/public/docs/0001-create-project.png)

Then, click the save button. You will notice that after saving, a notification will appear on the page displaying your project's secret key. Make sure to copy this secret key since this is the only time that you will see it!

![Display Secret Key](https://cgspqoueygtgcuofenqv.supabase.co/storage/v1/object/public/docs/0002-display-secret-key-v1.1.png)

Afterwards, click your new project. This will redirect you to the **API** page.

The next step is to create your resources and API endpoints, but before that, you must first acquire your API key. Click the settings button on the left navigation bar, then copy the API key below your project description:

![Display API Key](https://cgspqoueygtgcuofenqv.supabase.co/storage/v1/object/public/docs/0003-display-api-key-v1.1.png)

Unlike the secret key, you can always view your API key in the **Settings** page.

Now that you've obtained your API key, let's create your database!

## Designing and populating your database

Click the resources button on the left navigation bar. This will redirect you to the **Resources** page where you will design the schema and generate the data for your fake database.

To create your first model, click the **New Resource Model** button. You will be given many options to design your model but for now, you can follow the guide below:

![Create Resource Model](https://cgspqoueygtgcuofenqv.supabase.co/storage/v1/object/public/docs/0004-create-resource-model.png)

You will notice that the table on the right side will adjust based on the schema that we designed earlier. We can populate the table by clicking the **Manage Data < New** button.

![Create Resource Data](https://cgspqoueygtgcuofenqv.supabase.co/storage/v1/object/public/docs/0005-create-resource-data-v1.1.png)

Adjust the slider based on the number of data that you want to generate, then click save.

The table should now display your mock data:

![Display Resource Data](https://cgspqoueygtgcuofenqv.supabase.co/storage/v1/object/public/docs/0006-display-resource-data-v1.1.png)

We can add more resources later, but for now let's proceed with creating the API endpoint.

## Creating the API Endpoint

The last step for your mock server is to create the API endpoint where you will expose the resources.

Click the APIs button on the left navigation bar. This will redirect you to the **API** page.

Afterwards, click the **New API** button and complete the form:

![Create API Endpoint](https://cgspqoueygtgcuofenqv.supabase.co/storage/v1/object/public/docs/0007-create-api-endpoint.png)

As you can see, you can select the resources that you created earlier in the previous section. Click save once you're satisfied with the details.

We can now finally test your mock server.

## Testing the mock server

You can test your API endpoint using cURL with the following format:

```curl
curl -X GET https://gateway.pseudorestapi.com/api/{api-endpoint} -H "Accept: application/json" -u {api-key}:{secret-key}
```

Note that the gateway application uses the basic scheme to authenticate the user.

Here's an example in postman:

![Postman Request](https://cgspqoueygtgcuofenqv.supabase.co/storage/v1/object/public/docs/0008-postman-request-v1.1.png)

That's it! You've now created your own mock server.
