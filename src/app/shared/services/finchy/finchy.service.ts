import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FinchyConfig } from './finchy.config';
//import { FinchyGlobalConfig } from './finchy.global.config';

export class FinchyServiceConfig {
  userName = "Philip Marlowe";
  userName22 = "Philip Marlowe22";
  finchyConfig:FinchyConfig = {
    authority: "111",
    clientId: "222",
    redirectUri: "333"
  }
}

@Injectable({
  providedIn: 'root'
})
export class FinchyService {
  _finchyConfig: FinchyConfig;
  private finchyRootUrl;
  constructor(private _httpClient: HttpClient,
  @Optional() config?: FinchyServiceConfig,
    //private _finchyGlobalConfig: FinchyGlobalConfig,
   // @Inject(FinchyConfig) private config: FinchyConfig
   )
    {
      if (config) {
        // this._userName = config.userName;
        // this._userName22 = config.userName22;
        this._finchyConfig = config.finchyConfig;
        this.finchyRootUrl = config.finchyConfig.finchyRootUrl;
        console.log('this._finchyConfig= ', this._finchyConfig);
      }
    //this._finchyGlobalConfig.setUserValues(this.config);
    //this.finchyRootUrl = this.config.finchyRootUrl;
  }

  login(redirectUriOverride?: string): Promise<Boolean> {
    console.log(`: login ${redirectUriOverride}`);
    return new Promise((resolve, reject) => resolve(false || !redirectUriOverride));
  }

  private _executeQuery(apiUrl: string, params: object, errorMsg: string, callbackState): Observable<{queryResult: Finchy.QueryResult, callbackState}> {
    let form_data = null;
    if (!isNonNullObject(params)) {
        params = {
            resultformat: 'JSON'
        };
    }
    if (isNonNullObject(params)) {
        params['resultformat'] = 'JSON';
        form_data = this.getFormUrlEncodedData(params);
    }

    return <Observable <{queryResult: Finchy.QueryResult, callbackState}>> this._httpClient.post(apiUrl,
        form_data,
        {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        }).pipe(
            map( data => {
                const queryResult = new Finchy.QueryResult(data);
                return {queryResult: queryResult, callbackState: callbackState};
            }),
            catchError( error => {
                const finchyEx = new Finchy.FinchyException(errorMsg, {
                    status: error.status,
                    statusText: error.statusText,
                    response: error.responseJSON
                });
                return throwError({finchyException: finchyEx, callbackState: callbackState});
            })
        );
}

executeQuery(domain: string, query: string, params: object, callbackState?): Observable<{queryResult: Finchy.QueryResult, callbackState}> {
  if (!isNonNullOrWhitespaceString(domain))
      throw new Finchy.FinchyException('Domain must be a valid string', domain);
  if (!isNonNullOrWhitespaceString(query))
      throw new Finchy.FinchyException('Query must be a valid string', query);
  let apiUrl = this.finchyRootUrl + '/API/' + domain + '/' + query;
  let errorMsg = 'Failed to execute query ' + query + ' within domain ' + domain;

  return <Observable <{queryResult: Finchy.QueryResult, callbackState}>> this._executeQuery(apiUrl, params, errorMsg, callbackState).pipe(
      map( response => response),
      catchError(error => { return throwError(error); })
  );
}


    // Timestamp: 2016.03.07-12:29:28 (last modified)
    // Author(s): Bumblehead (www.bumblehead.com), JBlashill (james@blashill.com), Jumper423 (jump.e.r@yandex.ru)
    //
    // http://www.w3.org/TR/html5/forms.html#url-encoded-form-data
    // input: {one:1,two:2} return: '[one]=1&[two]=2'
    getFormUrlEncodedData(data, opts?) {
      'use strict';

      // ES5 compatible version of `/[^ !'()~\*]/gu`, https://mothereff.in/regexpu
      let encodechar = new RegExp([
          '(?:[\0-\x1F"-&\+-\}\x7F-\uD7FF\uE000-\uFFFF]|',
          '[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|',
          '(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])'
      ].join(''), 'g');

      opts = typeof opts === 'object' ? opts : {};

      function encode(value) {
          return String(value)
              .replace(encodechar, encodeURIComponent)
              .replace(/ /g, '+')
              .replace(/[!'()~\*]/g, function (ch) {
                  return '%' + ch.charCodeAt(0).toString(16).slice(-2).toUpperCase();
              });
      }

      function keys(obj) {
          let itemsKeys = Object.keys(obj);

          return opts.sorted ? itemsKeys.sort() : itemsKeys;
      }

      function filterjoin(arr) {
          return arr.filter(function (e) {
              return e;
          }).join('&');
      }

      function objnest(name, obj) {
          return filterjoin(keys(obj).map(function (key) {
              return nest(name + '[' + key + ']', obj[key]);
          }));
      }

      function arrnest(name, arr) {
          return arr.length ? filterjoin(arr.map(function (elem, index) {
              return nest(name + '[' + index + ']', elem);
          })) : encode(name + '[]');
      }

      function nest(name, value) {
          let type = typeof value,
              f = null;

          if (value === f) {
              f = opts.ignorenull ? f : encode(name) + '=' + f;
          } else if (/string|number|boolean/.test(type)) {
              f = encode(name) + '=' + encode(value);
          } else if (Array.isArray(value)) {
              f = arrnest(name, value);
          } else if (type === 'object') {
              f = objnest(name, value);
          }

          return f;
      }

      return data && filterjoin(keys(data).map(function (key) {
          return nest(key, data[key]);
      }));
  }

}

export namespace Finchy {
  export class FinchyException {
      message: string;
      data: any;
      name: string;

      constructor(message: string, data?: any) {
          this.message = message;
          this.data = data;
          this.name = 'FinchyException';
      }

      logError(): void {
          console.error(this.message, this.data);
      }
  }

  export class QueryResult {

      _columnsByName;
      _columnsByIdx;
      _currentRowIdx = -1;

      _jsonResult: any;

      constructor(_jsonResult: any) {
          this._jsonResult = _jsonResult;
          this.processColumnHeaders();
      }


      convertToObject(key: string): Object {
          let colCount = this.getColCount();
          if (colCount < 2)
              throw new FinchyException('Result sets can only be convered to objects when they have at least two columns. The column count is ' + colCount, { jsonResult: this._jsonResult });
          this.resetIterator();
          let result = {};
          let keyColIdx = this.validateAndConvertColumnReferenceToIdx(key);
          while (this.moveToNextRow()) {
              let keyValue = this.getCellValue(keyColIdx);
              if (isUndefined(keyValue))
                  throw new FinchyException('Key value when attempting to convert result set to object can not be undefined', { val: keyValue, rowIdx: this._currentRowIdx, jsonResult: this._jsonResult });
              if (!isUndefined(result[keyValue]))
                  throw new FinchyException('Duplicate key found when attempting to convert result set to object', { val: keyValue, rowIdx: this._currentRowIdx, jsonResult: this._jsonResult });
              if (colCount === 2) {
                  for (let i = 0; i < colCount; i++) {
                      if (i === keyColIdx)
                          continue;
                      result[keyValue] = this.getCellValue(i);
                  }
              } else {
                  result[keyValue] = {};
                  for (let j = 0; j < colCount; j++) {
                      if (j === keyColIdx)
                          continue;
                      let columnName = this._columnsByIdx[j].columnName;
                      result[keyValue][columnName] = this.getCellValue(j);
                  }
              }
          }
          return result;
      }

      csvToArray(text) {
          if (text === null)
              return null;
          if (!isString(text))
              throw new FinchyException('Input text for csv to array conversion is not a string', text);
          if (text.killWhiteSpace() === '')
              return [];
          let re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
          let re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
          // Throw an exception if input string is not well formed CSV string.
          if (!re_valid.test(text))
              throw new FinchyException('Input text is not a valid csv string', text);
          let a = []; // Initialize array to receive values.
          text.replace(re_value, // "Walk" the string using replace with callback.
              function (m0, m1, m2, m3) {
                  // Remove backslash from \' in single quoted values.
                  if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                      // Remove backslash from \" in double quoted values.
                  else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                  else if (m3 !== undefined) a.push(m3);
                  return ''; // Return empty string.
              });
          // Handle special case of empty last value.
          if (/,\s*$/.test(text)) a.push('');
          return a;
      };

      getCellValue(col): any {
          if (this._currentRowIdx >= this.getRowCount())
              throw new FinchyException('Unable to retrieve column value as the iterator is out of the bounds of the result set. Current row index is ' + this._currentRowIdx + ', while the total row count is ' + this.getRowCount());
          let colIdx = this.validateAndConvertColumnReferenceToIdx(col);
          let rowDataArray = this._jsonResult.data[this._currentRowIdx];
          if (!isNonZeroLengthArray(rowDataArray))
              throw new FinchyException('Failed to retrieve column value. Row data for index ' + this._currentRowIdx + ' is in an unexpected format (i.e. not an array of values)');
          return rowDataArray[colIdx];
      }

      getColCount(): number {
          if (!isNonNullObject(this._jsonResult) || !isNonZeroLengthArray(this._jsonResult.schema))
              return 0;
          return this._jsonResult.schema.length;
      }

      getColNames(): Array<string> {
          return this._columnsByIdx.map(function (obj) {
              return obj.columnName;
          });
      }

      getCurrentRowIdx(): number {
          return this._currentRowIdx;
      }

      getColumns(): Array<{columnName: string, type: string}> {
          // creates a cloned version of the column list
          return this._columnsByIdx.map(function (obj) {
              return {
                  columnName: obj.columnName,
                  type: obj.type
              };
          });
      }

      getMultiSelectCellValue(col: string): Array<string> {
          let textValue = this.getCellValue(col);
          if (!isNonNullOrWhitespaceString(textValue))
              return null;
          return this.csvToArray(textValue);
      }

      getRowCount(): number {
          if (!isNonNullObject(this._jsonResult) || !isNonZeroLengthArray(this._jsonResult.data))
              return 0;
          return this._jsonResult.data.length;
      }

      toObjectArray(): Array<Object> {
          let result = [];
          this._jsonResult.data.forEach(row => {
              let rowObject = {};
              for (let i = 0; i < row.length; i++) {
                  rowObject[this._jsonResult.schema[i].columnName] = row[i];
              }
              result.push(rowObject);
          });
          return result;
      }

      moveToNextRow() {
          if (this._currentRowIdx < this.getRowCount()) {
              this._currentRowIdx++;
          } else {
              this._currentRowIdx = this.getRowCount();
          }
          return this._currentRowIdx < this.getRowCount();
      }

      moveToRow(idx: number) {
          if (idx < 0 || idx >= this.getRowCount())
              throw new FinchyException('Failed to move to row ' + idx + '. The specified index is out of the bounds of the result set which contains ' + this.getRowCount() + ' records');
          this._currentRowIdx = idx;
      }

      private processColumnHeaders() {
          this._columnsByName = {};
          this._columnsByIdx = [];
          if (!isNonNullObject(this._jsonResult) || !isNonZeroLengthArray(this._jsonResult.schema))
              return;
          for (let i = 0; i < this._jsonResult.schema.length; i++) {
              let colSpec = this._jsonResult.schema[i];
              if (!isNonNullObject(colSpec))
                  throw new FinchyException('Failed to parse column schema for column at index ' + i + '. Value is either null or not an object', this._jsonResult);
              if (!isNonNullOrWhitespaceString(colSpec.columnName))
                  throw new FinchyException('Failed to parse column schema for column at index ' + i + '. Column name is invalid', this._jsonResult);
              if (!isNonNullOrWhitespaceString(colSpec.type))
                  throw new FinchyException('Failed to parse column schema for column at index ' + i + '. Column type is invalid', this._jsonResult);
              if (!isUndefined(this._columnsByName[colSpec.columnName]))
                  throw new FinchyException('Failed to parse column schema for column at index ' + i + '. Column name is not unique', this._jsonResult);

              this._columnsByName[colSpec.columnName] = {
                  type: colSpec.type,
                  idx: i
              };
              this._columnsByIdx[i] = {
                  columnName: colSpec.columnName,
                  type: colSpec.type
              };
          }
      }

      resetIterator() {
          this._currentRowIdx = -1;
      }

      validateAndConvertColumnReferenceToIdx(col) {
          if (isNonNullOrWhitespaceString(col)) {
              if (!isNonNullObject(this._columnsByName[col]))
                  throw new FinchyException('Failed to retrieve column value. Column ' + col + ' could not be found in the result set');
              return this._columnsByName[col].idx;
          } else if (isInteger(col)) {
              if (col >= 0 && col < this.getColCount()) {
                  return col;
              } else {
                  throw new FinchyException('Failed to retrieve column value. The specified index value of ' + col + ' is outside of the bounds of the result set which has ' + this.getColCount() + ' columns');
              }
          } else {
              throw new FinchyException('Failed to retrieve column value. Parameter col must either be a valid column name belonging to the result set or a column index', { colParameterValue: col });
          }
      }
  }
}


function isFunction(obj: any): boolean {
  return (typeof obj === 'function');
}

function isNonNullOrWhitespaceString(text: string): boolean {
  if (typeof text !== 'string') return false;
  let re = /\s/gi;
  let result = text.replace(re, '');
 return (result !== '');
}

function isNonNullObject(obj: any): boolean {
  return (typeof obj === 'object' && obj !== null);
}

function isUndefined(obj: any): boolean {
  return (typeof obj === 'undefined');
}

function isBoolean(obj: any): boolean {
  return (typeof obj === 'boolean');
}

function isString(obj: any): boolean {
  return (typeof obj === 'string');
}

function isInteger(obj: any): boolean {
  return Number.isInteger(obj);
}

function isNonZeroLengthArray(obj) {
  if (!Array.isArray(obj))
      return false;
  if (obj.length === 0)
      return false;
  return true;
}


