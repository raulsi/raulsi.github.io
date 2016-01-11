/**
* Rahul Singh
* http://raulsi.in/experiments/
* http://raulsi.github.io/
*/
function loadthreeexp(){
  var group;
  var container, controls, stats;
  var particlesData = [];
  var camera, scene, renderer;
  var positions, colors;
  var particles;
  var pointCloud;
  var particlePositions;
  var linesMesh;
  var maxParticleCount = 2000;
  var particleCount = 1000;
  var r = 1300;
  var rHalf = r / 2;

  var effectController = {
  	showDots: true,
  	showLines: true,
  	minDistance: 170,
  	limitConnections: false,
  	maxConnections: 50,
  	particleCount: 1000
  };
  var mouseX = 0, mouseY = 0;
  var cWidth=0;
  var cHeight=0;
  var group;

  var onanime=0;
  var curverspeed=0.0003;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var rx = 3950;
  var rxHalf = rx / 2;
  var ry = 2000;
  var ryHalf = ry / 2;
  var rz = 1500;
  var rzHalf = rz / 2;
  init();
  animate();
  function createbox(X,Y,Z,j){
    var particles = 50;

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

      var vx = ( x / n ) + 0.5;
      var vy = ( y / n ) + 0.5;
      var vz = ( z / n ) + 0.5;

      color.setRGB( vx, vy, vz );

      colors[ i ]     = color.r;
      colors[ i + 1 ] = color.g;
      colors[ i + 2 ] = color.b;

    }
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

    geometry.computeBoundingSphere();

    //

    var material = new THREE.PointsMaterial( { size: 15, vertexColors: THREE.VertexColors } );
    var cubeGeometry = new THREE.CubeGeometry( 5, 5, 5, 2, 2, 2 );
    particleSystem = new THREE.Points( geometry, material );
    particleSystem.position.set(X,Y,Z);
    group.add( particleSystem );
  }
  function init() {
    if ( Detector.webgl )
    		renderer = new THREE.WebGLRenderer( {antialias:true,alpha: true} );
    else
    	  renderer = new THREE.CanvasRenderer({alpha: true});

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.z = 3000;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 )
    scene.add(camera);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight  );
    renderer.gammaInput = true;
		renderer.gammaOutput = true;
    document.body.appendChild( renderer.domElement );
    cWidth=window.innerWidth/2;
    cHeight=window.innerHeight/2;
    aspratio=cWidth/cHeight;
    colorarray=['#d3d3d3','#bdbdbd','#a8a8a8','#939393','#7e7e7e','#696969','#545454','#3f3f3f','#2a2a2a','#151515']
    crad=60;
    /*var geometry = new THREE.Geometry();

    geometry.vertices.push(
    	new THREE.Vector3( -10,  10, 0 ),
    	new THREE.Vector3( -10, -10, 0 ),
    	new THREE.Vector3(  10, -10, 0 )
    );

    var normal = new THREE.Vector3( 0, 1, 0 );
    var color = new THREE.Color( 0x00aa00 );
    geometry.faces.push(  new THREE.Face3( 0, 1, 2, normal, color, 0 ) );

    geometry.computeBoundingSphere();
    var material = new THREE.MeshBasicMaterial(  );
    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );*/

    group = new THREE.Group();
		scene.add( group );
		var helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry(rx, ry, rz ) ) );
		helper.material.color.setHex( 0x808080 );
		helper.material.blending = THREE.AdditiveBlending;
		helper.material.transparent = true;
		//group.add( helper );
    group.position.x=rx/7;
    var segments = maxParticleCount * maxParticleCount;

				positions = new Float32Array( segments * 3 );
				colors = new Float32Array( segments * 3 );

				var pMaterial = new THREE.PointsMaterial( {
					color: 0xFFFFFF,
					size: 3,
					blending: THREE.AdditiveBlending,
					transparent: true,
					sizeAttenuation: false
				} );

				particles = new THREE.BufferGeometry();
				particlePositions = new Float32Array( maxParticleCount * 3 );

				for ( var i = 0; i < maxParticleCount; i++ ) {

					var x = Math.random() * rx - rx / 2;
					var y = Math.random() * ry - ry / 2;
					var z = Math.random() * rz - rz / 2;

					particlePositions[ i * 3     ] = x;
					particlePositions[ i * 3 + 1 ] = y;
					particlePositions[ i * 3 + 2 ] = z;

					// add it to the geometry
					particlesData.push( {
						velocity: new THREE.Vector3( -1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2 ),
						numConnections: 0
					} );

				}

				particles.setDrawRange( 0, particleCount );
				particles.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) );

				// create the particle system
				pointCloud = new THREE.Points( particles, pMaterial );
				group.add( pointCloud );

				var geometry = new THREE.BufferGeometry();

				geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setDynamic( true ) );
				geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );

				geometry.computeBoundingSphere();

				geometry.setDrawRange( 0, 0 );

				var material = new THREE.LineBasicMaterial( {
					vertexColors: THREE.VertexColors,
					blending: THREE.AdditiveBlending,
					transparent: true
				} );

				linesMesh = new THREE.LineSegments( geometry, material );

				group.add( linesMesh );


    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '1px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);
    window.addEventListener( 'resize', onWindowResize, false );

  }
  //document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  	function onDocumentMouseMove( event ) {

  		var vector = new THREE.Vector3( event.clientX - windowHalfX, - event.clientY + windowHalfY, 0 );
      var bbox = new THREE.Box3().setFromObject(group);

      if(vector.x<bbox.max.x && vector.y<bbox.max.y && vector.x>bbox.min.x && vector.y>bbox.min.y && onanime==0){
        onanime=1;
        for ( var i = 0, il = group.children.length; i < il; i++ ) {
          var obj = group.children[ i ];
          TweenMax.to(obj.position, 1, { y:obj.position.y + (Math.random() * ( vector.y>0  ?  -1 : 1  ))*1000,
                  x:obj.position.x + (Math.random() * ( vector.x>0  ?  -1 : 1  ))*1000,
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

    var vertexpos = 0;
				var colorpos = 0;
				var numConnected = 0;

				for ( var i = 0; i < particleCount; i++ )
					particlesData[ i ].numConnections = 0;

				for ( var i = 0; i < particleCount; i++ ) {

					// get the particle
					var particleData = particlesData[i];

					particlePositions[ i * 3     ] += particleData.velocity.x;
					particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
					particlePositions[ i * 3 + 2 ] += particleData.velocity.z;

					if ( particlePositions[ i * 3 + 1 ] < -ryHalf || particlePositions[ i * 3 + 1 ] > ryHalf )
						particleData.velocity.y = -particleData.velocity.y;

					if ( particlePositions[ i * 3 ] < -rxHalf || particlePositions[ i * 3 ] > rxHalf )
						particleData.velocity.x = -particleData.velocity.x;

					if ( particlePositions[ i * 3 + 2 ] < -rzHalf || particlePositions[ i * 3 + 2 ] > rzHalf )
						particleData.velocity.z = -particleData.velocity.z;

					if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
						continue;

					// Check collision
					for ( var j = i + 1; j < particleCount; j++ ) {

						var particleDataB = particlesData[ j ];
						if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
							continue;

						var dx = particlePositions[ i * 3     ] - particlePositions[ j * 3     ];
						var dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
						var dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
						var dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

						if ( dist < effectController.minDistance ) {

							particleData.numConnections++;
							particleDataB.numConnections++;

							var alpha = 1.0 - dist / effectController.minDistance;

							positions[ vertexpos++ ] = particlePositions[ i * 3     ];
							positions[ vertexpos++ ] = particlePositions[ i * 3 + 1 ];
							positions[ vertexpos++ ] = particlePositions[ i * 3 + 2 ];

							positions[ vertexpos++ ] = particlePositions[ j * 3     ];
							positions[ vertexpos++ ] = particlePositions[ j * 3 + 1 ];
							positions[ vertexpos++ ] = particlePositions[ j * 3 + 2 ];

							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;

							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;

							numConnected++;
						}
					}
				}


				linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
				linesMesh.geometry.attributes.position.needsUpdate = true;
				linesMesh.geometry.attributes.color.needsUpdate = true;

				pointCloud.geometry.attributes.position.needsUpdate = true;

				requestAnimationFrame( animate );

				stats.update();
				render();


  }
  TweenLite.ticker.addEventListener("tick", render);
  function render() {

  	var time = Date.now() * 0.001;
  	//group.rotation.y = time * 0.1;
    renderer.render( scene, camera );
  }

}
