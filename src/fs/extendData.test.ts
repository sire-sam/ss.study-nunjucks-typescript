import {curryRight, mapValues} from 'lodash/fp';
import * as path from 'path';
import {map} from 'rxjs/operators';
import {extendData} from './extendData';
import {IFilesDataObject} from './IFilesDataObject';
import {readDataFromDir} from './readDataFromDir';

const mockDir = [__dirname, '../../mock/dataMocks'];

test('Extends data from json files', (done) => {
	const mockPath = path.resolve(...mockDir);
	readDataFromDir(mockPath)
		.pipe(
			map((fileData: IFilesDataObject) => mapValues(curryRight(extendData)(mockPath), fileData)),
		)
		.subscribe((extendedFile: IFilesDataObject) => {
			expect(extendedFile['1.json']).toEqual(
				expect.objectContaining({ data: 'default' }),
			);
			expect(extendedFile['1.json']).not.toEqual(
				expect.objectContaining({ extends: '../dataDefault.json' }),
			);
			expect(extendedFile['2.json']).not.toEqual(
				expect.objectContaining({ data: 'default' }),
			);
			expect(extendedFile['syntaxErrorExtend.json']).toEqual(
				expect.objectContaining({ id: 0 }),
			);
			done();
		});
});
