/* eslint-disable */
import fs from 'fs';
import path from 'path';

export default class Translater {
    constructor( outputPath, resourcesPath ) {
        this.outputPath = outputPath;
        this.resourcesPath = resourcesPath;
    }

    translate( fromObj, toObj, fromType, toType ) {
        const filePath = path.resolve( this.outputPath, `${ toType }_untranslated.txt` );
        const tFilePath = path.resolve( this.outputPath, `${ toType }_translated.txt` );

        const translated = this._getTranslated( tFilePath );
        const mergedJson = this._mergeObjs( fromObj, toObj );
        const translateResult = this._translateStrings( fromObj, mergedJson, translated );

        return this._saveTranslated( translateResult.json, toType ) && this._saveUntranslated( translateResult.strings, filePath, fromType, toType );
    }

    _saveTranslated( json, toType ) {
        const str = `module.exports = ${ JSON.stringify( json ) }`;
        const filePath = path.resolve( this.resourcesPath, `${ toType }.js` );

        try {
            fs.writeFileSync( filePath, str );

            return true;
        } catch ( err ) {
            console.log( err );
            return false;
        }
    }

    _saveUntranslated( untranslated, filePath, fromType, toType ) {
        const str = untranslated.map( x => `${ x.string } : ` ).join( '\n' );

        try {
            fs.writeFileSync( filePath, str );

            console.log( '' );
            console.log( `${ fromType } to ${ toType }: ${ untranslated.length } new translation(s) needed` );
            console.log( '' );

            return true;
        } catch ( err ) {
            console.log( err );
            return false;
        }
    }

    _getTranslated( filePath ) {
        try {
            const array = fs.readFileSync( filePath ).toString( ).split( "\n" );
            const newTrans = array.filter(x => {
                return typeof( x.split( ' : ' )[ 1 ]) === 'string'
            });

            return newTrans.map(x => {
                return {
                    string: x.split( ' : ' )[0],
                    translation: ( x.split( ' : ' )[ 1 ]).replace( '\r', '' )
                }
            });
        } catch ( err ) {
            return [ ];
        }
    }

    _mergeObjs( fromObj, toObj ) {
        let resultObj = {
            ...fromObj,
            ...toObj
        }
        for (let key of Object.keys( fromObj )) {
            if ( typeof(fromObj[key]) === 'object' ) {
                resultObj[key] = this._mergeObjs(fromObj[key], toObj[key])
            }
        }
        return resultObj;
    }

    _translateStrings( fromObj, toObj, newTranslations ) {
        let strings = [ ];
        let resultObj = {
            ...toObj
        };
        for (let key of Object.keys( fromObj )) {
            if ( typeof( resultObj ) !== 'undefined' ) {
                if ( typeof(fromObj[key]) === 'object' ) {
                    const subResult = this._translateStrings( fromObj[key], resultObj[key], newTranslations );
                    strings = [
                        ...strings,
                        ...subResult.strings
                    ];
                    resultObj[key] = {
                        ...(resultObj[key]),
                        ...subResult.json
                    }
                } else if ( typeof(fromObj[key]) === 'string' && typeof(resultObj[key]) === 'string' ) {
                    if (fromObj[key] === resultObj[key]) {
                        if ( newTranslations.length > 0 ) {
                            const found = newTranslations.find(x => x.string === fromObj[key])
                            if ( found && found.translation.length > 0 ) {
                                resultObj[key] = found.translation;
                            } else {
                                strings.push({ string: fromObj[key], translation: '' });
                            }
                        } else {
                            strings.push({ string: fromObj[key], translation: '' });
                        }
                    }
                }
            }
        }
        return { strings, json: resultObj };
    }
}
