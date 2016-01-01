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
	var outfile = 'blend' + zerofill( iBlend, 4 ) + '.png';
	exec( 'composite -dissolve ' + parseInt( 100 - iBlend * 5 ) + ' raw0080a.png raw0080b.png ' + outfile );
}
