import Debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import {Observable} from 'rxjs';
import {IFilesDataObject} from './IFilesDataObject';

/**
 * Local instance of debug module
 */
const debug = Debug('ReadDataFromDir');

/**
 * Whenever file ends with ".json" string
 */
function isJsonFile(fileName: string) {
	return fileName.endsWith('.json');
}

/**
 * Get content of dirPath/filename and assign it to object[filename]
 */
function addFileContentToObject(
	object: IFilesDataObject,
	fileName: string,
	dirPath: string,
): IFilesDataObject {
	const objectCopy = { ...object };
	const filePath = path.join(dirPath, fileName);
	const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

	try {
		debug('Get content from file:', filePath);
		return Object.assign(objectCopy, { [fileName]: JSON.parse(fileContent) });
	} catch (e) {
		debug('ERROR: parsing file:', filePath, `\n${e}`);
		return object;
	}

}

/**
 * Get a map of fileName, fileContent from a given dir.
 * It only handle 'JSON' file and ignore files who can't be parse as JSON
 */
function getFileDataObject(dirPath: string, files: string[]): IFilesDataObject {
	debug('Will get date from dir:', dirPath);
	return files
		.filter(isJsonFile)
		.reduce((acc, fileName) => addFileContentToObject(acc, fileName, dirPath), {});
}

/**
 * Get a map of all json file in given dir
 */
export function readDataFromDir(dirPath: string): Observable<IFilesDataObject> {
	debug('Start reading dir:', dirPath);
	return new Observable((observer) => {
		fs.readdir(dirPath, (err: NodeJS.ErrnoException, files: string[]) => {
			if (err) {
				debug('ERROR: Can\'t read dir:', dirPath, `\n${err}`);
				observer.error(err);
			} else {
				debug('Has read dir:', dirPath);
				observer.next(getFileDataObject(dirPath, files));
			}
			observer.complete();
		});
	});
}
