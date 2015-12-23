function loadthree(){
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

	container = document.getElementById('container');
  $('#container').css("height",Math.max($(document).height(), $(window).height()));
  $('#container').css("width","100%");
  $('#container').css("position","absolute");
  $('#container').css("z-index","-1");
	camera = new THREE.PerspectiveCamera( 50, container.offsetWidth / container.offsetHeight, 1, 5000 );
	camera.position.set( 0, 0, 1500 );

	scene = new THREE.Scene();
	var circleRadius = 100;
	var circleShape = new THREE.Shape();
	circleShape.moveTo( 0, circleRadius );
	circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
	circleShape.quadraticCurveTo( circleRadius, -circleRadius, 0, -circleRadius );
  var arcShape = new THREE.Shape();
	arcShape.moveTo( circleRadius  , 0 );
	arcShape.absarc( 0, 0, circleRadius, 0, Math.PI, false );
  var holePath = new THREE.Path();
	holePath.moveTo( circleRadius -10 , 0  );
	holePath.absarc( 0, 0, circleRadius - 10 , 0, Math.PI, true );
	arcShape.holes.push( holePath );
  function addShape( shape, color, x, y, z, rx, ry, rz, s ) {

					var points = shape.createPointsGeometry();
					var spacedPoints = shape.createSpacedPointsGeometry( 50 );

					var geometry = new THREE.ShapeGeometry( shape );

					var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( ) );
					mesh.position.set( x, y, z);
					mesh.rotation.set( rx, ry, rz );
					mesh.scale.set( s, s, s );
					scene.add( mesh );

          var line = new THREE.Line( points, new THREE.LineBasicMaterial( { color: color, linewidth: 3 } ) );
					line.position.set( x, y, z - 25 );
					line.rotation.set( rx, ry, rz );
					line.scale.set( s, s, s );
					scene.add( line );
	}
  //addShape( arcShape, 0xffffff,  0,  0, 0, 0, 0, 0, 1 );
        var curve = new THREE.CubicBezierCurve3(
      	new THREE.Vector3( -100, 0, 0 ),
      	new THREE.Vector3( -50, 150, 0 ),
      	new THREE.Vector3( 80, 150, 0 ),
      	new THREE.Vector3( 100, 0, 0 )
      );

      var geometry = new THREE.Geometry();
      geometry.vertices = curve.getPoints( 50 );

      var material = new THREE.LineBasicMaterial( { color : 0xff0000 , linewidth: 10} );

      // Create the final Object3d to add to the scene
      var curveObject = new THREE.Line( geometry, material );
      scene.add(curveObject);

	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize( container.offsetWidth, container.offsetHeight  );
	container.appendChild( renderer.domElement );


	///document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	//document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length === 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length === 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

//

function animate() {

	requestAnimationFrame( animate );

	render();

}

function render() {

	var time = Date.now() * 0.00005;

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

	camera.lookAt( scene.position );

	for ( i = 0; i < scene.children.length; i ++ ) {

		var object = scene.children[ i ];

		if ( object instanceof THREE.PointCloud ) {

			object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

		}

	}

	for ( i = 0; i < materials.length; i ++ ) {

		color = parameters[i][0];

		h = ( 360 * ( color[0] + time ) % 360 ) / 360;
		materials[i].color.setHSL( h, color[1], color[2] );

	}

	renderer.render( scene, camera );

}

}
