"use strict";

var THREE = require('three');

var renderer = require('./Renderer'),
VRControls = require('./controls/VRControls'),
polyfill = require('./webvr-polyfill/main'),
manager = require('./webvr-manager/main'),
VREffect = require('./effects/VREffect'),
clock = new THREE.Clock(),
controls, effect, camera, scene, light, cube;
var ribbons = require('./assets/Ribbons');


function Webgl() {
	this.init();
}

Webgl.prototype.init = function() {
	
	
	camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000000 );

	controls = new THREE.VRControls( camera );

	effect = new THREE.VREffect(renderer);
	effect.setSize(window.innerWidth, window.innerHeight);

	// Create a VR manager helper to enter and exit VR mode.
	manager = new WebVRManager(renderer, effect, {hideButton: false});

	light = new THREE.HemisphereLight( 0x000000, 0xffffff,1 );

	var geometry = new THREE.IcosahedronGeometry( 10 );
	var material = new THREE.MeshPhongMaterial({
					color: 0x156289,
					emissive: 0x072534,
					shading: THREE.FlatShading
				});

	cube = new THREE.Mesh( geometry, material );
	cube.position.set(0,0,-20);

	scene = new THREE.Scene();
	scene.add( light );
	//scene.add( cube );
	//ribbons.position.set( -5, -15, -30 );
	scene.add( ribbons );
	window.addEventListener( 'resize', this.onWindowResize, false );

	this.onWindowResize();

	animate();
};

Webgl.prototype.onWindowResize = function( event ) {
	var newWidth = window.innerWidth;
	var newHeight = window.innerHeight;

	camera.aspect = newWidth / newHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( newWidth, newHeight );
	
}

function animate() {
	requestAnimationFrame( animate );
	render();

}

function render() {
	var delta = clock.getDelta();
	
	ribbons.update( delta );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	controls.update();
	manager.render(scene, camera, delta);

}

module.exports = Webgl;