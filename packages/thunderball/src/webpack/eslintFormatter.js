import chalk from 'chalk';
import stripColor from 'strip-color';
import table from 'text-table';

function getMessageType(message) {
  if (message.fatal) {
    return chalk.red('fatal eslint error');
  }

  const severity = message.severity;

  if (severity === 2) {
    return chalk.red('eslint error');
  }

  return chalk.yellow('eslint warning');
}

module.exports = function (results) {
  let output = '\n';
  let total = 0;

  results.forEach((result) => {
    const messages = result.messages;

    if (messages.length === 0) {
      return;
    }

    total += messages.length;
    output += `${chalk.underline(result.filePath)}\n`;

    output += `${table(
      messages.map(message => [
        '',
        message.line || 0,
        message.column || 0,
        getMessageType(message),
        chalk.blue(message.message.replace(/\.$/, '')),
        chalk.gray(message.ruleId),
      ]),
      {
        align: ['', 'r', 'l'],
        stringLength(str) {
          return stripColor(str).length;
        },
      },
    ).split('\n').map(el => el.replace(/(\d+)\s+(\d+)/, (m, p1, p2) => chalk.gray(`${p1}:${p2}`))).join('\n')}\n\n`;
  });

  output += chalk.red.bold(`✖ ${total} problem${total === 1 ? '' : 's'}\n`);

  return output;
};
