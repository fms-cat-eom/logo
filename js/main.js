( function() {

  var main = {};

  var distSize = 1024;
  var canvasSize = 512;

  var canvas = document.createElement( 'canvas' );
  document.body.appendChild( canvas );
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  gl = canvas.getContext( 'webgl' ) || it.canvas.getContext( 'experimental-webgl' );
  glCat = new GLCat( gl );

  var vert = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var programDistH = undefined;
  var programDistV = undefined;
  var programRaymarch = undefined;

  var quadVBO = glCat.createVertexbuffer( [1,-1,1,1,-1,-1,-1,1] );

  var textureLogo = {
    e: glCat.createTexture(),
    o: glCat.createTexture(),
    m: glCat.createTexture()
  };

  var noiseTexture = ( function() {
    var size = 64;
    var texture = glCat.createTexture( gl.LINEAR, gl.REPEAT );
    var array = new Uint8Array( size * size * 4 );
    for ( var i = 0; i < size * size; i ++ ) {
      array[ i * 4 + 0 ] = Math.floor( Math.random() * 256 );
      array[ i * 4 + 1 ] = Math.floor( Math.random() * 256 );
      array[ i * 4 + 2 ] = Math.floor( Math.random() * 256 );
      array[ i * 4 + 3 ] = 255;
    }
    glCat.setTextureFromArray( texture, size, size, array );
    return texture;
  } )();

  var framebufferDist = glCat.createFramebuffer( distSize, distSize );
  var framebufferLogo = {
    e: glCat.createFramebuffer( distSize, distSize ),
    o: glCat.createFramebuffer( distSize, distSize ),
    m: glCat.createFramebuffer( distSize, distSize )
  };

  var ready = false;
  var frame = 0;

  var prepare = function() {

    for ( i = 0; i < 3; i ++ ) {
      var char = [ 'e', 'o', 'm' ][ i ];

      glCat.useProgram( programDistH );
      gl.bindFramebuffer( gl.FRAMEBUFFER, framebufferDist );
      gl.viewport( 0, 0, distSize, distSize );

      glCat.clear();

      glCat.attribute( 'p', quadVBO, 2 );
      glCat.uniform2fv( 'resolution', [ distSize, distSize ] );
      glCat.uniformTexture( 'texture', textureLogo[ char ], 0 );

      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      gl.flush();

      // ------

      glCat.useProgram( programDistV );
      gl.bindFramebuffer( gl.FRAMEBUFFER, framebufferLogo[ char ] );
      gl.viewport( 0, 0, distSize, distSize );

      glCat.attribute( 'p', quadVBO, 2 );
      glCat.uniform2fv( 'resolution', [ distSize, distSize ] );
      glCat.uniformTexture( 'texture', framebufferDist.texture, 0 );

      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      gl.flush();
    }

  };

  var update = function() {

    glCat.useProgram( programRaymarch );
    gl.bindFramebuffer( gl.FRAMEBUFFER, null );
    gl.viewport( 0, 0, canvasSize, canvasSize );

    glCat.clear();

    glCat.attribute( 'p', quadVBO, 2 );
    glCat.uniform1f( 'time', frame / 600.0 );
    glCat.uniform2fv( 'resolution', [ canvasSize, canvasSize ] );
    glCat.uniformTexture( 'textureLogoE', framebufferLogo[ 'e' ].texture, 0 );
    glCat.uniformTexture( 'textureLogoO', framebufferLogo[ 'o' ].texture, 1 );
    glCat.uniformTexture( 'textureLogoM', framebufferLogo[ 'm' ].texture, 2 );
    glCat.uniformTexture( 'noiseTexture', noiseTexture, 3 );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    gl.flush();

    frame ++;
    if ( 1200 < frame ) { frame = 0; }

    // var url = canvas.toDataURL();
    // var a = document.createElement( 'a' );
    // a.download = ( '000' + frame ).slice( -4 ) + '.png';
    // a.href = url;
    // a.click();

    requestAnimationFrame( update );

  };

  document.getElementById( 'button' ).addEventListener( 'click', function() {
    update();
  } );

  step( {

    0: function( _step ) {
      requestText( 'lib/distanceField.frag', function( _text ){
        programDistH = glCat.createProgram( vert, '#define HORI\n' + _text );
        programDistV = glCat.createProgram( vert, '#define VERT\n' + _text );
        _step();
      } );

      requestText( 'raymarch.frag', function( _text ) {
        programRaymarch = glCat.createProgram( vert, _text );
        _step();
      } );

      for ( var i = 0; i < 3; i ++ ) {
        ( function() {
          var char = [ 'e', 'o', 'm' ][ i ];
          requestImage( char + '.png', function( _image ) {
            glCat.setTexture( textureLogo[ char ], _image );
            _step();
          } );
        } )();
      }
    },

    5: function( _step ) {
      console.log( textureLogo );
      prepare();
      ready = true;
    }

  } );

} )();
