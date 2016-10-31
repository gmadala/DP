import path from 'path';
import Translater from '../../translations/translater';

import enLocale from '../../translations/en';
import esLocale from '../../translations/es';

const tempPath = path.resolve( __dirname, 'temp' );

describe('Translater', ( ) => {
  const t = new Translater( tempPath, tempPath );
  it('has outputPath and resourcesPath properties after instantiation', ( ) => {
    expect( t ).to.have.property( 'outputPath' );
    expect( t ).to.have.property( 'resourcesPath' );
  })

  it('has outputPath and resourcesPath that are type string', ( ) => {
    assert.typeOf( t.outputPath, 'string' );
    assert.typeOf( t.resourcesPath, 'string' );
  })

  it('has a translate function', ( ) => {
    expect( t ).to.have.property( 'translate' );
    assert.typeOf( t.translate, 'function' )
  })

  it('returns a promise', ( ) => {
    const result = t.translate( enLocale, esLocale, 'en', 'es' );
    expect( result ).to.be.a( 'promise' );
  })
})
