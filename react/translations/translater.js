var fs = require('fs');

export default class Translater {

	translate(fromObj, toObj, fromType, toType) {
    const filePath = __dirname + `/../../translations/${toType}_untranslated.txt`;

    const translated = this._getTranslated(filePath);
  	const mergedJson = this._mergeObjs(fromObj, toObj);
    const untranslated = this._translateStrings(fromObj, mergedJson, translated);

    this._saveUntranslated(untranslated, filePath, fromType, toType);

    return { json: mergedJson, untranslated };
  }

  _saveUntranslated(untranslated, filePath, fromType, toType) {
    console.log('')
    const str = untranslated.map(x => `${x.string} : `).join('\n');

    fs.writeFile(filePath, str, 'utf-8', function(err) {
      if(err) {
          return console.log(err);
      }
      console.log(`${fromType} to ${toType}: ${untranslated.length} new translation(s) needed`);
      console.log('')
    });
  }

  _getTranslated(filePath) {
    const array = fs.readFileSync(filePath).toString().split("\n");
    const newTrans = array.filter(x => { return x.split(' : ')[1].length > 0 });
    return newTrans.map(x => { return { string: x.split(' : ')[0], translation: x.split(' : ')[1] } })
  }

  _mergeObjs(fromObj, toObj) {
  	let resultObj = {...fromObj, ...toObj}
  	for (let key of Object.keys(fromObj)) {
    	if (typeof(fromObj[key]) === 'object')  {
    		resultObj[key] = this._mergeObjs(fromObj[key], toObj[key])
      }
    }
    return resultObj;
	}

  _translateStrings(fromObj, toObj, newTranslations) {
  	let strings = [];
  	for (let key of Object.keys(fromObj)) {
    	if (typeof(toObj) !== 'undefined') {
        if (typeof(fromObj[key]) === 'object')  {
          const subStrings = this._translateStrings(fromObj[key], toObj[key], newTranslations);
          strings = [...strings, ...subStrings];
        } else if (typeof(fromObj[key]) === 'string' && typeof(toObj[key]) === 'string') {
          if (fromObj[key] === toObj[key]) {
          	if (newTranslations.length > 0) {
            	const found = newTranslations.find(x => x.string === fromObj[key])
              if (found) {
              	toObj[key] = found.translation;
              } else {
              	strings.push({ string: fromObj[key], translation: ''});
              }
            } else {
            	strings.push({ string: fromObj[key], translation: ''});
            }
          }
        }
      }
    }
    return strings;
  }
}
