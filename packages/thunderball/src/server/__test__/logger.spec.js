import logger from '../logger';

const testMessage = 'test_log_message';
const testMessageLine = 'test_log_message\n';

function expectLogOutput(expectedLevel, checkStdout = true) {
  const write = checkStdout ? process.stdout.write : process.stderr.write;
  const nonWrite = checkStdout ? process.stderr.write : process.stdout.write;

  expect(write).toHaveBeenCalledTimes(1);
  expect(nonWrite).not.toHaveBeenCalled();

  const [timestamp, level, message] = write.mock.calls[0][0].split(' ');

  const timestampSeconds = new Date(timestamp).getTime() / 1000;
  const nowSeconds = new Date().getTime() / 1000;
  expect(timestampSeconds).toBeCloseTo(nowSeconds, 0);

  expect(level).toEqual(expectedLevel);

  expect(message).toEqual(testMessageLine);
}

describe('logger', () => {
  beforeEach(() => {
    jest.spyOn(process.stdout, 'write');
    jest.spyOn(process.stderr, 'write');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('log levels', () => {
    it('logs error level', () => {
      logger.error(testMessage);
      expectLogOutput('ERROR', false);
    });
    it('logs warn level', () => {
      logger.warn(testMessage);
      expectLogOutput('WARN', true);
    });
    it('logs info level', () => {
      logger.info(testMessage);
      expectLogOutput('INFO', true);
    });
    it('logs debug level', () => {
      logger.debug(testMessage);
      expectLogOutput('DEBUG', false);
    });
    it('logs trace level', () => {
      logger.trace(testMessage);
      expectLogOutput('TRACE', true);
    });
  });
});
