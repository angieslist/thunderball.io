import getPageRenderer, { getHtmlProperties } from '../getPageRenderer';
import { Helmet } from 'react-helmet';

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
    it('returns rapscallion Renderer', async () => {
      const store = {
        getState: () => {},
      };
      const renderProps = {};
      const req = {};
      const page = {};
      const name = 'testPage';
      const cacheKey = null;
      const ssrConfig = null;
      const pageRenderer = getPageRenderer(store, renderProps, req, page, name, cacheKey, ssrConfig);
      expect(pageRenderer.toPromise).toBeInstanceOf(Function);
      const html = await pageRenderer.toPromise();
      expect(html).toMatchSnapshot();
    });
  });
  describe('getHtmlProperties', () => {
    it('gets HTML properties', () => {
      const htmlProperties = getHtmlProperties({}, 'testPage');
      expect(htmlProperties).toMatchSnapshot();
    });
  });
});
