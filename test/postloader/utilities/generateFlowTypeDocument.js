// @flow

import test from 'ava';
import {
  trim,
} from 'lodash';
import generateFlowTypeDocument from '../../../src/utilities/generateFlowTypeDocument';
import {
  createColumn,
} from '../../helpers';

test('create flow type document with one type', (t) => {
  const actual = trim(generateFlowTypeDocument([
    createColumn({
      mappedTableName: 'bar',
      name: 'foo',
    }),
  ]));

  const expected = trim(`
export type BarRecordType = Readonly<{
  foo: any
}>;
`);

  t.true(actual === expected);
});

test('create flow type document with multiple types', (t) => {
  const actual = trim(generateFlowTypeDocument([
    createColumn({
      mappedTableName: 'qux',
      name: 'baz',
    }),
    createColumn({
      mappedTableName: 'bar',
      name: 'foo',
    }),
  ]));

  const expected = trim(`
export type QuxRecordType = Readonly<{
  baz: any
}>;

export type BarRecordType = Readonly<{
  foo: any
}>;`);

  t.true(actual === expected);
});
