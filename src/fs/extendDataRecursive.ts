import Debug from 'debug';
import * as path from 'path';
import {extendData} from './extendData';
import {IExtendData} from './IExtendData';

/**
 * Local instance of debug module
 */
const debug = Debug('extendDataRecursive');

export function extendDataRecursive(data: IExtendData, dirPath: string) {
	debug('Start extend file recursively from dir', dirPath, data);
	const dataCopy = {...data};
	let  extendDirPath;
	let dataExtended: IExtendData = {};

	if (dataCopy.extends) {
		extendDirPath = path.dirname(path.join(dirPath, dataCopy.extends));
		dataExtended = extendData(dataCopy, dirPath);
		if (dataExtended.extends) {
			dataExtended = extendDataRecursive(dataExtended, extendDirPath);
		}
	}
	return dataExtended;
}
