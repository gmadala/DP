import fs from 'fs';

export default class Translater {

  translate( fromObj, toObj, fromType, toType ) {
    const filePath = __dirname + `/../../translations/${toType}_untranslated.txt`;
    const tFilePath = __dirname + `/../../translations/${toType}_translated.txt`;

    const translated = this._getTranslated( tFilePath );
    const mergedJson = this._mergeObjs( fromObj, toObj );
    const translateResult = this._translateStrings( fromObj, mergedJson, translated );

    this._saveTranslated( translateResult.json, toType );
    this._saveUntranslated( translateResult.strings, filePath, fromType, toType );
  }

  _saveTranslated( json, toType ) {
    const str = `module.exports = ${JSON.stringify(json)}`;
    const filePath = __dirname + `/${toType}.js`;

    fs.writeFile( filePath, str, 'utf-8', function( err ) {
      if ( err ) {
        return console.log( err );
      }
    } );
  }

  _saveUntranslated( untranslated, filePath, fromType, toType ) {
    console.log( '' );
    const str = untranslated.map( x => `${x.string} : ` ).join( '\n' );

    fs.writeFile( filePath, str, 'utf-8', function( err ) {
      if ( err ) {
        return console.log( err );
      }
      console.log( `${fromType} to ${toType}: ${untranslated.length} new translation(s) needed` );
      console.log( '' );
    } );
  }

  _getTranslated( filePath ) {
    const array = fs.readFileSync( filePath ).toString().split( "\n" );
    if ( typeof( array ) === 'object' ) {
      const newTrans = array.filter( x => {
        return typeof( x.split( ' : ' )[ 1 ] ) === 'string'
      } );
      return newTrans.map( x => {
        return {
          string: x.split( ' : ' )[ 0 ],
          translation: ( x.split( ' : ' )[ 1 ] ).replace( '\r', '' )
        }
      } );
    } else {
      return [];
    }
  }

  _mergeObjs( fromObj, toObj ) {
    let resultObj = {...fromObj,
      ...toObj
    }
    for ( let key of Object.keys( fromObj ) ) {
      if ( typeof( fromObj[ key ] ) === 'object' ) {
        resultObj[ key ] = this._mergeObjs( fromObj[ key ], toObj[ key ] )
      }
    }
    return resultObj;
  }

  _translateStrings( fromObj, toObj, newTranslations ) {
    let strings = [];
    let resultObj = {...toObj
    };
    for ( let key of Object.keys( fromObj ) ) {
      if ( typeof( resultObj ) !== 'undefined' ) {
        if ( typeof( fromObj[ key ] ) === 'object' ) {
          const subResult = this._translateStrings( fromObj[ key ], resultObj[ key ], newTranslations );
          strings = [ ...strings, ...subResult.strings ];
          resultObj[ key ] = {...( resultObj[ key ] ),
            ...subResult.json
          }
        } else if ( typeof( fromObj[ key ] ) === 'string' && typeof( resultObj[ key ] ) === 'string' ) {
          if ( fromObj[ key ] === resultObj[ key ] ) {
            if ( newTranslations.length > 0 ) {
              const found = newTranslations.find( x => x.string === fromObj[ key ] )
              if ( found && found.translation.length > 0 ) {
                resultObj[ key ] = found.translation;
              } else {
                strings.push( {
                  string: fromObj[ key ],
                  translation: ''
                } );
              }
            } else {
              strings.push( {
                string: fromObj[ key ],
                translation: ''
              } );
            }
          }
        }
      }
    }
    return {
      strings,
      json: resultObj
    };
  }
}
