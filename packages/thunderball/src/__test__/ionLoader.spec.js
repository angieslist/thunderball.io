import path from 'path';
import ionLoader from '../ionLoader';

describe('ionLoader.load', () => {
  it('loads all ions in an ions directory', () => {
    const ionsDir = path.resolve(__dirname, '../../../thunderball-hello-world/src/ions');
    const ions = ionLoader.load(ionsDir);
    expect(ions).toMatchSnapshot();
  });
});
