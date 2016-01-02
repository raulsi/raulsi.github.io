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
  var curverspeed=0.0003;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  init();
  animate();

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
    camera =  new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2,window.innerHeight / 2, window.innerHeight / - 2, 1, 20000 );
    camera.position.z = 15000;
    if ( Detector.webgl )
    		renderer = new THREE.WebGLRenderer( {antialias:true} );
    else
    	  renderer = new THREE.CanvasRenderer();
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );
    scene.add(camera);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight  );
    document.body.appendChild( renderer.domElement );
    cWidth=window.innerWidth/2;
    cHeight=window.innerHeight/2;
    aspratio=cWidth/cHeight;
    colorarray=['#d3d3d3','#bdbdbd','#a8a8a8','#939393','#7e7e7e','#696969','#545454','#3f3f3f','#2a2a2a','#151515']
    crad=60;
    var floorMaterial = new THREE.MeshBasicMaterial( {color:0xffffff } );
  	var floorGeometry = new THREE.PlaneGeometry(2000, 1000, 32);
  	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y=-300;
    floor.rotation.x = Math.PI/4;
    floor.rotation.z = 0.2;
  	scene.add(floor);

    var material = new THREE.SpriteMaterial( {
      map: new THREE.CanvasTexture( generateSprite() ),
      blending: THREE.AdditiveBlending
    } );

    var arx=[-windowHalfX,windowHalfX];
    var ary=[-windowHalfY,windowHalfY];
    for ( var i = 0; i < 2000; i++ ) {

      particle = new THREE.Sprite( material );
      particle.position.set(0,0,0);
      particle.position.x = Math.random() *arx[parseInt((Math.random()*10) % 2)] ;
      particle.position.y = Math.random() * ary[parseInt((Math.random()*10) % 2)]  ;
      particle.scale.x = particle.scale.y = Math.random() * 10;
      scene.add( particle );
    }




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

    for ( i = 0; i < scene.children.length; i ++ ) {

      var object = scene.children[ i ];
      object.rotation.z=0;
      if ( object instanceof THREE.Line ) {
        if(object.name=="curvecollection")
        {
             object.rotation.z = time * ( i % 2 ==0  ?  1 : - 1  );
        }

      }else if(object instanceof THREE.Sprite)
      {

        if(object.position.x>windowHalfX){
          object.position.x=-windowHalfX;
        }
        if(object.position.x<-windowHalfX){
          object.position.x=windowHalfX;
        }
        if(object.position.y>windowHalfY){
          object.position.y=-windowHalfY;
        }
        if(object.position.y<-windowHalfY){
          object.position.y=windowHalfY;
        }
        object.position.x=object.position.x + (Math.random() * ( i % (Math.random()*10) ==0  ?  1 : - 1  ))/10;
        object.position.y=object.position.y + (Math.random() * ( i % (Math.random()*10) ==0  ?  1 : - 1  ))/10;
      }else if(object instanceof THREE.Mesh){
        //object.rotation.x = object.rotation.x + 0.1;
      }

    }
    renderer.render( scene, camera );
  }

}
