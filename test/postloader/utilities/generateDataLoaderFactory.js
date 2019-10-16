// @flow

import test from 'ava';
import {
  trim,
} from 'lodash';
import generateDataLoaderFactory from '../../../src/utilities/generateDataLoaderFactory';

test('creates a loader for unique indexes', (t) => {
  const actual = trim(generateDataLoaderFactory(
    [
      {
        comment: '',
        dataType: 'text',
        isMaterializedView: false,
        isNullable: false,
        name: 'bar',
        tableName: 'foo',
      },
    ],
    [
      {
        columnNames: [
          'bar',
        ],
        indexIsUnique: true,
        indexName: 'quux',
        tableName: 'foo',
      },
    ],
    {}
  ));

  const expected = trim(`
import {
  getByIds,
  getByIdsUsingJoiningTable
} from 'postloader';
import * as DataLoader from 'dataloader';
import { DatabaseConnectionType } from 'slonik';

export type FooRecordType = Readonly<{
  bar: string
}>;

export type LoadersType = Readonly<{
  FooByBarLoader: DataLoader<string, FooRecordType>
}>;

export const createLoaders = (
  connection: DatabaseConnectionType,
  dataLoaderConfigurationMap: { [key: string]: DataLoader.Options<any, any> } = {}
): LoadersType => {
  const FooByBarLoader = new DataLoader((ids) => {
    return getByIds(connection, 'foo', ids, 'bar', '"bar"', false);
  }, dataLoaderConfigurationMap.FooByBarLoader);

  return {
    FooByBarLoader
  } as LoadersType;
};`);

  // eslint-disable-next-line ava/prefer-power-assert
  t.is(actual, expected);
});

test('creates a loader for unique indexes (uses mappedTableName when available)', (t) => {
  const actual = trim(generateDataLoaderFactory(
    [
      {
        comment: '',
        dataType: 'text',
        isMaterializedView: false,
        isNullable: false,
        mappedTableName: 'baz',
        name: 'bar',
        tableName: 'foo',
      },
    ],
    [
      {
        columnNames: [
          'bar',
        ],
        indexIsUnique: true,
        indexName: 'quux',
        tableName: 'foo',
      },
    ],
    {}
  ));

  const expected = trim(`
import {
  getByIds,
  getByIdsUsingJoiningTable
} from 'postloader';
import * as DataLoader from 'dataloader';
import { DatabaseConnectionType } from 'slonik';

export type BazRecordType = Readonly<{
  bar: string
}>;

export type LoadersType = Readonly<{
  BazByBarLoader: DataLoader<string, BazRecordType>
}>;

export const createLoaders = (
  connection: DatabaseConnectionType,
  dataLoaderConfigurationMap: { [key: string]: DataLoader.Options<any, any> } = {}
): LoadersType => {
  const BazByBarLoader = new DataLoader((ids) => {
    return getByIds(connection, 'foo', ids, 'bar', '"bar"', false);
  }, dataLoaderConfigurationMap.BazByBarLoader);

  return {
    BazByBarLoader
  } as LoadersType;
};`);

  // eslint-disable-next-line ava/prefer-power-assert
  t.is(actual, expected);
});

test('creates a loader for _id columns', (t) => {
  const actual = trim(generateDataLoaderFactory(
    [
      {
        comment: '',
        dataType: 'text',
        isMaterializedView: false,
        isNullable: false,
        mappedTableName: 'baz',
        name: 'bar_id',
        tableName: 'foo',
      },
    ],
    [],
    {}
  ));

  const expected = trim(`
import {
  getByIds,
  getByIdsUsingJoiningTable
} from 'postloader';
import * as DataLoader from 'dataloader';
import { DatabaseConnectionType } from 'slonik';

export type BazRecordType = Readonly<{
  barId: string
}>;

export type LoadersType = Readonly<{
  BazsByBarIdLoader: DataLoader<string, ReadonlyArray<BazRecordType>>
}>;

export const createLoaders = (
  connection: DatabaseConnectionType,
  dataLoaderConfigurationMap: { [key: string]: DataLoader.Options<any, any> } = {}
): LoadersType => {
  const BazsByBarIdLoader = new DataLoader((ids) => {
    return getByIds(connection, 'foo', ids, 'bar_id', '"bar_id" "barId"', true);
  }, dataLoaderConfigurationMap.BazsByBarIdLoader);

  return {
    BazsByBarIdLoader
  } as LoadersType;
};`);

  // eslint-disable-next-line ava/prefer-power-assert
  t.is(actual, expected);
});

test('creates a loader for a join table', (t) => {
  const actual = trim(generateDataLoaderFactory(
    [
      {
        comment: '',
        dataType: 'text',
        isMaterializedView: false,
        isNullable: false,
        mappedTableName: 'bar',
        name: 'id',
        tableName: 'bar',
      },
      {
        comment: '',
        dataType: 'text',
        isMaterializedView: false,
        isNullable: false,
        mappedTableName: 'foo',
        name: 'id',
        tableName: 'foo',
      },
      {
        comment: '',
        dataType: 'text',
        isMaterializedView: false,
        isNullable: false,
        mappedTableName: 'bar_foo',
        name: 'bar_id',
        tableName: 'bar_foo',
      },
      {
        comment: '',
        dataType: 'text',
        isMaterializedView: false,
        isNullable: false,
        mappedTableName: 'bar_foo',
        name: 'foo_id',
        tableName: 'bar_foo',
      },
    ],
    [],
    {}
  ));

  const expected = trim(`
import {
  getByIds,
  getByIdsUsingJoiningTable
} from 'postloader';
import * as DataLoader from 'dataloader';
import { DatabaseConnectionType } from 'slonik';

export type BarRecordType = Readonly<{
  id: string
}>;

export type FooRecordType = Readonly<{
  id: string
}>;

export type BarFooRecordType = Readonly<{
  barId: string,
  fooId: string
}>;

export type LoadersType = Readonly<{
  BarFoosByBarIdLoader: DataLoader<string, ReadonlyArray<BarFooRecordType>>,
  BarFoosByFooIdLoader: DataLoader<string, ReadonlyArray<BarFooRecordType>>,
  BarsByFooIdLoader: DataLoader<string, ReadonlyArray<BarRecordType>>,
  FoosByBarIdLoader: DataLoader<string, ReadonlyArray<FooRecordType>>
}>;

export const createLoaders = (
  connection: DatabaseConnectionType,
  dataLoaderConfigurationMap: { [key: string]: DataLoader.Options<any, any> } = {}
): LoadersType => {
  const BarFoosByBarIdLoader = new DataLoader((ids) => {
    return getByIds(connection, 'bar_foo', ids, 'bar_id', '"bar_id" "barId", "foo_id" "fooId"', true);
  }, dataLoaderConfigurationMap.BarFoosByBarIdLoader);
  const BarFoosByFooIdLoader = new DataLoader((ids) => {
    return getByIds(connection, 'bar_foo', ids, 'foo_id', '"bar_id" "barId", "foo_id" "fooId"', true);
  }, dataLoaderConfigurationMap.BarFoosByFooIdLoader);
  const FoosByBarIdLoader = new DataLoader((ids) => {
    return getByIdsUsingJoiningTable(connection, 'bar_foo', 'foo', 'foo', 'bar', 'r2."id"', ids);
  }, dataLoaderConfigurationMap.FoosByBarIdLoader);
  const BarsByFooIdLoader = new DataLoader((ids) => {
    return getByIdsUsingJoiningTable(connection, 'bar_foo', 'bar', 'bar', 'foo', 'r2."id"', ids);
  }, dataLoaderConfigurationMap.BarsByFooIdLoader);

  return {
    BarFoosByBarIdLoader,
    BarFoosByFooIdLoader,
    BarsByFooIdLoader,
    FoosByBarIdLoader
  } as LoadersType;
};`);

  // eslint-disable-next-line ava/prefer-power-assert
  t.is(actual, expected);
});
