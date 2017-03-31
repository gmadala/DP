/* eslint-disable */
import fs from 'fs';
import path from 'path';

const GetTranslatedStrings = ( filePath ) => {
    try {
        // read in file and split by line
        const array = fs.readFileSync( filePath ).toString( ).split( "\n" );

        // return only lines that have been translated
        const newTrans = array.filter(x => {
            return typeof( x.split( ':' )[ 1 ]) === 'string' && x.split( ':' )[ 1 ].length > 0
        });

        // map new translations to object array
        return newTrans.map(x => {
            return {
                string: x.split( ':' )[0].trim(),
                translation: ( x.split( ':' )[ 1 ]).trim().replace( '\r', '' )
            }
        });
    } catch ( err ) {
        return [ ];
    }
}

const SortByName = (a, b) => {
    var nameA = a.toUpperCase(); // ignore upper and lowercase
    var nameB = b.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    // names must be equal
    return 0;
}

const AddUpdateStrings = ( toObj, fromObj, translations ) => {
    // don't mutate the original object, assign to a new one
    const resultObj = Object.assign({}, toObj)
    const newItems = []

    // iterate through object properties
    for (let key of Object.keys( fromObj )) {
        // switch based on property type
        switch(typeof(fromObj[key])) {
            case 'object':
                // found an object, recurse to parent function
                const subResult = AddUpdateStrings((toObj[key] || {}), fromObj[key], translations)
                resultObj[key] = subResult.resultObj
                newItems.push(...subResult.newItems)
                break
            default:
                // find translation string
                const t = translations.find(x => x.string === fromObj[key])
                if (t && t.translation)
                    // only update if one is found
                    resultObj[key] = t.translation
                else if (!toObj[key]) {
                    // not yet translated, add to items to translate
                    newItems.push(fromObj[key])
                }
                break
        }
    }
    return { resultObj, newItems }
}

const SaveStrToFile = ( str, filePath ) => {
    try {
        fs.writeFileSync( filePath, str );

        return true;
    } catch ( err ) {
        console.log( err );
        return false;
    }
}

export default function Translate(outputPath, resourcesPath, fromLocaleObj, toLocaleObj, fromLocaleType, toLocaleType) {
    console.log()
    console.log(`-- starting translation ${fromLocaleType} to ${toLocaleType} --`)
    console.log()

    // setup path variables
    const translationsPath = path.resolve( outputPath, `${ toLocaleType }_translations.txt` );
    const fileOutputPath = path.resolve( resourcesPath, `${ toLocaleType }.js` );

    // get translated strings
    const translatedStrings = GetTranslatedStrings(translationsPath)
    console.log(translatedStrings)

    // update translations for this obj and get any untranslated strings
    const addUpdateResult = AddUpdateStrings(toLocaleObj, fromLocaleObj, translatedStrings)

    // format strings for saving to file
    const formattedStrings = addUpdateResult.newItems.filter(function(item, i, ar){ return ar.indexOf(item) === i; }).sort(SortByName).map( x => `${ x } : ` ).join( '\n' );

    // save untranslated strings to file
    SaveStrToFile(formattedStrings, translationsPath)

    // format translations for saving to file
    const formattedTranslations = `module.exports = ${ JSON.stringify( addUpdateResult.resultObj ) }`;

    // save new translations to file
    SaveStrToFile(formattedTranslations, fileOutputPath)

    console.log('-- translation complete --')
    console.log()
    console.log(`-- ${addUpdateResult.newItems.length} new translations needed --`)
    console.log()
}
