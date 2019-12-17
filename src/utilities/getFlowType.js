// @flow

import Logger from '../Logger';
import isNumberType from './isNumberType';
import isStringType from './isStringType';

const log = Logger.child({
  namespace: 'getFlowType',
});

export default (databaseTypeName: string): string => {
  if (databaseTypeName === 'json') {
    return 'any';
  }

  if (databaseTypeName === 'boolean') {
    return 'boolean';
  }

  if (databaseTypeName === 'timestamp without time zone') {
    return 'number';
  }

  if (isStringType(databaseTypeName)) {
    return 'string';
  }

  if (isNumberType(databaseTypeName)) {
    return 'number';
  }

  if (databaseTypeName === 'json' || databaseTypeName === 'jsonb') {
    return 'any';
  }

  log.warn({
    databaseTypeName,
  }, 'unknown type');

  return 'any';
};
