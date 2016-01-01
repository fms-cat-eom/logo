PFont font;
ArrayList<T> ts = new ArrayList<T>();

void setup() {
  size( 512, 512, P2D );
  font = createFont( "HelveticaNeue-Bold", 91 );

  ts.add( new T( "E", 106, 165 ) );
  ts.add( new T( "v", 151, 165 ) );
  ts.add( new T( "e", 193, 165 ) );
  ts.add( new T( "r", 229, 165 ) );
  ts.add( new T( "y", 271, 165 ) );
  ts.add( new T( "d", 316, 165 ) );
  ts.add( new T( "a", 363, 165 ) );
  ts.add( new T( "y", 406, 165 ) );

  ts.add( new T( "O", 112, 242 ) );
  ts.add( new T( "n", 168, 241 ) );
  ts.add( new T( "e", 215, 242 ) );

  ts.add( new T( "M", 117, 318 ) );
  ts.add( new T( "o", 178, 318 ) );
  ts.add( new T( "t", 215, 318 ) );
  ts.add( new T( "i", 238, 318 ) );
  ts.add( new T( "o", 271, 318 ) );
  ts.add( new T( "n", 319, 318 ) );
}

float aexp( float _x, float _k ) {
  return ( exp( -_x * _k ) - exp( -_k ) ) / ( 1.0 - exp( -_k ) );
}

void draw() {
  background( 0 );

  textFont( font );

  for ( T t: ts ) {
    t.update();
    t.draw();
    //t.hideDraw( aexp( frameCount / 200.0, 6.0 ) );
  }
  //save( "capture/" + nf( frameCount + 1000, 4 ) + ".png" );
}

class T {
  String chr;
  PVector pos;
  PVector vel;
  PVector acc;
  float rot;
  float rotVel;

  T( String _chr, float _x, float _y ) {
    this.chr = _chr;
    this.pos = new PVector( _x, _y );
    this.vel = new PVector( 0.0, 0.0 );
    this.acc = new PVector( random( 1.0 ) - 0.5, random( 1.0 ) - 0.5 );
    acc.mult( 0.002 );
    acc.y += 0.01;
    this.rot = 0.0;
    this.rotVel = ( random( 1.0 ) - 0.5 ) * 0.005;
  }

  void update() {
    vel.mult( 0.999 );
    vel.add( acc );
    pos.add( vel );
    rot += rotVel;
  }

  void draw() {
    textAlign( CENTER, CENTER );

    fill( 218 );
    pushMatrix();
    translate( this.pos.x, this.pos.y );
    rotate( rot );
    text( this.chr, 0, 0 );
    popMatrix();


  }

  void hideDraw( float _h ) {
    textAlign( CENTER, CENTER );

    fill( 218 );
    pushMatrix();
    translate( this.pos.x, this.pos.y + _h * 140.0 );
    rotate( rot );
    text( this.chr, 0, 0 );
    popMatrix();

    fill( 0 );
    noStroke();
    rect( this.pos.x - 50.0, this.pos.y + 70.0, 100, 200 );
  }
}
