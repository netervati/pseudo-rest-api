# PseudoRESTAPI

![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/netervati/pseudo-rest-api/build.yml?branch=main&style=flat-square)
![GitHub deployments](https://img.shields.io/github/deployments/netervati/pseudo-rest-api/production?label=vercel&logo=vercel&logoColor=white)

[Introduction](https://github.com/netervati/collected-thoughts/blob/main/docs/introduction.md)

**PseudoRESTAPI** is a tool that enables you to create mock REST APIs quickly and easily, without requiring any language or framework skills.

- Create API endpoints for your mock server
- Design the schema for your fake database
- Generate data based on the schema

## Technologies

- Nuxt3
- TypeScript
- Pinia
- DaisyUI
- Tailwindcss
- Supabase
- Vercel

## Architecture

![Architecture Diagram](https://raw.githubusercontent.com/netervati/pseudo-rest-api/main/docs/assets/architecture.png)

**PseudoRESTAPI** has two main applications: the web and the gateway.

The web application serves as the interface where users can create resources that are accessible through the gateway application. The gateway exposes these resources through a RESTful endpoint, which the user also creates within the web application.

The user is given an API key and secret key to access each endpoint in the gateway. Further details regarding this topic can be read in the documentation.
