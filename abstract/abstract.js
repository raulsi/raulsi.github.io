/**
* Rahul Singh
* http://raulsi.in/experiments/
* http://raulsi.github.io/
*/
function loadthreeexp(){

  var container, stats;
  var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size, particle;
  var mouseX = 0, mouseY = 0;
  var lastTime = (new Date()).getTime();
  var cWidth=0;
  var cHeight=0;
  var group;
  var groups=Array();
  var ground=Array();
  var grass;
  var onanime=0;
  var curverspeed=0.0003;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var parameters = {
				width: 2000,
				height: 2000,
				widthSegments: 250,
				heightSegments: 250,
				depth: 1500,
				param: 4,
				filterparam: 1
			};

	var waterNormals;
  var water;
  init();
  animate();
  function createbox(X,Y,Z,j){
    var particles = 1;

    var geometry = new THREE.BufferGeometry();

    var positions = new Float32Array( particles * 3 );
    var colors = new Float32Array( particles * 3 );

    var color = new THREE.Color();

    var n = 5, n2 = n / 2; // particles spread in the cube

    for ( var i = 0; i < positions.length; i += 3 ) {

      // positions

      var x = Math.random() * n - n2;
      var y = Math.random() * n - n2;
      var z = Math.random() * n - n2;

      positions[ i ]     = x;
      positions[ i + 1 ] = y;
      positions[ i + 2 ] = z;

      // colors

      var vx = ( x / n ) + 0.1;
      var vy = ( y / n ) + 0.1;
      var vz = ( z / n ) + 0.1;

      color.setRGB( vx, vy, vz );

      colors[ i ]     = color.r;
      colors[ i + 1 ] = color.r;
      colors[ i + 2 ] = color.r;

    }
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

    geometry.computeBoundingSphere();

    //

    var material = new THREE.PointsMaterial( { size: 500, vertexColors: THREE.VertexColors } );
    var cubeGeometry = new THREE.CubeGeometry( 2, 2, 2, 1, 1, 1 );
    particleSystem = new THREE.Points( geometry, material );
    particleSystem.position.set(X,Y,Z);
    group.add( particleSystem );
  }

  function createLine(vec,xRadius,yRadius,color,ocolor,lineWidth,spacePoints,opacity,name){
      var geometry = new THREE.Geometry();
      geometry.vertices=vec;
      var material = new THREE.LineBasicMaterial( { color : color ,linewidth: lineWidth,opacity:opacity} );

      var line = new THREE.Line( geometry, material );
      line.name=name || "linecollection";
      var initial = new THREE.Color(line.material.color.getHex());
      var value = new THREE.Color(ocolor);
      TweenMax.to(initial, 5, {     //This syntax is relevant to GSAP's TweenLite, I'll provide a link to the docs
            r: value.r,
            g: value.g,
            b: value.b,
            ease: Cubic.easeInOut,repeat:-1, yoyo:true,
            onUpdate: function() { line.material.color = initial; }
      });
      scene.add(line);
  }
  function init() {
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.5, 3000000 );
		camera.position.set( 0, 200, 2000 );
    if ( Detector.webgl )
    		renderer = new THREE.WebGLRenderer( {antialias:true} );
    else
    	  renderer = new THREE.CanvasRenderer();
    camera.lookAt(new THREE.Vector3());

    scene = new THREE.Scene();
    var helper = new THREE.GridHelper( 5000, 5000 );
    helper.color1.setHex( 0xffffff );
    helper.color2.setHex( 0xffffff );
    //scene.add( helper );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    //controls.maxPolarAngle = Math.PI / 2;
    controls.enableZoom = false;
    controls.enablePan = false;
    //controls.enableRotate = false;

		scene.add( new THREE.AmbientLight( 0x444444 ) );
    var light = new THREE.DirectionalLight( 0xffffbb, 1 );
		light.position.set( - 1, 1, - 1 );
		scene.add( light );




    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '1px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);
    window.addEventListener( 'resize', onWindowResize, false );

  }
  function generateSprite() {

    var canvas = document.createElement( 'canvas' );
    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
    gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
    gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
    gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    return canvas;

  }

  //document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  	function onDocumentMouseMove( event ) {

  		var vector = new THREE.Vector3( event.clientX - windowHalfX, - event.clientY + windowHalfY, 0 );
      var bbox = new THREE.Box3().setFromObject(groups[0]);

      if(vector.x<bbox.max.x && vector.y<bbox.max.y && vector.x>bbox.min.x && vector.y>bbox.min.y && onanime==0){
        onanime=1;
        for ( var i = 0, il = groups[0].children.length; i < il; i++ ) {
          var obj = groups[0].children[ i ];
          TweenMax.to(obj.position, 1, { y:obj.position.y + (Math.random() * ( vector.y>0  ?  -1 : 1  ))*100,
                  x:obj.position.x + (Math.random() * ( vector.x>0  ?  -1 : 1  ))*100,
                ease: Cubic.easeInOut, yoyo:true,repeat:1,
                onComplete: function() { onanime=0;}
               });
        }
      }

  	}

  function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  //

  function animate() {

    requestAnimationFrame( animate );

    stats.update();
    render();

  }
  TweenLite.ticker.addEventListener("tick", render);
  function render() {
    var time = Date.now() * curverspeed;

    camera.lookAt( scene.position );
    var currentTime = new Date().getTime();
				water.material.uniforms.time.value += 1.0 / 60.0;
				water.render();
    renderer.render( scene, camera );
  }

}
