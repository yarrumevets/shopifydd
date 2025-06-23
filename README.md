# 🛍️ shopifydd

- Shopify digital products fulfillment app

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Roadmap](#roadmap)
- [Installation](#installation)
- [Tech](#tech)
- [Setup](#setup)
- [Usage](#usage)
- [Resources](#resources)

## Introduction

- Shopify digital products fulfilment app

## Tech

- Simple vanilla JavaScript front-end &amp; back-end (Node/Express)
- Shopify API integration
- AWS S3 integration
- JSON file read/write in lieu of database integration
- GraphQL client

## Features

- Stores order information for a Shopify store
- Allows customers to link to the app and receive signed URLs to their digital products stored in AWS S3
- JSON files for storing and retrieving order and product information
- Shopify webhook verification with HMAC verification
- Simple config for easy white labeling (Page title).
- Configuration sample files for each of the gitignored files.

## Roadmap

In no particular order:

- Send more user-friendly information along with URLS: images, title, (SKU), etc.
- Get and store SKU with product info.
- Implement optional MongoDB integration for storing products, orders, and logs.
- Logging for: errors, duplicates orders, etc.
- Login/auth needed for admin page
- Front-end and api endpoints for adding/editing products
- Use products/create to add products automatically from Shopify (check SKU for)
- User page - returning users can look up their files, see new versions, etc.
- Security features to deal with the bulk of bots, crawlers.

## Installation

Step-by-step instructions on how to get the development environment running.

```bash
git clone https://github.com/yarrumevets/shopifydd.git
cd shopifydd
yarn
```

## Setup

You'll need to rename all the files starting 'SAMPLE.'

- SAMPLE.aws.secret.js , SAMPLE.shopify.secret.js, SAMPLE.products.json, SAMPLE.orders.json, public/SAMPLE.config.js,

## Usage

```bash
node server.js
```

Go to `http://localhost:4199/digitalorder/0000000000000` in your browser.

## Resources

HMAC docs: https://nodejs.org/api/crypto.html#class-hmac
