# Playwright Demo with TypeScript
### My Playwright implementation for web automation

## Installation

1. Clone this repository to your local machine using Git:

```bash
git clone https://github.com/qasimmahmood95/playwright-demo-ts.git

```

2. Navigate to the project directory:

```bash
cd playwright-demo-ts
```

3. Install the project dependencies:

```bash
npm install
```

## Running the Tests

You can run my solution using:

``` bash
npx playwright test
```

## Cool Features

1. Page Object Model

    I'm following how [the Playwright docs](https://playwright.dev/docs/pom) recommed implementing POM. That is, I have all my locators in a constructor in a Page file
   
    I then created separate functions to interact with each locator. This isn't strictly necessary, but I find this abstraction makes for much nicer-looking and more readable tests

3. HTML Report

    This is an artifact I'm publishing in the GitHub Actions workflow after the tests finish.

4. Manual & Automatic CI Trigger

    The tests will automatically run when you push new code to main or create a new PR to merge into main.
   
    You can also use the manual trigger to run the tests from GitHub Actions directly.

6. Fixtures

    Coming soon!

7. Accessibility (a11y) testing

    Coming soon!
