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
  init();
  animate();

  function init() {
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.5, 3000000 );
		camera.position.set( 0, 200, 2000 );
    if ( Detector.webgl )
    		renderer = new THREE.WebGLRenderer( {antialias:true} );
    else
    	  renderer = new THREE.CanvasRenderer();
    camera.lookAt(new THREE.Vector3());

    scene = new THREE.Scene();




    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '1px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);
    window.addEventListener( 'resize', onWindowResize, false );

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
    var time = Date.now()

    camera.lookAt( scene.position );
    var currentTime = new Date().getTime();
    renderer.render( scene, camera );
  }

}
