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
  function createCurve(X,Y,xRadius,yRadius,aStartAngle,aEndAngle,aClockwise,color,ocolor,lineWidth,spacePoints,opacity,name){
      var curve = new THREE.EllipseCurve(
          0, 0,
          xRadius, yRadius,
          aStartAngle, aEndAngle,
          aClockwise
      );

      var points = curve.getSpacedPoints( spacePoints );

      var path = new THREE.Path();
      var geometry = path.createGeometry( points );

      var material = new THREE.LineBasicMaterial( { color : color ,linewidth: lineWidth,opacity:opacity} );

      var line = new THREE.Line( geometry, material );
      line.position.set( X, Y, 0 );
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

      scene.add(line);
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
    camera =  new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2,window.innerHeight / 2, window.innerHeight / - 2, 1, 2000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );
    scene.add(camera);
    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight  );
    document.body.appendChild( renderer.domElement );
    cWidth=window.innerWidth/2;
    cHeight=window.innerHeight/2;
    aspratio=cWidth/cHeight;
    colorarray=['#d3d3d3','#bdbdbd','#a8a8a8','#939393','#7e7e7e','#696969','#545454','#3f3f3f','#2a2a2a','#151515']
    crad=60;
    createCurve(-(cWidth-cWidth/6),0,crad-(crad/3),crad,Math.PI/3,-Math.PI/3,true,'#98fdf5','#5b9793',(crad/100)*5,100,0.9);
    createCurve(-(cWidth-cWidth/6),0,crad-(crad/3),crad,(2*Math.PI)/3,(4*Math.PI)/3,false,'#98fdf5','#5b9793',(crad/100)*5,100,0.9);
    var vec = [new THREE.Vector3( -(cWidth-cWidth/6)-(crad/3), 0, 0 ),new THREE.Vector3( -(cWidth-cWidth/6)+(crad/3), 0, 0 )];
    createLine(vec,crad-(crad/3),crad,'#98fdf5','#5b9793',(crad/100)*5,100,0.9);
    createCurve(-cWidth/2,0,crad-(crad/3),crad,(2*Math.PI)/3,(4*Math.PI)/3,false,'#777777','#474747',(crad/100)*5,100,0.9);
    var vec = [new THREE.Vector3( -cWidth/2-(crad/3), 0, 0 ),new THREE.Vector3( -cWidth/2+(crad/3), 0, 0 )];
    createLine(vec,crad-(crad/3),crad,'#777777','#474747',(crad/100)*5,100,0.9);
    var vec = [new THREE.Vector3( -cWidth/2-(crad/3), (crad/3)*2, 0 ),new THREE.Vector3( -cWidth/2+(crad/3), (crad/3)*2, 0 )];
    createLine(vec,crad-(crad/3),crad,'#777777','#474747',(crad/100)*5,100,0.9);
    var vec = [new THREE.Vector3( -cWidth/2-(crad/3), -(crad/3)*2, 0 ),new THREE.Vector3( -cWidth/2+(crad/3), -(crad/3)*2, 0 )];
    createLine(vec,crad-(crad/3),crad,'#777777','#474747',(crad/100)*5,100,0.9);
    createCurve(-cWidth/6,0,crad-(crad/3),crad,(2*Math.PI)/3,(4*Math.PI)/3,false,'#ff6a6a','#993f3f',(crad/100)*5,100,0.9);
    var vec = [new THREE.Vector3( -cWidth/6-(crad/3), -(crad/3)*2, 0 ),new THREE.Vector3( -cWidth/6+(crad/3), -(crad/3)*2, 0 )];
    createLine(vec,crad-(crad/3),crad,'#ff6a6a','#993f3f',(crad/100)*5,100,0.9);
    createCurve(cWidth/6,0,crad-(crad/3),crad,(2*Math.PI)/3,(4*Math.PI)/3,false,'#00c5cd','#00767b',(crad/100)*5,100,0.9);
    var vec = [new THREE.Vector3( (cWidth/6)-(crad/3), -(crad/3)*2, 0 ),new THREE.Vector3( (cWidth/6)+(crad/3), -(crad/3)*2, 0 )];
    createLine(vec,crad-(crad/3),crad,'#00c5cd','#00767b',(crad/100)*5,100,0.9);
    createCurve(cWidth/2,0,crad-(crad/4),crad-(crad/4),0,145,false,'#8400ff','#4f0099',(crad/100)*5,100,0.9);
    createCurve(cWidth-(cWidth/4),0,crad-(crad/3),crad,Math.PI/3,(5*Math.PI)/3,true,'#f6b8ad','#936e67',(crad/100)*5,100,0.9);
    var vec = [new THREE.Vector3( cWidth-(cWidth/4)-(crad/10), (crad/3)*2, 0 ),new THREE.Vector3( cWidth-(cWidth/4)+(crad/10), (crad/3)*2, 0 )];
    createLine(vec,crad-(crad/3),crad,'#f6b8ad','#936e67',(crad/100)*5,100,0.9);
    var vec = [new THREE.Vector3( cWidth-(cWidth/4)-(crad/10), -(crad/3)*2, 0 ),new THREE.Vector3( cWidth-(cWidth/4)+(crad/10), -(crad/3)*2, 0 )];
    createLine(vec,crad-(crad/3),crad,'#f6b8ad','#936e67',(crad/100)*5,100,0.9);

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
      }

    }
    renderer.render( scene, camera );
  }

}
