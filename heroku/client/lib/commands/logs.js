"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("@heroku-cli/color");
const command_1 = require("@heroku-cli/command");
const completions_1 = require("@heroku-cli/command/lib/completions");
const log_displayer_1 = require("../lib/run/log-displayer");
const tsheredoc_1 = require("tsheredoc");
class Logs extends command_1.Command {
    async run() {
        const { flags } = await this.parse(Logs);
        const { app, 'dyno-name': dyno, 'force-colors': forceColors, num, ps, source, tail, 'process-type': type } = flags;
        if (forceColors)
            color_1.default.enabled = true;
        await (0, log_displayer_1.default)(this.heroku, {
            app,
            dyno,
            lines: num || 100,
            source,
            tail,
            type: type || ps,
        });
    }
}
exports.default = Logs;
Logs.description = (0, tsheredoc_1.default) `
    display recent log output
    disable colors with --no-color, HEROKU_LOGS_COLOR=0, or HEROKU_COLOR=0
  `;
Logs.examples = [
    'heroku logs --app=my-app',
    'heroku logs --num=50 --app=my-app',
    'heroku logs --dyno-name=web-123-456 --app=my-app',
    'heroku logs --process-type=web --app=my-app',
    'heroku logs --app=my-app --tail',
];
Logs.flags = {
    app: command_1.flags.app({ required: true }),
    'dyno-name': command_1.flags.string({
        aliases: ['dyno'],
        char: 'd',
        description: 'only show output from this dyno (such as "web-123-456" or "worker.2")',
    }),
    'force-colors': command_1.flags.boolean({
        description: 'force use of colors (even on non-tty output)',
    }),
    // supports-color NPM package will parse ARGV looking for flag `--no-color`, but
    // we need to define it here for OClif not to error out on an inexistent flag.
    'no-color': command_1.flags.boolean({
        default: false,
        hidden: true,
        relationships: [
            { type: 'none', flags: ['force-colors'] },
        ],
    }),
    num: command_1.flags.integer({
        char: 'n',
        description: 'number of lines to display (ignored for Fir generation apps)',
    }),
    ps: command_1.flags.string({
        char: 'p',
        hidden: true,
        description: 'hidden alias for type',
        relationships: [
            { type: 'none', flags: ['dyno-name'] },
        ],
        completion: completions_1.ProcessTypeCompletion,
    }),
    remote: command_1.flags.remote(),
    source: command_1.flags.string({
        char: 's',
        description: 'only show output from this source (such as "app" or "heroku")',
    }),
    tail: command_1.flags.boolean({
        char: 't',
        default: false,
        description: 'continually stream logs (defaults to true for Fir generation apps)',
    }),
    'process-type': command_1.flags.string({
        char: 'p',
        description: 'only show output from this process type (such as "web" or "worker")',
        relationships: [
            { type: 'none', flags: ['dyno-name', 'ps'] },
        ],
        completion: completions_1.ProcessTypeCompletion,
    }),
};
