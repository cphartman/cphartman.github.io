Head = function() {
	this.teeth = [];
	this.age = 1;
	this.spehere_resolution = 10;
	this.lip_resolution = 5;

	this.back_material = new THREE.MeshLambertMaterial({color: 0xFF0000, wireframe: false, emissive : 0x800000});
	this.back_outline_material = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: false, side: THREE.BackSide});
	this.back_inside_material = new THREE.MeshBasicMaterial({color: 0x500000, wireframe: false, side: THREE.BackSide});

	this.lip_material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: false});
	this.lip_outline_material = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: false, side: THREE.BackSide});

	this.tooth_material = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: false, side: THREE.DoubleSide} );
	this.tooth_outline_material = new THREE.MeshBasicMaterial( {color: 0x000000, wireframe: false, side: THREE.BackSide} );

	this.root = new THREE.Object3D();

	this.RandomizeGeneration();
	this.Reset();

	this.outline_stroke = .03;
}

Head.prototype.RandomizeGeneration = function() {
	this.radius = Math.random()*.5+.5;
	this.lipSize = Math.random()*.1+.03;
	this.mouthTheta_target =  Math.random()*Math.PI/3+Math.random()*Math.PI/6;
	this.mouthTheta = this.mouthTheta_target;
	this.mouthTheta_previous = this.mouthTheta_target;
	this.teethCount = Math.floor(Math.random()*5)+1;
	this.teethLength = Math.random()*.5+.5;
	this.teethWidth = Math.random()*.12 + .05;
}

Head.prototype.RegenerateHead = function() {

	// Destroy any old meshes
	this.offsetNode.remove(this.back_mesh);
	this.offsetNode.remove(this.back_inside_mesh);
	this.offsetNode.remove(this.back_outline_mesh);
	if( this.back_mesh ) {
		this.back_geometry.dispose();
	}
	
	//	this.back_material = new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: false});
	
	this.back_geometry = new THREE.SphereGeometry( this.radius, this.spehere_resolution, this.spehere_resolution,
		(-.5*Math.PI)+this.mouthTheta/2,
		(2*Math.PI)-this.mouthTheta);
	this.back_mesh = new THREE.Mesh( this.back_geometry, this.back_material  );
	this.back_mesh.rotation.set(0,0,Math.PI/2);
	this.offsetNode.add( this.back_mesh );
	this.back_mesh.name = "head";

	this.back_outline_geometry = new THREE.SphereGeometry( this.radius+this.outline_stroke, this.spehere_resolution, this.spehere_resolution,
		(-.5*Math.PI)+this.mouthTheta/2,
		(2*Math.PI)-this.mouthTheta);
	this.back_outline_mesh = new THREE.Mesh( this.back_outline_geometry, this.back_outline_material  );
	this.back_outline_mesh.rotation.set(0,0,Math.PI/2);
	this.offsetNode.add( this.back_outline_mesh );
	this.back_outline_mesh.name = "head outline";
	
	this.back_inside_mesh = new THREE.Mesh( this.back_geometry, this.back_inside_material  );
	this.back_inside_mesh.rotation.set(0,0,Math.PI/2);
	this.back_inside_mesh.name = "inside head";
	this.offsetNode.add( this.back_inside_mesh );

	this.mouthTheta_previous = this.mouthTheta;
}

Head.prototype.Reset = function() {
	

	this.root.remove( this.offsetNode );

	this.offsetNode = new THREE.Object3D();
	this.root.add( this.offsetNode );
	this.offsetNode.name = "head root";

	// Create new Segments

	this.RegenerateHead();

	this.lip_top_material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: false, side: THREE.DoubleSide});
	this.lip_top_geometry = new THREE.TorusGeometry(this.radius, this.lipSize, this.lip_resolution, this.spehere_resolution, Math.PI);
	this.lip_top_mesh = new THREE.Mesh( this.lip_top_geometry, this.lip_material  );
	this.lip_top_mesh.name = "top lip";
	this.offsetNode.add( this.lip_top_mesh );

	this.lip_top_outline_geometry = new THREE.TorusGeometry(this.radius+this.outline_stroke, this.lipSize, this.lip_resolution, this.spehere_resolution, Math.PI);
	this.lip_top_outline_mesh = new THREE.Mesh( this.lip_top_outline_geometry, this.lip_outline_material  );
	this.lip_top_outline_mesh.name = "top lip outline";
	this.offsetNode.add( this.lip_top_outline_mesh );

	this.lip_bot_geometry = new THREE.TorusGeometry(this.radius, this.lipSize, this.lip_resolution, this.spehere_resolution, Math.PI);
	this.lip_bot_mesh = new THREE.Mesh( this.lip_bot_geometry, this.lip_material  );
	this.lip_bot_mesh.name = "bottom lip";
	this.offsetNode.add( this.lip_bot_mesh );

	this.lip_bot_outline_geometry = new THREE.TorusGeometry(this.radius+this.outline_stroke, this.lipSize, this.lip_resolution, this.spehere_resolution, Math.PI);
	this.lip_bot_outline_mesh = new THREE.Mesh( this.lip_bot_outline_geometry, this.lip_outline_material  );
	this.lip_bot_outline_mesh.name = "bottom lip outline";
	this.offsetNode.add( this.lip_bot_outline_mesh );

	// 1 tooth doesnt look right
	if( this.teethCount == 1 ) {
		this.teethCount = 0;
	}

	this.teeth = [];
	// Upper teeth
	var upper_teeth_delta = Math.PI/(this.teethCount+3);
	for( var i = 0; i < this.teethCount; i++ ) {
		var theta = upper_teeth_delta*(i+2);

		var tooth_geometry = this.NewToothGeometry(true);

		var tooth_mesh = new THREE.Mesh( tooth_geometry[0], this.tooth_material );
		tooth_mesh.position.set(this.radius*Math.cos(theta),this.radius*Math.sin(theta),0);
		tooth_mesh.rotation.set(0,0,0)
		this.lip_top_mesh.add(tooth_mesh);
		this.teeth.push(tooth_mesh);

		var tooth_outline_mesh = new THREE.Mesh( tooth_geometry[1], this.tooth_outline_material );
		tooth_outline_mesh.position.set(tooth_mesh.position.x, tooth_mesh.position.y, tooth_mesh.position.z);
		this.lip_top_mesh.add(tooth_outline_mesh);
		this.teeth.push(tooth_outline_mesh);
	}

	// Lower teeth
	var lower_teeth_delta = Math.PI/(this.teethCount+2);
	for( var i = 0; i < this.teethCount-1; i++ ) {
		var theta = lower_teeth_delta*(i+2);
		var tooth_geometry = this.NewToothGeometry(false);

		var tooth_mesh = new THREE.Mesh( tooth_geometry[0], this.tooth_material );
		tooth_mesh.position.set(this.radius*Math.cos(theta),this.radius*Math.sin(theta),0);
		this.lip_bot_mesh.add(tooth_mesh);
		this.teeth.push(tooth_mesh);

		var tooth_outline_mesh = new THREE.Mesh( tooth_geometry[1], this.tooth_outline_material );
		tooth_outline_mesh.position.set(tooth_mesh.position.x, tooth_mesh.position.y, tooth_mesh.position.z);
		this.lip_bot_mesh.add(tooth_outline_mesh);
		this.teeth.push(tooth_outline_mesh);
		
	}
	/*
	// Scale teeth
	var tooth_length = this.teethLength*this.radius/3;
	var tooth_depth = .1;
	var tooth_width = this.teethWidth;
	for( var i = 0; i < this.teeth.length; i++ ) {
		this.teeth[i].scale.set(tooth_width,tooth_depth,tooth_length);
	}*/

	this.Update();
}

Head.prototype.NewToothGeometry = function (down){
	
	var tooth_geometry = new THREE.TetrahedronGeometry(1, 0);
	var tooth_direction = (down ? -1 : 1);

	var tooth_length = this.teethLength*this.radius/3;
	var tooth_depth = -1*tooth_length;

	tooth_geometry.vertices[0].set(this.teethWidth, 	-.1, 0);
	tooth_geometry.vertices[1].set(0, 					0,0);
	tooth_geometry.vertices[2].set(-1*this.teethWidth, 	-.1, 0);
	tooth_geometry.vertices[3].set(0, 					tooth_depth, 	tooth_direction*tooth_length );
	tooth_geometry.verticesNeedUpdate = 1;

	
	var outline_stroke = .05;
	var tooth_outline_geometry = new THREE.TetrahedronGeometry(1, 0);
	tooth_outline_geometry.vertices[0].set((this.teethWidth+outline_stroke)*tooth_direction, 	-.1-outline_stroke, 0);
	tooth_outline_geometry.vertices[1].set(0, 					0,0);
	tooth_outline_geometry.vertices[2].set(-1*(this.teethWidth+outline_stroke)*tooth_direction, 	-.1-outline_stroke, 0);
	tooth_outline_geometry.vertices[3].set(0, 					tooth_depth-outline_stroke, 	tooth_direction*(tooth_length+outline_stroke) );
	tooth_outline_geometry.verticesNeedUpdate = 1;
	return [tooth_geometry,tooth_outline_geometry];

}

Head.prototype.Update = function() {
	//var scale = ( this.age < .5 ? this.age*2 : 1);
	scale = this.age;

	if( scale <= 0 ) {
		scale = .0001;
	}

	this.offsetNode.position.y = this.age*this.radius-.05;
	this.offsetNode.scale.set(scale,scale,scale);
	
	//this.mouthTheta = ( this.age < .5 ? Math.PI : (this.mouthTheta_target-Math.PI)*(this.age-.5)*2 + Math.PI);
	this.mouthTheta = (this.mouthTheta_target-Math.PI)*(this.age) + Math.PI;

	//var rotateTheta = ( this.age < .5 ? Math.PI/2 : Math.PI/2 - Math.PI/2*(this.age-.5)*2 );
	var rotateTheta =  Math.PI/2 - Math.PI/2*this.age;
	this.offsetNode.rotation.set(rotateTheta,0,0);
	

	if( this.mouthTheta != this.mouthTheta_previous ) {
		this.RegenerateHead();
	}

	// Rotate lips
	
	this.lip_bot_mesh.rotation.set((-.5*Math.PI)-this.mouthTheta/2,0,0);
	this.lip_bot_outline_mesh.rotation.set((-.5*Math.PI)-this.mouthTheta/2,0,0);

	this.lip_top_mesh.rotation.set((-.5*Math.PI)+this.mouthTheta/2,0,0);
	this.lip_top_outline_mesh.rotation.set((-.5*Math.PI)+this.mouthTheta/2,0,0);
}