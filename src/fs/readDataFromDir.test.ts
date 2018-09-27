import * as path from 'path';
import {noop, Observable} from 'rxjs';
import {readDataFromDir} from './readDataFromDir';

const mockDir = [__dirname, '../../mock/dataMocks'];

test('Get an observable from readDataFromDir', () => {
	expect(readDataFromDir('')).toBeInstanceOf(Observable);
});

test('Get an Error for wrong dir path', (done) => {
	readDataFromDir('').subscribe(
		noop,
		(err) => {
			expect(err).toBeDefined();
			done();
		},
	);
});

test('Get a list of file from Subscription', (done) => {
	const mockPath = path.resolve(...mockDir);
	readDataFromDir(mockPath).subscribe(
		(obj) => {
			expect(obj['1.json']).toEqual(
				expect.objectContaining({ id: 1 }),
			);
			expect(obj['2.json']).toEqual(
				expect.objectContaining({ id: 2 }),
			);
			done();
		},
		noop,
	);
});

test('Ignore json file that can\'t be parse', (done) => {
	const mockPath = path.resolve(...mockDir);
	readDataFromDir(mockPath).subscribe(
		(obj) => {
			expect(obj['syntaxError.json']).toBeUndefined();
			done();
		},
	);
});
