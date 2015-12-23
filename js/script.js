var Bird = function () {

	var scope = this;

	THREE.Geometry.call( this );

	v(   5,   0,   0 );
	v( - 5, - 1.5,   1 );
	v( - 5,   0,   0 );
	v( - 5, - 1.5, - 1 );

	v(   0,   3, - 6 );
	v(   0,   3,   6 );
	v(   2,   0,   0 );
	v( - 3,   0,   0 );

	v(	 4,		0,	 0 );
	v(	 4,	 -2, 3 );
	v(	 4,	 -2,-3 );

	v(	-4.5,-2,   0 );

	f3( 0, 2, 1 );
	f3( 0, 3, 2 );

	f3( 4, 7, 6 );
	f3( 5, 6, 7 );

	f3( 8, 9, 6 );
	f3( 8, 10, 6 );

	f3( 1, 3, 11);
	this.computeFaceNormals();

	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vector3( x, y, z ) );

	}

	function f3( a, b, c ) {

		scope.faces.push( new THREE.Face3( a, b, c ) );

	}

}

Bird.prototype = Object.create( THREE.Geometry.prototype );
Bird.prototype.constructor = Bird;


var Boid = function() {

	var vector = new THREE.Vector3(),
	_acceleration, _width = 500, _height = 500, _depth = 200, _goal, _neighborhoodRadius = 100,
	_maxSpeed = 4, _maxSteerForce = 0.1, _avoidWalls = false;

	this.position = new THREE.Vector3();
	this.velocity = new THREE.Vector3();
	_acceleration = new THREE.Vector3();

	this.setGoal = function ( target ) {

		_goal = target;

	}

	this.setAvoidWalls = function ( value ) {

		_avoidWalls = value;

	}

	this.setWorldSize = function ( width, height, depth ) {

		_width = width;
		_height = height;
		_depth = depth;

	}

	this.run = function ( boids ) {

		if ( _avoidWalls ) {

			vector.set( - _width, this.position.y, this.position.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( 5 );
			_acceleration.add( vector );

			vector.set( _width, this.position.y, this.position.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( 5 );
			_acceleration.add( vector );

			vector.set( this.position.x, - _height, this.position.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( 5 );
			_acceleration.add( vector );

			vector.set( this.position.x, _height, this.position.z );
			vector = this.avoid( vector );
			vector.multiplyScalar( 5 );
			_acceleration.add( vector );

			vector.set( this.position.x, this.position.y, - _depth );
			vector = this.avoid( vector );
			vector.multiplyScalar( 5 );
			_acceleration.add( vector );

			vector.set( this.position.x, this.position.y, _depth );
			vector = this.avoid( vector );
			vector.multiplyScalar( 5 );
			_acceleration.add( vector );

		}/* else {

			this.checkBounds();

		}
		*/

		if ( Math.random() > 0.5 ) {

			this.flock( boids );

		}

		this.move();

	}

	this.flock = function ( boids ) {

		if ( _goal ) {

			_acceleration.add( this.reach( _goal, 0.005 ) );

		}

		_acceleration.add( this.alignment( boids ) );
		_acceleration.add( this.cohesion( boids ) );
		_acceleration.add( this.separation( boids ) );

	}

	this.move = function () {

		this.velocity.add( _acceleration );

		var l = this.velocity.length();

		if ( l > _maxSpeed ) {

			this.velocity.divideScalar( l / _maxSpeed );

		}

		this.position.add( this.velocity );
		_acceleration.set( 0, 0, 0 );

	}

	this.checkBounds = function () {

		if ( this.position.x >   _width ) this.position.x = - _width;
		if ( this.position.x < - _width ) this.position.x =   _width;
		if ( this.position.y >   _height ) this.position.y = - _height;
		if ( this.position.y < - _height ) this.position.y =  _height;
		if ( this.position.z >  _depth ) this.position.z = - _depth;
		if ( this.position.z < - _depth ) this.position.z =  _depth;

	}

	//

	this.avoid = function ( target ) {

		var steer = new THREE.Vector3();

		steer.copy( this.position );
		steer.sub( target );

		steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );

		return steer;

	}

	this.repulse = function ( target ) {

		var distance = this.position.distanceTo( target );

		if ( distance < 150 ) {

			var steer = new THREE.Vector3();

			steer.subVectors( this.position, target );
			steer.multiplyScalar( 0.5 / distance );

			_acceleration.add( steer );

		}

	}

	this.reach = function ( target, amount ) {

		var steer = new THREE.Vector3();

		steer.subVectors( target, this.position );
		steer.multiplyScalar( amount );

		return steer;

	}

	this.alignment = function ( boids ) {

		var boid, velSum = new THREE.Vector3(),
		count = 0;

		for ( var i = 0, il = boids.length; i < il; i++ ) {

			if ( Math.random() > 0.6 ) continue;

			boid = boids[ i ];

			distance = boid.position.distanceTo( this.position );

			if ( distance > 0 && distance <= _neighborhoodRadius ) {

				velSum.add( boid.velocity );
				count++;

			}

		}

		if ( count > 0 ) {

			velSum.divideScalar( count );

			var l = velSum.length();

			if ( l > _maxSteerForce ) {

				velSum.divideScalar( l / _maxSteerForce );

			}

		}

		return velSum;

	}

	this.cohesion = function ( boids ) {

		var boid, distance,
		posSum = new THREE.Vector3(),
		steer = new THREE.Vector3(),
		count = 0;

		for ( var i = 0, il = boids.length; i < il; i ++ ) {

			if ( Math.random() > 0.6 ) continue;

			boid = boids[ i ];
			distance = boid.position.distanceTo( this.position );

			if ( distance > 0 && distance <= _neighborhoodRadius ) {

				posSum.add( boid.position );
				count++;

			}

		}

		if ( count > 0 ) {

			posSum.divideScalar( count );

		}

		steer.subVectors( posSum, this.position );

		var l = steer.length();

		if ( l > _maxSteerForce ) {

			steer.divideScalar( l / _maxSteerForce );

		}

		return steer;

	}

	this.separation = function ( boids ) {

		var boid, distance,
		posSum = new THREE.Vector3(),
		repulse = new THREE.Vector3();

		for ( var i = 0, il = boids.length; i < il; i ++ ) {

			if ( Math.random() > 0.6 ) continue;

			boid = boids[ i ];
			distance = boid.position.distanceTo( this.position );

			if ( distance > 0 && distance <= _neighborhoodRadius ) {

				repulse.subVectors( this.position, boid.position );
				repulse.normalize();
				repulse.divideScalar( distance );
				posSum.add( repulse );

			}

		}

		return posSum;

	}

}

var camera, scene, renderer,birds, bird, bird1;

var boid, boids, clrs;


function	loadthree(){
	var SCREEN_WIDTH = window.innerWidth,
	SCREEN_HEIGHT = window.innerHeight,
	SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
	SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	container = document.getElementById('container');
	var renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize( container.offsetWidth, container.offsetHeight );
	container.appendChild( renderer.domElement );
	var scene1 = new THREE.Scene();
	var camera1 = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	container1 = document.getElementById('designview');
	var renderer1 = new THREE.WebGLRenderer({ alpha: true });
	renderer1.setSize( container.offsetWidth, container.offsetHeight );
	container1.appendChild( renderer1.domElement );
	bird1  = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:0x000000, side: THREE.DoubleSide } ) );
	bird1.phase = Math.floor( Math.random() * 62.83 );
	scene1.add( bird1 );
	camera1.position.z = 50;
	var render1 = function () {
		requestAnimationFrame( render1 );

		//bird1.rotation.z += 0.1;
		//bird1.rotation.y += 0.1;

		//renderer1.render(scene1, camera1);
	};
	render1();

	birds = [];
	boids = [];
	clrs  = [];
	for ( var i = 0; i < 200; i ++ ) {

		boid = boids[ i ] = new Boid();
		boid.position.x = Math.random() * 400 - 200;
		boid.position.y = Math.random() * 400 - 200;
		boid.position.z = Math.random() * 400 - 200;
		boid.velocity.x = Math.random() * 2 - 1;
		boid.velocity.y = Math.random() * 2 - 1;
		boid.velocity.z = Math.random() * 2 - 1;
		boid.setAvoidWalls( true );
		boid.setWorldSize( 500, 500, 400 );
		clrs[i]=[];
		clrs[i]['r']=rt=parseInt((Math.random()*1000)%255);
		clrs[i]['g']=gt=parseInt((Math.random()*1000)%255);
		clrs[i]['b']=bt=parseInt((Math.random()*1000)%255);
		rnd=rt.toString(16)+gt.toString(16)+bt.toString(16);
		bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:parseInt("0x"+ rnd), side: THREE.DoubleSide } ) );
		bird.phase = Math.floor( Math.random() * 62.83 );
		scene.add( bird );

	}
	function animate() {

		requestAnimationFrame( animate );

		render();

	}

	function render() {

	for ( var i = 0, il = birds.length; i < il; i++ ) {

		boid = boids[ i ];
		boid.run( boids );

		bird = birds[ i ];
		bird.position.copy( boids[ i ].position );
		color = bird.material.color;
		//color.r = clrs[i]['r'] -(( ( 500 - bird.position.z ) / 1000));
		//color.g = clrs[i]['g'] -(( ( 500 - bird.position.z ) / 1000));
		//color.b = clrs[i]['b'] -(( ( 500 - bird.position.z ) / 1000));
		bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
		bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

		bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
		bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;

	}

	renderer.render( scene, camera );

}

	animate();
	camera.position.z = 450;
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	function onDocumentMouseMove( event ) {

		var vector = new THREE.Vector3( event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0 );

		for ( var i = 0, il = boids.length; i < il; i++ ) {

			boid = boids[ i ];

			vector.z = boid.position.z;

			boid.repulse( vector );

		}

	}
	window.addEventListener( 'resize', onWindowResize, false );
	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}
}


window.onload = function(){
	$('body').fadeIn(3000, function() {
        //alert('ani done');
        var vl = $('nav').children();
        var cnt =0,lgt=20;
       	vlinks=setInterval(function () {
       		$(vl[cnt]).css("left",lgt+"%");
   			lgt=lgt+15;
        	$(vl[cnt]).slideDown(300, function() {
   			 	++cnt;

   			 	if(cnt==4)clearInterval(vlinks);;
  			});
    	}, 400);
			loadthree();
      });
      	var myVar = setInterval(function(){myTimer();}, 5000);

		function myTimer() {
		 	var r = Math.floor(Math.random() * 256);
		    document.getElementById("apear").innerHTML =  "<span id='stdone' style='font-family:Wingdings;display:none;'>"+String.fromCharCode(r)+"</span>";
		    $('#stdone').fadeIn(4000);
		}
    $('#welcon').css("display","block");
};

function loadcon (e) {
	$("#sideholder").children(".activebutton").removeClass("activebutton");
	$(e).addClass("activebutton");
  	$('#conholder').children(".selected").fadeOut(1000).removeClass("selected");
  	var a = $(e).attr("datafld");
	$('#'+a).fadeIn(2000).addClass("selected");
}
