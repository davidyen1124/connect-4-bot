# connect-4-bot
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/davidyen1124/connect-4-bot.svg?branch=master)](https://travis-ci.org/davidyen1124/connect-4-bot)

Play connect four with your friends on Slack now.

![Kids playing connect 4](https://media.giphy.com/media/z4kHGa918NF5e/giphy.gif)

![Slack screenshot](https://cloud.githubusercontent.com/assets/3429809/20785580/cebbc150-b755-11e6-9f8b-dba7d13db3ef.png)

##Install:

1.
```
npm install
```

2.
Edit `.env` on root directory.

```
SLACK_TOKEN="<slack token>"
```

##Run:

Use powerful `async/await` in Node v7.

```
node --harmony-async-await index.js
```