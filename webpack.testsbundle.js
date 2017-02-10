import 'babel-polyfill';

// If we need to use Chai, we'll have already chaiEnzyme loaded
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

chai.should();

chai.use( chaiEnzyme() );
chai.use( chaiAsPromised );
chai.use( sinonChai );

const context = require.context( './react/tests', true, /.test\.js$/ );
context.keys().forEach( context );
