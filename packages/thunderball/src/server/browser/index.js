import logger from '../logger';
import setupStaticAssetRoutes from './routing/setupStaticAssetRoutes';
import setupStaticFolderRoutes from './routing/setupStaticFolderRoutes';
import setupIonSpaRoutes from './routing/setupIonSpaRoutes';
import app from '../app';

// Setup static route (javascript, css, etc)
setupStaticAssetRoutes(app);

// Build Static folders from ions
setupStaticFolderRoutes(app);

// Build SPA routes from ions
setupIonSpaRoutes(app);

app.on('mount', () => {
  logger.info(`App is available at ${app.mountpath}`);
});

export default app;
