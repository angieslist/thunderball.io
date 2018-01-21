import React from 'react';
import request from 'supertest';
import express from 'express';
import SPARender from '../index';
import { Helmet } from 'react-helmet';
import { Route, IndexRoute } from 'react-router';

const createRoutes = () => (
  <Route component={null} path="/" />
);

describe('Test HTTP Server DOCTYPE', () => {
  let app;
  let webpackIsomorphicTools;
  beforeEach(() => {
    // call this beforeEach test otherwise there can be caching issues between tests
    app = express();
    Helmet.canUseDOM = false;
    webpackIsomorphicTools = global.webpackIsomorphicTools;
    global.webpackIsomorphicTools = {
      assets: () => ({
        styles: {
          commons: 'commonStyle',
          testPage: 'testStyle',
        },
        javascript: {
          commons: 'commonJs',
          testPage: 'testJs',
        },
      }),
      refresh: () => {},
    };
  });
  afterEach(() => {
    Helmet.canUseDOM = true;
    global.webpackIsomorphicTools = webpackIsomorphicTools;
  });
  it('It should contain the correct DOCTYPE', async () => {
    const handler = SPARender({}, 'test', createRoutes, []);
    app.get('/', handler);
    const response = await request(app).get('/');
    expect(response.status).toEqual(200);
    expect(response.text.slice(0, 15)).toMatchSnapshot();
  });
  it('It should contain the correct DOCTYPE when streaming', async () => {
    const handler = SPARender({ ssr: { useStreaming: true } }, 'test', createRoutes, []);
    app.get('/', handler);
    const response = await request(app).get('/');
    expect(response.status).toEqual(200);
    expect(response.text.slice(0, 15)).toMatchSnapshot();
  });
});
