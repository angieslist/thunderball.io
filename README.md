<!-- BEGIN MIGRATION NOTICE -->
# Migration Notice
This repository has been migrated to https://gitlab.com/angi1/angieslist/thunderball.io
The repositories Circle CI configuration was not ported to Gitlab CI because this repository has not had any recent commits in the past year.
<!-- END MIGRATION NOTICE -->







# Thunderball
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

![](thunderball-small.png)

## What is Thunderball?

Thunderball is a slightly opinionated server and client library for building rich applications in NodeJs, ReactJs, and Redux.  Thunderball attempts to use industry standard libraries instead of reinventing things.  However, stitching together these libraries on your own can be tedious and lead to confusion since there are many ways to do things.

Thunderball is initially targeting web applications.  However, the build tools and many of the client library features can could extended to `react-native`, `electron`, and other platforms.  We will be looking to expand to other platforms in the future.

## Getting Started

The easiest way to get started is with our yeoman generator. Open your terminal and type:

```
# install yeoman
npm install -g yo

# install the thunderball generator
npm install -g generator-thunderball

# make a new thunderball project
mkdir MYAPP && cd MYAPP
yo thunderball

# compile and run the new app
npm start

# go to http://localhost:8000
```

## Why Thunderball?
It can be difficult to create an application from scratch and even more difficult to decide what libraries to use and how they will interact with each other.

Unlike other "bootstrapping" frameworks out there for ReactJs applications, Thunderball is a platform that is meant to live under your application and *get out of your way*.  There are numerous extension points to bend Thunderball to your will and in the end, you have control over how your application will work.

## Additional Documentation
Learn more about using Thunderball at http://thunderball.io
