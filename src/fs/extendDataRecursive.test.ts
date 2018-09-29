import {curryRight, mapValues} from 'lodash/fp';
import * as path from 'path';
import {map} from 'rxjs/operators';
import {extendDataRecursive} from './extendDataRecursive';
import {IFilesDataObject} from './IFilesDataObject';
import {readDataFromDir} from './readDataFromDir';

const mockDir = [__dirname, '../../mock/dataMocks'];
const mockPath = path.resolve(...mockDir);

test('Extend data recursively from json files', (done) => {
	readDataFromDir(mockPath)
		.pipe(map(
			(fileData: IFilesDataObject) => mapValues(curryRight(extendDataRecursive)(mockPath), fileData)),
		)
		.subscribe((extendedFile: IFilesDataObject) => {
			expect(extendedFile['3.json']).toEqual(
				expect.objectContaining({ price: 0, data: 'default' }),
			);
			done();
		});
});
