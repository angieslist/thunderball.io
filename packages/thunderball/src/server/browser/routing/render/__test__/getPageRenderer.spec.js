import Helmet from 'react-helmet-async';
import { Stream } from 'stream';
import NodeCache from 'node-cache';
import { promisify } from 'util';
import getPageRenderer, { getHtmlProperties } from '../getPageRenderer';

const streamToPromise = stream => (new Promise((resolve, reject) => {
  let buffer = '';
  stream.on('data', (data) => { buffer += data; });
  stream.on('end', () => resolve(buffer));
  stream.on('error', () => reject());
}));

const createCacheStream = (cacheKey, setHtmlCache) => {
  const bufferedChunks = [];
  return new Stream.Transform({
    transform(data, enc, cb) {
      bufferedChunks.push(data);
      cb(null, data);
    },
    flush(cb) {
      setHtmlCache(cacheKey, Buffer.concat(bufferedChunks));
      cb();
    },
  });
};

const htmlCache = new NodeCache({ stdTTL: 3600000 / 1000, errorOnMissing: true });
const promisifiedHtmlCacheSet = promisify(htmlCache.set);

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

      expect(pageRenderer.getHtml).toBeInstanceOf(Function);
      expect(pageRenderer.getHtmlStream).toBeInstanceOf(Function);
    });
    it('renders html', async () => {
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

      const html = pageRenderer.getHtml();
      expect(html).toMatchSnapshot();
      const cachedHtml = pageRenderer.getHtml();
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

      const stream = pageRenderer.getHtmlStream(createCacheStream('key', promisifiedHtmlCacheSet));
      expect(stream).toBeInstanceOf(Stream.Readable);
      const html = await streamToPromise(stream);
      expect(html).toMatchSnapshot();
      const cachedStream = pageRenderer.getHtmlStream(createCacheStream('key', promisifiedHtmlCacheSet));
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
