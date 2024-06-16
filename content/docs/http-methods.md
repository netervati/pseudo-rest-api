# HTTP Methods

**PseudoRESTAPI** exposes your models via [PseudoGatewayAPI](https://gateway.pseudorestapi.com/). You can use any tool to send requests to your fake server. Just make sure to encode your credentials in **base64** string.

## GET

```js
curl -X GET \
  https://gateway.pseudorestapi.com/api/{model-name} \
  -H "Accept: application/json" \
  -u {api-key}:{secret-key}
```

## GET by ID

```js
curl -X GET \
  https://gateway.pseudorestapi.com/api/{model-name}/{id} \
  -H "Accept: application/json" \
  -u {api-key}:{secret-key}
```

## POST

```js
curl -X POST \
  https://gateway.pseudorestapi.com/{model-name} \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -u {api-key}:{secret-key} \
  -d '{"key1": "value1", "key2": "value2"}'
```

## PUT

```js
curl -X PUT \
  https://gateway.pseudorestapi.com/{model-name}/{id} \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -u {api-key}:{secret-key} \
  -d '{"key1": "value1", "key2": "value2"}'
```

## DELETE

```js
curl -X DELETE \
  https://gateway.pseudorestapi.com/{model-name}/{id} \
  -H "Accept: application/json" \
  -u {api-key}:{secret-key}
```
