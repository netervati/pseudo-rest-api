<script setup lang="ts">
  definePageMeta({
    layout: 'docs',
  });

  const supabase = useSupabaseClient();
  const img = reactive<{ [key: string]: string }>({});

  onMounted(() => {
    const map = {
      create_project: '0001-create-project.png',
      display_secret_key: '0002-display-secret-key-v1.1.png',
      display_api_key: '0003-display-api-key-v1.1.png',
      create_resource_model: '0004-create-resource-model.png',
      create_resource_data: '0005-create-resource-data-v1.1.png',
      display_resource_data: '0006-display-resource-data-v1.1.png',
      create_api_endpoint: '0007-create-api-endpoint.png',
      postman_request: '0008-postman-request-v1.1.png',
    };

    Object.keys(map).forEach((key: string) => {
      // @ts-ignore
      const { data } = supabase.storage.from('docs').getPublicUrl(map[key]);
      img[key] = data.publicUrl;
    });
  });
</script>

<template>
  <section class="p-6">
    <DocTitle>Getting started</DocTitle>
    <DocText>
      <b>PseudoRESTAPI</b> uses GitHub OAuth to authenticate its users. First,
      you need to create a GitHub account before you can sign in the
      application. Once this is done, you can now proceed with the basic
      concepts:
    </DocText>
    <DocList>
      <DocListItem>
        <b>Project</b> - refers to your mock server. Once you create a project,
        you will be given an API key and secret key to access your API
        endpoints.
      </DocListItem>
      <DocListItem>
        <b>APIs</b> - refers to the RESTful API endpoints. Each endpoint can be
        assigned with a resource, which will be returned in the endpoint's
        response.
      </DocListItem>
      <DocListItem>
        <b>Resources</b> - refers to the fake database. There are two sub
        modules here:
        <DocList class="mt-2 ml-6">
          <DocListItem>
            <b>Resource Models</b> - let's you define the schema for each
            database table.
          </DocListItem>
          <DocListItem>
            <b>Resource Data</b> - the fake data that populates your table.
          </DocListItem>
        </DocList>
      </DocListItem>
    </DocList>
    <DocHeader>Creating your first project</DocHeader>
    <DocText>
      Once you log in the application, click the <b>New Project</b> button and
      complete the form:
    </DocText>
    <img v-if="img?.create_project" :src="img.create_project" />
    <DocText>
      Then, click the save button. You will notice that after saving, a
      notification will appear on the page displaying your project's secret key.
      Make sure to copy this secret key since this is the only time that you
      will see it!
    </DocText>
    <img v-if="img?.display_secret_key" :src="img.display_secret_key" />
    <DocText>
      Afterwards, click your new project. This will redirect you to the
      <b>API</b> page.
    </DocText>
    <DocText>
      The next step is to create your resources and API endpoints, but before
      that, you must first acquire your API key. Click the settings button on
      the left navigation bar, then copy the API key below your project
      description:
    </DocText>
    <img v-if="img?.display_api_key" :src="img.display_api_key" />
    <DocText>
      Unlike the secret key, you can always view your API key in the
      <b>Settings</b> page.
    </DocText>
    <DocText>
      Now that you've obtained your API key, let's create your database!
    </DocText>
    <DocHeader>Designing and populating your database</DocHeader>
    <DocText>
      Click the resources button on the left navigation bar. This will redirect
      you to the <b>Resources</b> page where you will design the schema and
      generate the data for your fake database.
    </DocText>
    <DocText>
      To create your first model, click the <b>New Resource Model</b> button.
      You will be given many options to design your model but for now, you can
      follow the guide below:
    </DocText>
    <img v-if="img?.create_resource_model" :src="img.create_resource_model" />
    <DocText>
      You will notice that the table on the right side will adjust based on the
      schema that we designed earlier. We can populate the table by clicking the
      <b>Manage Data &#x27E8; New</b> button.
    </DocText>
    <img v-if="img?.create_resource_data" :src="img.create_resource_data" />
    <DocText>
      Adjust the slider based on the number of data that you want to generate,
      then click save.
    </DocText>
    <DocText>The table should now display your mock data:</DocText>
    <img v-if="img?.display_resource_data" :src="img.display_resource_data" />
    <DocText>
      We can add more resources later, but for now let's proceed with creating
      the API endpoint.
    </DocText>
    <DocHeader>Creating the API Endpoint</DocHeader>
    <DocText>
      The last step for your mock server is to create the API endpoint where you
      will expose the resources.
    </DocText>
    <DocText>
      Click the APIs button on the left navigation bar. This will redirect you
      to the <b>APIs</b> page.
    </DocText>
    <DocText>
      Afterwards, click the <b>New API</b> button and complete the form:
    </DocText>
    <img v-if="img?.create_api_endpoint" :src="img.create_api_endpoint" />
    <DocText>
      As you can see, you can select the resources that you created earlier in
      the previous section. Click save once you're satisfied with the details.
    </DocText>
    <DocText>We can now finally test your mock server.</DocText>
    <DocHeader>Testing the mock server</DocHeader>
    <DocText>
      You can test your API endpoint using cURL with the following format:
    </DocText>
    <pre class="p-3">curl -X GET https://gateway.pseudorestapi.com/api/{api-endpoint} -H "Accept: application/json" -u {api-key}:{secret-key}</pre>
    <DocText>
      Note that the gateway application uses the basic scheme to authenticate
      the user.
    </DocText>
    <DocText>Here's an example in postman:</DocText>
    <img v-if="img?.postman_request" :src="img.postman_request" />
    <DocText>That's it! You've now created your own mock server.</DocText>
  </section>
</template>
