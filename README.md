# git-browse-github-search

[![npm version](https://badge.fury.io/js/git-browse-github-search.svg)](https://badge.fury.io/js/git-browse-github-search)
[![Build Status](https://travis-ci.org/KamataRyo/git-browse-github-search.svg?branch=master)](https://travis-ci.org/KamataRyo/git-browse-github-search)
[![codecov](https://codecov.io/gh/KamataRyo/git-browse-github-search/branch/master/graph/badge.svg)](https://codecov.io/gh/KamataRyo/git-browse-github-search)

This is sub-module for [git-browse](https://npmjs.com/git-browse).


## Install

```
$ npm install -g git-browse-github-search
$ npm install git-browse-github-search
```

## Usage

### as CLI tool

```
$ git-browse-github-search foo example-
example-a example-b example-c
```

In this case, the user 'foo' has 3 repositories on Github, example-a, example-b, example-c

### as required module

```
var search = require('git-browse-github-search').search
search({
  user: 'username',
  repo: 'repo search words, foward-matching',
  success: (reponames) => {
    // reponames is array of user's repositoy name
  }
  })
```
