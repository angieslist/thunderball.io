const _ = require('lodash');
const chalk = require('chalk');
const Generator = require('yeoman-generator');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Greet the user
    const adjectives = ['spectacular', 'amazing', 'stupendeous', 'super', 'remarkable', 'thrilling', 'wonderous', 'dazzling', 'sensational', 'historic', 'grand', 'striking', 'marvelous', 'rotund'];
    this.log(yosay(
      `Welcome to the ${chalk.blue(adjectives[Math.floor(Math.random() * adjectives.length)])} ${chalk.red('thunderball')} generator!`
    ));

    const prompts = [{
      type: 'input',
      name: 'displayName',
      default: _.capitalize(this.appname),
      message: 'What\'s the display name of your project?',
      store: true,
      validate(input) {
        return !!input;
      }
    }, {
      type: 'input',
      name: 'name',
      default: _.kebabCase(this.appname),
      message: 'What\'s the name of the repository for your project?',
      store: true,
      validate(input) {
        return !!input;
      }
    }, {
      type: 'input',
      name: 'description',
      message: 'What\'s a short description of this project?',
      store: true,
      validate(input) {
        return !!input;
      }
    }, {
      type: 'confirm',
      name: 'installDependencies',
      message: 'Run "npm install" to install all dependencies?',
      default: true,
      store: true
    }];

    return this.prompt(prompts).then((props) => {
      // To access props later use this.props.displayName;
      this.props = props;
    });
  }

  writing() {
    // copy all files in one go
    this.fs.copy(
      this.templatePath(''),
      this.destinationPath(''),
      this.props,
      null,
      {
        globOptions: {
          dot: true
        }
      }
    );
    // now go back and template all files except ones that would break templating
    const copyOnly = [`!${this.templatePath('**/*.png')}`];

    this.fs.copyTpl(
      [this.templatePath(''), ...copyOnly],
      this.destinationPath(''),
      this.props,
      null,
      {
        globOptions: {
          dot: true
        }
      }
    );
  }

  install() {
    if (this.props.installDependencies) {
      this.installDependencies({
        npm: true,
        bower: false
      });
    }
  }
};
