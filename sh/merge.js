var exec = require( 'child_process' ).exec;

var zerofill = function( _num, _wid ) {
	var str = String( _num );
	if ( _wid <= str.length ) {
		return str;
	} else {
		return new Array( _wid - str.length + 1 ).join( '0' ) + str;
	}
};

for ( var iBlend = 0; iBlend < 20; iBlend ++ ) {
	var infile1 = 'blend' + zerofill( iBlend, 4 ) + '.png';
	var infile2 = 'out' + zerofill( iBlend, 4 ) + '.png';
	var outfile = 'out' + zerofill( iBlend + 80, 4 ) + '.png';
	exec( 'convert ' + infile1 + ' ' + infile2 + ' -background none -compose lighten -flatten ' + outfile );
}
