import Debug from 'debug';
import * as fs from 'fs';
import {unset} from 'lodash/fp';
import * as path from 'path';
import {IExtendData} from './IExtendData';

/**
 * Local instance of debug module
 */
const debug = Debug('extendDataFromFile');

export function extendData(data: IExtendData, dirPath: string): {} {
	debug('Start extend file from dir', dirPath, data);
	const dataCopy = { ...data };
	let dataExtend = {};
	let extendFilePath;

	if (dataCopy.extends) {
		extendFilePath = path.join(dirPath, dataCopy.extends);
		debug('Get data from extend file', extendFilePath);
		try {
			dataExtend = JSON.parse(fs.readFileSync(extendFilePath, { encoding: 'utf-8' }));
		} catch (e) {
			debug('ERROR: Cannot get content from file', extendFilePath, `\n${e}`);
		}
	}
	return {...unset('extends', dataCopy), ...dataExtend};
}
