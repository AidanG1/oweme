# OweMe 💴💶💷💵
Your personal expense mediator.

**Split Bills, not Friendships**

OweMe takes the awkwardness out of shared expenses. Easily track, split, and settle bills with roommates, friends, or anyone you share costs with -- hassle free! Scan receipts, divide costs, and settle up in seconds.

### Created by 
- Aidan Gerber
- Nat Hill 
- Franklin Dai
- Yimo Wang

for [HackRice14](https://hackrice14.devpost.com/)

## Inspiration

We're all sick and tired of the awkwardness that comes with splitting bills, especially right after someone pays. Whether it's with roommates, friends, or family, it's always a hassle to keep track of who owes who what. We wanted to create a simple, easy-to-use app that would take the awkwardness out of shared expenses. Existing competition is terrible for itemization and generally not user-friendly. We wanted to create a solution that would be easy to use and would make splitting bills a breeze.

## What it does
OweMe allows for easy itemization of shared expenses. Simply take a picture of the receipt, and OweMe will automatically itemize the receipt and allow you to split the bill with your friends. You can easily add or remove items as well as settle up, and OweMe will keep track of who owes who what. OweMe is the perfect solution for roommates, friends, and family who want to split bills without the awkwardness.

## How we built it
We built OweMe using SvelteKit, Bun, ShadCN, Capacitor, and Supabase. We used SvelteKit for the frontend, Bun for the building and runtime, ShadCN for the design system, Capacitor for the mobile app, and Supabase for the backend. We used ShadCN to create a beautiful, consistent design system that would make our app look great. We used Capacitor to create a mobile app that would work on both iOS and Android. We used Supabase to store user data and receipts, as well as to handle authentication. Additionally, we accessed the OpenAI API to help with itemization and receipt parsing.

## Challenges we ran into
One of our biggest challenges was simply building all the features. This year of hacking, we wanted to create not only a single feature or a proof of concept like we had in the past but a fully functional app that we weren't just going to throw out after the hackathon. This meant writing good, secure, and modular code that would be easy to maintain which was a substantial challenge in the short time frame. Most of the largest challenge was making sure that every page had correct logic, styling, accessibility (thanks Svelte), and responsiveness.

## Accomplishments that we're proud of
The biggest is certainly building such a stylish and functional app. We have some really cool features like automatic receipt scanning and parsing, a complete friends system, and placing itemization at the forefront. To complete the itemization flow, we have a complex hierarchy of types to make sure we're not repeating information between transactions, transactions items, and owed payments. 
We're also proud of the design system we created using ShadCN, which makes our app look great and consistent across all pages. 
Additionally, our app runs on and is installable on IOS, Android, and the web.

## What we learned


## What's next for OweMe


---

### create-svelte

## Commands
```bash
bun run update-types --project-id veaseskfycpcrozeqgib
```
```bash
bunx shadcn-svelte@latest add button
```


## Svelte things
Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
