/**
* Rahul Singh
* http://raulsi.in/experiments/
* http://raulsi.github.io/
*/
function loadthreeexp(){

  var container, stats;
  var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size, particle;
  var mouseX = 0, mouseY = 0;
  var sky, sunSphere, ms_Ocean;
  var lastTime = (new Date()).getTime();
  var cWidth=0;
  var cHeight=0;
  var curverspeed=0.0003;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  init();
  animate();
  /* borrowed code from three js example */
  function initSky() {

    // Add Sky Mesh
    sky = new THREE.Sky();
    scene.add( sky.mesh );

    // Add Sun Helper
    sunSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry( 20000, 16, 8 ),
      new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    sunSphere.position.y = - 700000;
    sunSphere.visible = false;
    scene.add( sunSphere );

    /// GUI

    var effectController  = {
      turbidity: 10,
      reileigh: 1,
      mieCoefficient: 0.0054,
      mieDirectionalG: 0.1,
      luminance: 0.4,
      inclination: 0.5, // elevation / inclination
      azimuth: 0.1, // Facing front,
      sun: ! true
    };

    var distance = 400000;

    function guiChanged() {

      var uniforms = sky.uniforms;
      uniforms.turbidity.value = effectController.turbidity;
      uniforms.reileigh.value = effectController.reileigh;
      uniforms.luminance.value = effectController.luminance;
      uniforms.mieCoefficient.value = effectController.mieCoefficient;
      uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

      var theta = Math.PI * ( effectController.inclination - 0.5 );
      var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

      sunSphere.position.x = distance * Math.cos( phi );
      sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
      sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

      sunSphere.visible = effectController.sun;

      sky.uniforms.sunPosition.value.copy( sunSphere.position );

      renderer.render( scene, camera );

    }

    guiChanged();


	}

  /* borrowed code end */

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
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 100, 2000000 );
		camera.position.set( 0, 100, 2000 );
    if ( Detector.webgl )
    		renderer = new THREE.WebGLRenderer( {antialias:true} );
    else
    	  renderer = new THREE.CanvasRenderer();
    camera.lookAt(new THREE.Vector3());

    scene = new THREE.Scene();
    var helper = new THREE.GridHelper( 5000, 5000 );
    helper.color1.setHex( 0xffffff );
    helper.color2.setHex( 0xffffff );
    scene.add( helper );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    //controls.maxPolarAngle = Math.PI / 2;
    controls.enableZoom = false;
    controls.enablePan = false;
    initSky();


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
    renderer.render( scene, camera );
  }

}
