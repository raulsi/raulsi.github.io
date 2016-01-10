/**
* Rahul Singh
* http://raulsi.in/experiments/
* http://raulsi.github.io/
*/
function loadthreeexp(){

  var container, stats;
  var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size, particle;
  var mouseX = 0, mouseY = 0;
  var cWidth=0;
  var cHeight=0;
  var group;
  var onanime=0;
  var curverspeed=0.0003;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

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
    camera =  new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2,window.innerHeight / 2, window.innerHeight / - 2, 1, 200000 );
    camera.position.z = 150000;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 )
    scene.add(camera);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight  );
    document.body.appendChild( renderer.domElement );
    cWidth=window.innerWidth/2;
    cHeight=window.innerHeight/2;
    aspratio=cWidth/cHeight;
    colorarray=['#d3d3d3','#bdbdbd','#a8a8a8','#939393','#7e7e7e','#696969','#545454','#3f3f3f','#2a2a2a','#151515']
    crad=60;

    group= new THREE.Object3D();
    var m = new THREE.Matrix4();
    m.set(-0.5,0.5,0,0.5,0.5,0,-0.5,-0.5,0,0,0.5,-0.5,0);
    group.applyMatrix(m);
    group.updateMatrix();
    n=100;n2=n/2;
    for(i=0;i<5000;i++){
            var x = Math.random() * n - n2;
            var y = Math.random() * n - n2;
            var z = Math.random() * n - n2;
            createbox(x,y,z,i);
    }

    scene.add(group);
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '1px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);
    window.addEventListener( 'resize', onWindowResize, false );

  }
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

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

    requestAnimationFrame( animate );

    stats.update();
    render();

  }
  TweenLite.ticker.addEventListener("tick", render);
  function render() {
    var time = Date.now() * curverspeed;
    camera.lookAt( scene.position );

    for ( i = 0; i < scene.children.length; i ++ ) {

      var object = scene.children[ i ];
      object.rotation.z=0;
      if ( object instanceof THREE.Object3D ) {
        for (var j  = 0; j  < object.children.length; j++) {
          var obj = object.children[j];
          if(obj instanceof THREE.Points)
          {

          }
        }
      }else if(object instanceof THREE.Points)
      {
        object.scale.x=object.scale.x + (Math.random() * ( i % (Math.random()*10) ==0  ?  1 : - 1  ))/10;
      }

    }
    renderer.render( scene, camera );
  }

}
