/**
* Rahul Singh
* http://raulsi.in/experiments/
* http://raulsi.github.io/
*/
function loadthreeexp(){

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

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);
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

    stats.update();
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
