import path from 'path';
import Translater from '../../translations/translater';

describe('Translater', ( ) => {
    const tempPath = path.resolve( __dirname, 'temp' );
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
})
