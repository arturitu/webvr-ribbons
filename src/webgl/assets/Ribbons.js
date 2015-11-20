"use strict";

var THREE = require('three');
var LineGlow = require('./LineGlow');

function Ribbons (  ) {

	this.linesAdded = [];

	THREE.Object3D.call(this);

	var KnotCurve = THREE.Curve.create(

		function() {

		},

		function( t ) {

			t *= 2 * Math.PI;

			var R = 2;
			var s = 20;
			var tx = s * Math.sin( t ),
				ty = Math.cos( t ) * ( R + s * Math.cos( t ) ),
				tz = Math.sin( t ) * ( R + s * Math.cos( t ) );

			return new THREE.Vector3( tx, ty, tz );

		}

	);

	var totalPoints = 16;
	var myCurve = new KnotCurve();

	var splineArr = [];
	for ( var i=1; i<=totalPoints; i++){
		splineArr.push ( myCurve.getPoint( totalPoints/i ) );
	}

	this.spline = new THREE.CatmullRomCurve3( splineArr );
	this.setLinesGlow ( this.spline , 50);
};


Ribbons.prototype = Object.create(THREE.Object3D.prototype);


Ribbons.prototype.setLinesGlow = function (spline, totalLines){
	var colorsGlow = ['ffcc00',
			'8844ff',
			'ff8844',
			'ff4488',
			'440088',
			'884400',
			'ff4488',
			'004488',
			'008844',
			'ff88cc',
	];

	this.linesAdded = [];
	for ( var i = 0; i < totalLines; i++){
		var arrayPostions = new Array();
		for ( var j = 0; j < spline.points.length; j++){
			arrayPostions.push ( this.getRandomPos( spline.points[j] ) );
			//console.log ( spline.points[j] );
			//arrayPostions.push ( spline.points[ j ] );
		}
		var randomSpline = new THREE.CatmullRomCurve3(
			arrayPostions);
		randomSpline.type = 'catmullrom';
		randomSpline.tension = 0.25 + Math.random()*1;
		//randomSpline.tension = 0.25;
		
		var line = new LineGlow( randomSpline, colorsGlow[ randomInt(0,colorsGlow.length-1) ], true );
		this.linesAdded.push (line);

		this.add ( line );

	}
}

Ribbons.prototype.getRandomPos = function ( vec ) {
	var modifiedVector = new THREE.Vector3( );
	var modifierRangeX = (Math.random() - 0.5)*20;
	var modifierRangeY = (Math.random() - 0.5)*50;
	var modifierRangeZ = (Math.random() - 0.5)*30;
	modifiedVector.x = vec.x + modifierRangeX;
	modifiedVector.y = vec.y + modifierRangeY;
	modifiedVector.z = vec.z + modifierRangeZ;
	return modifiedVector;

}

Ribbons.prototype.update=function(delta){
	//console.log ( delta );
	for ( var i = 0; i < this.linesAdded.length; i++){
		this.linesAdded[i].update ( delta );
	}

	//this.rotation.y += delta/10;
}

function randomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = new Ribbons();
