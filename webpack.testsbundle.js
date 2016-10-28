import 'babel-polyfill';

// If we need to use Chai, we'll have already chaiEnzyme loaded
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme( ));

const context = require.context( './react/tests', true, /-test\.js$/ );
context.keys( ).forEach( context );
