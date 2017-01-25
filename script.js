var mouse = new THREE.Vector2();
var container;
var camera, scene, renderer;
var mesh1;

	var triangles = 1000;
	var geometry = new THREE.BufferGeometry();
	var positions = new Float32Array( triangles * 3 * 3 );
	var normals = new Float32Array( triangles * 3 * 3 );
	var colors = new Float32Array( triangles * 3 * 3 );
	var color = new THREE.Color();
	var n = 1, n2 = n/2;	// triangles spread in the cube
	var d = 12, d2 = d/2;	// individual triangle size
	var pA = new THREE.Vector3();
	var pB = new THREE.Vector3();
	var pC = new THREE.Vector3();
	var cb = new THREE.Vector3();
	var ab = new THREE.Vector3();
	var x,y,z,ax,ay,az,bx,by,bz,cx,cy,cz;

init();
animate();

function init() {
	container = document.getElementById( 'container' );
	//
	camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.9, 1500 );
	camera.position.z = 1;
	scene = new THREE.Scene();

	scene.add( new THREE.AmbientLight( 0xffffff ) );

	var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light1.position.set( 100, 1, -1 );
	scene.add( light1 );

	createPolygons()

	function disposeArray() { this.array = null; }
	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).onUpload( disposeArray ) );
	geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ).onUpload( disposeArray ) );
	geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).onUpload( disposeArray ) );
	geometry.computeBoundingSphere();
	var material1 = new THREE.MeshPhongMaterial( {
		color: 0xaaaaaa, specular: 0xffffff, shininess: 100,
		side: THREE.DoubleSide, vertexColors: THREE.FaceColors
	} );
	
	material1.transparent = true;
	material1.opacity = 0.75;
	material1.depthWrite = true;

	mesh1 = new THREE.Mesh( geometry, material1 );
	scene.add( mesh1 );
	//
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	container.appendChild( renderer.domElement );
	//
	vrSetup()
	//
	window.addEventListener( 'resize', onWindowResize, false );
	// window.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'deviceorientation', setOrientationControls, true);

  resetPolygonsPositions()
}

function setOrientationControls(e) {
  if (!e.alpha) {
    return;
  }
  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  controls.update();
  element.addEventListener('click', fullscreen, false);
  window.removeEventListener('deviceorientation', setOrientationControls, true);
}
window.addEventListener('deviceorientation', setOrientationControls, true);8

function vrSetup () {
	effect = new THREE.StereoEffect(renderer);
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(
		camera.position.x + 0.15,
		camera.position.y,
		camera.position.z
	);
	controls.noPan = true;
	controls.noZoom = true;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	var time = Date.now() * 0.001;
	// resetPolygonsPositions()
	mesh1.rotation.x = (time * 0.0075) + (camera.position.y * Math.PI);
	mesh1.rotation.y = -((time * 0.0045) - (camera.position.x * Math.PI));
	renderer.render( scene, camera );
}

function createPolygons () {
	for ( var i = 0; i < positions.length; i += 9 ) {
		setPositions()
		placePolygons(i)
		normalPolygons(i)
		colorPolygons(i)
	}
}

function resetPolygonsPositions () {
	for ( var i = 0; i < positions.length; i += 9 ) {
		setPositions()
		placePolygons(i)
	}
}

function setPositions () {
	x = Math.random() * n - n2;
	y = Math.random() * n - n2;
	z = Math.random() * n - n2;
	ax = x + Math.random() * d - d2;
	ay = y + Math.random() * d - d2;
	az = z + Math.random() * d - d2;
	bx = x + Math.random() * d - d2;
	by = y + Math.random() * d - d2;
	bz = z + Math.random() * d - d2;
	cx = x + Math.random() * d - d2;
	cy = y + Math.random() * d - d2;
	cz = z + Math.random() * d - d2;
}

function placePolygons (i) {
	// positions
	positions[ i ]     = ax;
	positions[ i + 1 ] = ay;
	positions[ i + 2 ] = az;
	positions[ i + 3 ] = bx;
	positions[ i + 4 ] = by;
	positions[ i + 5 ] = bz;
	positions[ i + 6 ] = cx;
	positions[ i + 7 ] = cy;
	positions[ i + 8 ] = cz;
}

function normalPolygons (i) {
	// flat face normals
	pA.set( ax, ay, az );
	pB.set( bx, by, bz );
	pC.set( cx, cy, cz );
	cb.subVectors( pC, pB );
	ab.subVectors( pA, pB );
	cb.cross( ab );
	cb.normalize();
	var nx = cb.x;
	var ny = cb.y;
	var nz = cb.z;
	normals[ i ]     = nx;
	normals[ i + 1 ] = ny;
	normals[ i + 2 ] = nz;
	normals[ i + 3 ] = nx;
	normals[ i + 4 ] = ny;
	normals[ i + 5 ] = nz;
	normals[ i + 6 ] = nx;
	normals[ i + 7 ] = ny;
	normals[ i + 8 ] = nz;	
}

function colorPolygons (i) {
	// colors
	var vx = ( x / n ) + 0.5;
	var vy = ( y / n ) + 0.5;
	var vz = ( z / n ) + 0.5;
	color.setRGB( vx, vy, vz );
	colors[ i ]     = color.r;
	colors[ i + 1 ] = color.g;
	colors[ i + 2 ] = color.b;
	colors[ i + 3 ] = color.r;
	colors[ i + 4 ] = color.g;
	colors[ i + 5 ] = color.b;
	colors[ i + 6 ] = color.r;
	colors[ i + 7 ] = color.g;
	colors[ i + 8 ] = color.b;
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}