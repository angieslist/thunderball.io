import Helmet from 'react-helmet-async';
import { Stream } from 'stream';
import getPageRenderer, { getHtmlProperties } from '../getPageRenderer';

const streamToPromise = stream => (new Promise((resolve, reject) => {
  let buffer = '';
  stream.on('data', (data) => { buffer += data; });
  stream.on('end', () => resolve(buffer));
  stream.on('error', () => reject());
}));

describe('getPageRenderer.js', () => {
  let webpackIsomorphicTools;
  beforeAll(() => {
    // Let Helmet know we want to test this as if on the server
    // (see https://github.com/nfl/react-helmet/blob/master/test/HelmetTest.js)
    Helmet.canUseDOM = false;
    // stub global webpackIsomorphicTools
    // TODO make functions in app code pure and eventually get rid of globals
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
  afterAll(() => {
    Helmet.canUseDOM = true;
    // replace stub with original global value
    global.webpackIsomorphicTools = webpackIsomorphicTools;
  });
  describe('getPageRenderer', () => {
    const store = {
      getState: () => {},
    };
    const renderProps = {};
    const req = {};
    const page = {};
    const name = 'testPage';
    const cacheKey = null;
    const reactRendererCacheKey = null;
    const ssrConfig = null;
    it('returns a renderer', async () => {
      const pageRenderer = getPageRenderer({
        store,
        renderProps,
        req,
        page,
        name,
        cacheKey,
        reactRendererCacheKey,
        ssrConfig,
        helmetContext: {
          helmet: {
            htmlAttributes: '',
            title: '',
            base: '',
            meta: '',
            link: '',
            style: '',
            script: '',
            noscript: '',
          },
        },
      });

      expect(pageRenderer.toPromise).toBeInstanceOf(Function);
      expect(pageRenderer.toStream).toBeInstanceOf(Function);
    });
    it('renders html to a promise', async () => {
      const pageRenderer = getPageRenderer({
        store,
        renderProps,
        req,
        page,
        name,
        cacheKey,
        reactRendererCacheKey,
        ssrConfig,
        flushCache: true,
        helmetContext: {
          helmet: {
            htmlAttributes: '',
            bodyAttributes: '',
            title: '',
            base: '',
            meta: '',
            link: '',
            style: '',
            script: '',
            noscript: '',
          },
        },
      });

      const html = await pageRenderer.toPromise();
      expect(html).toMatchSnapshot();
      const cachedHtml = await pageRenderer.toPromise();
      expect(cachedHtml).toMatchSnapshot();
    });
    it('renders html to a node stream', async () => {
      const pageRenderer = getPageRenderer({
        store,
        renderProps,
        req,
        page,
        name,
        cacheKey,
        reactRendererCacheKey,
        ssrConfig,
        flushCache: true,
        helmetContext: {
          helmet: {
            htmlAttributes: '',
            bodyAttributes: '',
            title: '',
            base: '',
            meta: '',
            link: '',
            style: '',
            script: '',
            noscript: '',
          },
        },
      });

      const stream = pageRenderer.toStream();
      expect(stream).toBeInstanceOf(Stream.Readable);
      const html = await streamToPromise(stream);
      expect(html).toMatchSnapshot();
      const cachedStream = pageRenderer.toStream();
      const cachedHtml = await streamToPromise(cachedStream);
      expect(cachedHtml).toMatchSnapshot();
    });
  });
  describe('getHtmlProperties', () => {
    it('gets HTML properties', () => {
      const htmlProperties = getHtmlProperties(
        {},
        'testPage',
        null,
        {
          helmet: {
            htmlAttributes: '',
            bodyAttributes: '',
            title: '',
            base: '',
            meta: '',
            link: '',
            style: '',
            script: '',
            noscript: '',
          },
        },
      );
      expect(htmlProperties).toMatchSnapshot();
    });
  });
});
