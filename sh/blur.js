var exec = require( 'child_process' ).exec;

var start = 1001;
var end = 1300;
var step = 10;
var out = 100;

var zerofill = function( _num, _wid ) {
	var str = String( _num );
	if ( _wid <= str.length ) {
		return str;
	} else {
		return new Array( _wid - str.length + 1 ).join( '0' ) + str;
	}
};

var iFrame = start;
while ( iFrame < end ) {
	var infiles = '';
	for ( iBlur = 0; iBlur < step; iBlur ++ ) {
		infiles += zerofill( iFrame, 4 ) + '.png ';
		iFrame ++;
	}
	var outfile = 'out' + zerofill( out, 4 ) + '.png';
	exec( 'convert -average ' + infiles + outfile );
	out ++;
}
