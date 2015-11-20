"use strict";

var THREE = require('three');


function LineGlow ( spline, color ) {

	THREE.Object3D.call(this);

	this.toogle = 0;
	
	var ARC_SEGMENTS = 2000;
	this.VISIBLE_POINTS = 50;

	this.relativePos = 0;
	//this.speed = 12.5;
	this.speed = Math.random()*2 + 1;

	this.spline = spline;

	var myColor = hexToRgb( color );
	this.rVal = myColor.r/255;
	this.gVal = myColor.g/255;
	this.bVal = myColor.b/255;

	var geometry = new THREE.Geometry();
	var position;
	var colors = [];
	for (var i = 0; i < this.VISIBLE_POINTS; i++) {
		geometry.vertices.push(new THREE.Vector3());
		colors[ i ] = new THREE.Color( 0xffffff );
	}
	geometry.colors = colors;
	//geometry.computeFaceNormals();
	//geometry.computeVertexNormals();
	this.path = [];
	for (var i = 0; i < ARC_SEGMENTS; i++) {
		this.path.push(this.spline.getPoint(i /  (ARC_SEGMENTS - 1)));
	}

	var material = new THREE.LineBasicMaterial({
		opacity: 0.5,
		linewidth: 10,
		vertexColors: THREE.VertexColors,
		transparent:true,
		blending: THREE.AdditiveBlending
	});

	material.needsUpdate = true;
	this.visible = false;

	this.line = new THREE.Line( geometry, material );
	this.add ( this.line );

	this.frustumCulled = false;	
};

LineGlow.prototype = Object.create( THREE.Object3D.prototype );

LineGlow.prototype.update=function(delta){
	//console.log ( delta );
	this.toogle += delta;
	if( this.delayStart > this.toogle ){
		return;
	}else{
		if(!this.started){
			this.visible = true;
			this.started = true;
			this.toogle = 0;
		}
	}
	var p, c, vp;
	vp = this.VISIBLE_POINTS/2;
	
	//this.relativePos += 10/this.speed;
	this.relativePos += (0.016*this.speed)/100;
	if( this.relativePos > 1){
		this.relativePos = 0;
	}
	//console.log ( this.relativePos );

	for (var i = 0; i < this.VISIBLE_POINTS; i++) {
		//var v = (i + Math.round(this.toogle*this.speed)) % this.path.length;
		var v = i + Math.round(this.path.length * this.relativePos);
		if(v >= this.path.length){
			return;
		}
		//this.relativePos += 10/this.looptime;
		if(v === 0 && i != 0){
			return;
		}
		p = this.line.geometry.vertices[i];
		p.copy ( this.path[v] );
		c = this.line.geometry.colors[i];
		var hiddenR = (this.rVal - Math.abs(i-vp)/vp);
		var hiddenG = (this.gVal - Math.abs(i-vp)/vp);
		var hiddenB = (this.bVal - Math.abs(i-vp)/vp);
		c.setRGB (hiddenR,hiddenG,hiddenB);
	}

	this.line.geometry.verticesNeedUpdate = true;
	this.line.frustumCulled = false;
}

function hexToRgb (hex) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;

}

module.exports = LineGlow;