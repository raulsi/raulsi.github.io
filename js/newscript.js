function loadthreex(){
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size;
var mouseX = 0, mouseY = 0;
var cWidth=0;
var cHeight=0;
var curverspeed=0.0003;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function createCurve(X,Y,xRadius,yRadius,aStartAngle,aEndAngle,aClockwise,color,ocolor,lineWidth,spacePoints,opacity,name){
  var curve = new THREE.EllipseCurve(
      0, 0,             // ax, aY
      xRadius, yRadius,            // xRadius, yRadius
      aStartAngle, aEndAngle, // aStartAngle, aEndAngle
      aClockwise             // aClockwise
  );

  var points = curve.getSpacedPoints( spacePoints );

  var path = new THREE.Path();
  var geometry = path.createGeometry( points );

  var material = new THREE.LineBasicMaterial( { color : color ,linewidth: lineWidth,opacity:opacity} );

  var line = new THREE.Line( geometry, material );
  line.position.set( 0, 0, 0 );
  line.name=name || "curvecollection";
  var initial = new THREE.Color(line.material.color.getHex());
  var value = new THREE.Color(ocolor);
  TweenMax.to(initial, 5, {     //This syntax is relevant to GSAP's TweenLite, I'll provide a link to the docs
        r: value.r,
        g: value.g,
        b: value.b,
        ease: Cubic.easeInOut,repeat:-1, yoyo:true,
        onUpdate: function() { line.material.color = initial; }
  });

  TweenMax.to(line.position, 2, {x:X,y:Y,delay:5,onUpdate: function() { curverspeed=0.0001; }});
  TweenMax.to(line.scale, 2, {x:"+4",y:"+4",delay:5});

  scene.add(line);
}
function addShape( shape, color, x, y, z, rx, ry, rz, s ) {

					// flat shape

	var geometry = new THREE.ShapeGeometry( shape );
	var material = new THREE.MeshBasicMaterial( { color: color, overdraw: 0.5 } );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.set( x, y, z );
	mesh.rotation.set( rx, ry, rz );
	mesh.scale.set( s, s, s );
	scene.add( mesh );
	// line
	var geometry = shape.createPointsGeometry();
	var material = new THREE.LineBasicMaterial( { linewidth: 10, color: 0x333333, transparent: true } );
	var line = new THREE.Line( geometry, material );
	line.position.set( x, y, z );
	line.rotation.set( rx, ry, rz );
	line.scale.set( s, s, s );
	scene.add( line );
}
function init() {

	container = document.getElementById('container');

	camera =  new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2,window.innerHeight / 2, window.innerHeight / - 2, 1, 2000 );
	camera.position.z = 1000;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );
  scene.add(camera);
	renderer = new THREE.CanvasRenderer({ alpha: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	$('#container').css("height","100%");
	$('#container').css("width","100%");
	$('#container').css("position","absolute");
	$('#container').css("z-index","-1");
	renderer.setSize( window.innerWidth, window.innerHeight  );
	container.appendChild( renderer.domElement );
  cWidth=window.innerWidth/2;
  cHeight=window.innerHeight/2;
  aspratio=cWidth/cHeight;
  colorarray=['#d3d3d3','#bdbdbd','#a8a8a8','#939393','#7e7e7e','#696969','#545454','#3f3f3f','#2a2a2a','#151515']
  crad=100;
  for(i=0;i<10;i++){
    createCurve(cWidth,-cHeight,crad-(i*(crad/10)),crad-(i*(crad/10)),0+(i*(crad/100)),Math.PI+(i*(crad/100)),false,colorarray[i],colorarray[9-i],(crad/100)*15,100,0.9);
  }
	var curve = new THREE.QuadraticBezierCurve3(
		new THREE.Vector3( -10, 0, 0 ),
		new THREE.Vector3( 20, 15, 0 ),
		new THREE.Vector3( 10, 0, 0 )
	);
	var path = new THREE.Path( curve.getPoints( 50 ) );

	var geometry = path.createPointsGeometry( 50 );
	var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

	//Create the final Object3d to add to the scene
	var curveObject = new THREE.Line( geometry, material );
	//scene.add(curveObject);
  /*var geometry = new THREE.Geometry();

	var vertex = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
	vertex.normalize();
	vertex.multiplyScalar( 450 );
	geometry.vertices.push( vertex );
	var vertex2 = vertex.clone();
	vertex2.multiplyScalar( Math.random() * 0.3 + 1 );
	geometry.vertices.push( vertex2 );
	var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: Math.random() } ) );
	scene.add( line );
  var arcShape = new THREE.Shape();
	arcShape.moveTo( 50, 10 );
	arcShape.absarc( 10, 10, 40, 0, Math.PI*2, false );

	var holePath = new THREE.Path();
	holePath.moveTo( 20, 10 );
	holePath.absarc( 10, 10, 10, 0, Math.PI*2, true );
	arcShape.holes.push( holePath );

  addShape( arcShape, 0xbb4422, 150, 0, 0, 0, 0, 0, 1 );*/
	//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
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
TweenLite.ticker.addEventListener("tick", render);
function render() {

	var time = Date.now() * curverspeed;

	camera.lookAt( scene.position );

	for ( i = 0; i < scene.children.length; i ++ ) {

		var object = scene.children[ i ];

		if ( object instanceof THREE.Line ) {
      if(object.name=="curvecollection")
      {
			     object.rotation.z = time * ( i % 2 ==0  ? i + 1 : - ( i + 1 ) );
      }

		}

	}


	renderer.render( scene, camera );

}

}


window.onload = function(){
  loadthreex();
	var toggleflag=0;
	var donechange=0;
	var onchanging=0;
	var scrollval=0;
	$(document).on("mousewheel",function(e){
		if(onchanging==0){
			if(toggleflag==0){
				TweenLite.to($('#details'),2,{top:"0px",height:"auto",onComplete:function(){onchanging=0;}});
				$('#pageswitch').css("top","0px");
				$('#pageswitch').css("bottom","auto");
				toggleflag=1;
			}else{
				TweenLite.to($('#details'),2,{top:"100%",height:"auto",onComplete:function(){onchanging=0;}});
				$('#pageswitch').css("top","auto");
				$('#pageswitch').css("bottom","0px");
				toggleflag=0;
			}
			onchanging=1;
		}
	});
	$('#pageswitch').on('click',function(e){
		clearTimeout(ptimer);
		if(toggleflag==0){
			TweenLite.to($('#details'),2,{top:"0px",height:"auto"});
			$('#pageswitch').css("top","0px");
			$('#pageswitch').css("bottom","auto");
			toggleflag=1;
		}else{
			TweenLite.to($('#details'),2,{top:"100%",height:"auto"});
			$('#pageswitch').css("top","auto");
			$('#pageswitch').css("bottom","0px");
			toggleflag=0;
		}
		donechange=1;
	});
	var ptimer;
	var tfunction = function(e){
		if(toggleflag==0){
			TweenLite.to($('#details'),2,{top:"0px",height:"auto", ease:Sine.easeIn});
			$('#pageswitch').css("top","0px");
			$('#pageswitch').css("bottom","auto");
			toggleflag=1;
		}else{
			TweenLite.to($('#details'),2,{top:"100%",height:"auto", ease:Sine.easeIn});
			$('#pageswitch').css("top","auto");
			$('#pageswitch').css("bottom","0px");
			toggleflag=0;
		}
		donechange=1;
	}
	$('#pageswitch').on('mouseout',function(e){
		clearTimeout(ptimer);
		if(donechange==0){
			if(toggleflag==0){
				TweenLite.to($('#details'),1,{height:"auto",top:"100%",ease:Expo.easeInOut});
			}else{
				TweenLite.to($('#details'),1,{height:"auto",top:"0px",ease:Expo.easeInOut});
			}
		}
	});
	$('#pageswitch').on('mouseenter',function(e){
		ptimer = setTimeout(tfunction, 3000);
		donechange=0;
		if(toggleflag==0){
			TweenLite.to($('#details'),1,{height:"50px",top:"auto",ease:Expo.easeInOut});
		}else{
			TweenLite.to($('#details'),1,{top:"50px",ease:Expo.easeInOut});
		}
	});
};
