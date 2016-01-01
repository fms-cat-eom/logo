precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D textureLogoE;
uniform sampler2D textureLogoO;
uniform sampler2D textureLogoM;
uniform sampler2D noiseTexture;

#define PI 3.14159265
#define V vec2(0.,1.)

#define saturate(i) clamp(i,0.,1.)

vec3 noise( vec2 _p ) {
  vec3 sum = vec3( 0.0 );
  for ( int iLoop = 0; iLoop < 8; iLoop ++ ) {
    float i = float( iLoop );
    vec2 p = _p * pow( 2.0, i );
    sum += texture2D( noiseTexture, p ).xyz / pow( 2.0, i + 1.0 );
  }
  return sum;
}

float aexp( float _x, float _k ) {
  return ( exp( -saturate( _x ) * _k ) - exp( -_k ) ) / ( 1.0 - exp( -_k ) );
}

float smin( float _a, float _b, float _k, inout float h ) {
  h = clamp( 0.5 + 0.5 * ( _b - _a ) / _k, 0.0, 1.0 );
  return mix( _b, _a, h ) - _k * h * ( 1.0 - h );
}

float smin( float _a, float _b, float _k ) {
  float dummy;
  return smin( _a, _b, _k, dummy );
}

vec3 hash( vec3 _v ) {
  return fract( sin( vec3(
    dot( _v, vec3( 7.544, 6.791, 7.143 ) ) * 179.197,
    dot( _v, vec3( 6.943, 7.868, 7.256 ) ) * 176.465,
    dot( _v, vec3( 7.152, 7.276, 6.876 ) ) * 172.967
  ) ) * 2854.21 );
}

mat2 rotate( float _t ) {
  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );
}

float sphere( vec3 _p, float _r ) {
  return length( _p ) - _r;
}

float wordLogoE( vec3 _p ) {
  vec3 p = _p;
  vec2 distXY = vec2(
    ( texture2D( textureLogoE, p.xy + 0.5 ).x - 0.5 ),
    abs( p.z ) - 0.03
  );
  return min( max( distXY.x, distXY.y ), 0.0 ) + length( max( distXY, 0.0 ) );
}

float wordLogoO( vec3 _p ) {
  vec3 p = _p;
  vec2 distXY = vec2(
    ( texture2D( textureLogoO, p.xy + 0.5 ).x - 0.5 ),
    abs( p.z ) - 0.03
  );
  return min( max( distXY.x, distXY.y ), 0.0 ) + length( max( distXY, 0.0 ) );
}

float wordLogoM( vec3 _p ) {
  vec3 p = _p;
  vec2 distXY = vec2(
    ( texture2D( textureLogoM, p.xy + 0.5 ).x - 0.5 ),
    abs( p.z ) - 0.03
  );
  return min( max( distXY.x, distXY.y ), 0.0 ) + length( max( distXY, 0.0 ) );
}

float wave( vec3 _p ) {
  float height = noise( _p.xz ).x;
  return _p.y + abs( height - 0.5 ) * 0.4 + 0.15;
}

float slasher( vec3 _p, float _density, float _ratio ) {
  float phase = ( _p.x + _p.y ) * _density;
  float slash = abs( 0.5 - ( phase - floor( phase ) ) ) * 2.0;
  return ( slash - _ratio ) / _density / sqrt( 3.0 );
}

float sphere1( vec3 _p, float _phase ) {
  float phase = aexp( _phase, 9.0 );
  vec3 p = _p + ( texture2D( noiseTexture, _p.xz ).xyz - 0.5 ) * vec3( 0.0, 1.0, 0.0 ) * phase * 0.1;
  return length( p ) - 0.195 * ( 1.0 - phase );
}

float sphere2( vec3 _p, float _phase ) {
  float phase = aexp( _phase, 5.0 );
  vec3 p = _p;
  float dist = 1E9;

  float k = 0.2;
  float spherePos = ( 1.0 - phase ) * 0.15;
  float sphereRot = phase * 1.0;
  float sphereSize = 0.1;

  for ( int iLoop = 0; iLoop < 4; iLoop ++ ) {
    int i = iLoop;
    vec3 pos = vec3( 0.0 );
    if ( i == 0 ) { pos = vec3( -1.0, -1.0, -1.0 ); }
    else if ( i == 1 ) { pos = vec3( 1.0, 1.0, -1.0 ); }
    else if ( i == 2 ) { pos = vec3( 1.0, -1.0, 1.0 ); }
    else { pos = vec3( -1.0, 1.0, 1.0 ); }
    pos *= spherePos;
    pos.yz = rotate( sphereRot ) * pos.yz;
    pos.zx = rotate( sphereRot ) * pos.zx;
    dist = smin( dist, sphere( p + pos, sphereSize ), k );
  }

  float sl = slasher( _p + vec3( 0.125, 0.0, 0.0 ), 20.0, 1.2 - phase * 2.4 );
  float sl2 = slasher( _p.xzy + vec3( 0.125, 0.0, 0.0 ), 20.0, 1.2 - phase * 2.4 );
  return max( max( dist, -sl ), -sl2 );
}

float words2( vec3 _p, float _phase ) {
  float phase = aexp( _phase, 5.0 );

  vec3 p = _p;
  p.zx = rotate( phase * PI * 1.0 ) * p.zx;
  //p.x += sin( floor( p.y * 50.0 ) + time ) * 0.1;
  float wordZoom = ( 1.0 - phase ) * 0.5;
  float dist = 1E9;
  dist = min( dist, wordLogoE( ( p + wordZoom * V.yxx * 0.48 ) / wordZoom ) * wordZoom );
  dist = min( dist, wordLogoO( ( p + wordZoom * V.yxx * 0.08 ) / wordZoom ) * wordZoom );
  dist = min( dist, wordLogoM( ( p - wordZoom * V.yxx * 0.4 ) / wordZoom ) * wordZoom );

  float sl = slasher( _p, 20.0, phase * 2.4 - 0.2 );
  dist = max( dist, -sl );

  return dist;
}

float words3( vec3 _p, float _phase ) {
  float phase = 0.0;
  vec3 p = _p;
  float wordZoom = 0.5;
  float dist = 1E9;

  phase = saturate( aexp( _phase * 1.4, 9.0 ) );
  wordZoom = 0.3 + phase * 0.2;
  p = mix(
    ( _p - wordZoom * vec3( -0.97, 0.5, 0.0 ) ),
    ( _p + wordZoom * V.yxx * 0.48 ),
    phase
  );
  dist = min( dist, wordLogoE( p / wordZoom ) * wordZoom );

  phase = saturate( aexp( _phase * 1.4, 9.0 ) );
  wordZoom = 0.3 + phase * 0.2;
  p = mix(
    ( _p - wordZoom * vec3( -0.93, 0.0, 0.0 ) ),
    ( _p + wordZoom * V.yxx * 0.08 ),
    phase
  );
  dist = min( dist, wordLogoO( p / wordZoom ) * wordZoom );

  phase = saturate( aexp( _phase * 1.4, 9.0 ) );
  wordZoom = 0.3 + phase * 0.2;
  p = mix(
    ( _p - wordZoom * vec3( -0.90, -0.5, 0.0 ) ),
    ( _p - wordZoom * V.yxx * 0.4 ),
    phase
  );
  dist = min( dist, wordLogoM( p / wordZoom ) * wordZoom );

  return dist;
}

float distFunc( vec3 _p, inout vec4 mtl ) {
  vec3 p = _p;

  float dist = 0.0;

  if ( 0.0 <= time && time < 0.5 ) {
    float phase = time * 2.0;
    dist = sphere1( p, phase );
  } else if ( 0.5 <= time && time < 1.0 ) {
    float phase = ( time - 0.5 ) * 2.0;
    dist = words2( p, phase );
    dist = min( dist, sphere2( p, phase ) );
  } else if ( 1.0 <= time && time < 1.5 ) {
    float phase = ( time - 1.0 ) * 2.0;
    dist = words3( p, phase );
  }

  return dist;
}

float distFunc( vec3 _p ) {
  vec4 dummy;
  return distFunc( _p, dummy );
}

vec3 normalFunc( vec3 _p, float _d ) {
  vec2 d = vec2( 0.0, _d );
  return normalize( vec3(
    distFunc( _p + d.yxx ) - distFunc( _p - d.yxx ),
    distFunc( _p + d.xyx ) - distFunc( _p - d.xyx ),
    distFunc( _p + d.xxy ) - distFunc( _p - d.xxy )
  ) );
}

vec3 catColor( float _t ) {
  return vec3(
    cos( _t ),
    cos( _t + PI / 3.0 * 4.0 ),
    cos( _t + PI / 3.0 * 2.0 )
  ) * 0.5 + 0.5;
}

void main() {
  vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / resolution.x;

  vec3 camPos = vec3( 0.0, 0.0, 1.0 );
  vec3 camCen = vec3( 0.0, 0.0, 0.0 );
  vec3 camDir = normalize( camCen - camPos );
  vec3 camAir = vec3( 0.0, 1.0, 0.0 );
  vec3 camSid = normalize( cross( camDir, camAir ) );
  vec3 camTop = normalize( cross( camSid, camDir ) );

  float ortho_persp = 1.0 - aexp( ( time - 1.0 ) * 2.0, 5.0 );
  vec3 rayDir = mix(
    normalize( p.x * camSid + p.y * camTop + camDir * 2.0 ),
    camDir,
    ortho_persp
  );
  vec3 rayBeg = mix(
    camPos,
    camPos + p.x * camSid * 0.5 + p.y * camTop * 0.5,
    ortho_persp
  );
  float rayLen = 0.01;
  vec3 rayPos = rayBeg + rayLen * rayDir;

  float dist = 0.0;
  vec4 mtl = vec4( 0.0 );

  for ( int i = 0; i < 100; i ++ ) {
    dist = distFunc( rayPos, mtl );
    rayLen += dist * 0.6;
    rayPos = rayBeg + rayLen * rayDir;
    if ( dist < 1E-3 || 5E1 < rayLen ) { break; }
  }

  if ( dist < 1E-2 ) {
    vec3 nor = normalFunc( rayPos, 3E-3 );
    vec3 ligPos = vec3( -2.0, 1.0, 5.0 );
    vec3 ligDir = normalize( rayPos - ligPos );
    vec3 difCol = vec3( 1.0 );
    vec3 dif = saturate( dot( -nor, ligDir ) * 0.6 + 0.3 ) * difCol;
    float decay = exp( -rayLen * 0.1 );
    gl_FragColor = vec4( dif, 1.0 );
  } else {
    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
  }
}
