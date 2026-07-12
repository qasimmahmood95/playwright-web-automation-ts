const config = {
  url: 'https://www.saucedemo.com/',
  username: process.env.SAUCEDEMO_USERNAME || 'standard_user',
  password: process.env.SAUCEDEMO_PASSWORD || 'secret_sauce',
  locked_username: process.env.SAUCEDEMO_LOCKED_USERNAME || 'locked_out_user',
  problem_username: process.env.SAUCEDEMO_PROBLEM_USERNAME || 'problem_user',
};

export default config;
