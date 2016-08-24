#!/usr/bin/env node

'use strict';

const Getopt = require('node-getopt');
const Joi = require('joi');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const Colors = require('colors');

// Messages
const argsHelp = {
    dir: 'The directory to start searching in',
    format: 'The output format: key-value, csv, json',
    output: 'The file to write the output to'
};

const errorMessages = {
    dir: 'You need to provided the directory to search for `.jsx` files',
    format: 'You need to provide a valid format: `key-value`, `csv`, or `json`',
    output: 'You need to provide a valid file location to output the contents to'
};

// Command line arguments
const getOptionsFromArgs = new Getopt([
    ['d', 'dir=DIR', argsHelp.dir],
    ['f', 'format=FORMAT', argsHelp.format],
    ['o', 'output=FILE', argsHelp.output],
    ['h' , 'help']
]).bindHelp();

const args = getOptionsFromArgs.parse(process.argv.slice(2));

const optionsSchema = {
    dir: Joi.string().required().description('You must provide a root directory for JSX components'),
    format: Joi.string().valid('key-value', 'csv', 'json').default('json'),
    output: Joi.string().optional()
};

Joi.validate(args.options, optionsSchema, {abortEarly: false}, function (err, validOptions) {
    if (err) {
        console.log(Colors.red('There were errors in the arguments provided. For more details about the arguments, run the command with ') + Colors.magenta('--help') + Colors.red(' flag\n'));
        console.log(Colors.bold(Colors.red('Errors:')));

        let num = 1;
        err.details.forEach(function(fieldError) {
            const errorMessage = errorMessages[fieldError.path].replace(/`([^`]+)`/g, function(full, code) {
                return Colors.magenta(code);
            });

            const bullet = Colors.bold(`[${num}]`);
            console.log(Colors.red(` ${bullet} ${errorMessage}`));
            ++num;
        });

        return;
    }

    const rootDir = path.resolve(validOptions.dir);

    const messages = {};

    glob('**/*.jsx', {cwd: rootDir}, function (err, files) {
        const promises = files.map(function (filename) {
                return new Promise(function(resolve, reject) {
                    fs.readFile(path.join(rootDir, filename), 'utf8', function (err, data) {
                            if (err) {
                                reject(err);
                            }

                            // Remove comments that don't share a line with other statements.
                            // Will be removed:     `    // <LocalizeText...
                            // Will not be removed: `var lt = 'np'; // <LocalizeText...
                            const cleanData = data
                                .replace(/^\s*\/\//mg, '')
                                .replace(/^\s*\/\*[\s\S]*?\*\//mg, '');

                            const matches = cleanData.match(/<LocalizeText[\s\S]*?\/>/g);

                            if (matches) {
                                const results = matches.map(function (componentStr) {
                                    const idMatches = componentStr.match(/\sid=('(.*?[^\\])'|"(.*?[^\\])")/);
                                    const descriptionMatches = componentStr.match(/\sdescriptio=('(.*?[^\\])'|"(.*?[^\\])")/);
                                    const defaultMessageMatches = componentStr.match(/\sdefaultMessage=('(.*?[^\\])'|"(.*?[^\\])")/);

                                    return {
                                        file: filename,
                                        id: idMatches && (idMatches[2] || idMatches[3]),
                                        description: descriptionMatches && (descriptionMatches[2] || descriptionMatches[3]),
                                        defaultMessage: defaultMessageMatches && (defaultMessageMatches[2] || defaultMessageMatches[3])
                                    };
                                });
                                resolve(results);
                            }

                            resolve([]);
                        });
                });
            });

        Promise.all(promises).then(function(results) {
            results = [].concat.apply([], results);

            if (validOptions.format === 'key-value') {
                const messages = {};

                results.forEach(function (result) {
                   messages[result.id] =  result.defaultMessage;
                });

                return JSON.stringify(messages, null, 2);
            }

            if (validOptions.format === 'csv') {
                const lines = results.map(function (result) {
                    const file = escapeCsvQuotes(result.file);
                    const id = escapeCsvQuotes(result.id);
                    const description = escapeCsvQuotes(result.description);
                    const defaultMessage = escapeCsvQuotes(result.defaultMessage);

                    return [id, defaultMessage, description, file].join(',');
                });

                return lines.join('\n');
            }

            return JSON.stringify(results, null, 2);
        }).then(function (outputContents) {
            if (validOptions.output) {
                fs.writeFile(validOptions.output, outputContents, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log(Colors.green('Messages written to ') + Colors.magenta(path.resolve(validOptions.output)));
                });
            } else {
                console.log(outputContents);
            }
        });
    });
});

function escapeCsvQuotes(str) {
    return '"' + (str || '').replace(/"/g, '""') + '"';
}