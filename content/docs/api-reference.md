# API Reference (WIP)

**PseudoRESTAPI** exposes your API endpoints via the [gateway](https://gateway.pseudorestapi.com/). Currently, it only supports GET requests.

## List Resources

This will return all resources that are associated on that endpoint:

```curl
curl -X GET https://gateway.pseudorestapi.com/api/{api-endpoint} -H "Accept: application/json" -u {api-key}:{secret-key}
```

You can also filter the list by the resource attribute, which you define when creating your **Resource Model**.

For example, let's say our API endpoint is `employees` and it returns the following JSON data:

```json
[
  {
    "id": "32bdcb50-b9b8-4195-9b41-a915af76ee0d",
    "fullname": "Ramona Corkery",
    "position": "Developer"
  },
  {
    "id": "dd0adf02-5d18-4a7b-a9ab-43d3b55e0bc6",
    "fullname": "Edward Okuneva",
    "position": "Associate"
  },
  {
    "id": "12d89157-0de4-4ca0-ae3d-1ef017eb3cb4",
    "fullname": "Pat Botsford",
    "position": "Consultant"
  }
]
```

We can filter the result by the `position` through the query params: `/api/employees?position=Consultant`

## Retrieve Resource by ID

This will return a specific resource by passing its ID:

```curl
curl -X GET https://gateway.pseudorestapi.com/api/{api-endpoint}/{resource-id} -H "Accept: application/json" -u {api-key}:{secret-key}
```
