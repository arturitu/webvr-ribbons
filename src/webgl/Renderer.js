"use strict";

var THREE = require('three');


function Renderer() {


	var renderer = new THREE.WebGLRenderer( { antialias: true  } );

	renderer.setPixelRatio( window.devicePixelRatio );
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	//renderer.gammaInput = true;
	//renderer.gammaOutput = true;
	//renderer.physicallyBasedShading = true;
	//renderer.preserveDrawingBuffer=true;
	//renderer.premultipliedAlpha = true;
	//renderer.sortObjects=false;
	//renderer.autoClear=false;
	//renderer.alpha=false;
	renderer.setClearColor( 0x111116, 1 );

	document.querySelector( '#webglContent' ).appendChild( renderer.domElement );

	return renderer;
}

module.exports = new Renderer();