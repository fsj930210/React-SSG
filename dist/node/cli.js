"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const cac_1 = require("cac");
const dev_1 = require("./dev");
const version = require('../../package.json').version;
// 使用cac来做脚手架命令行开发工具
const cli = (0, cac_1.cac)('react-ssg').version(version).help();
cli
    .command('[root]', 'start dev server')
    .alias('dev')
    .action(async (root) => {
    console.log('dev', root);
    root = root ? node_path_1.default.resolve(root) : process.cwd();
    const server = await (0, dev_1.createDevServer)(root);
    await server.listen();
    server.printUrls();
});
cli.command('build [root]', 'build for production').action(async (root) => {
    console.log('build', root);
});
cli.parse();
