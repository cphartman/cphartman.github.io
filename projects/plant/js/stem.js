StemSegment = function() {
	this.SEGMENTS = 20;
	this.w1 = 1;
	this.w2 = 1;
	this.h = 1;
	this.ox = 0;
	this.oz = 0;

	this.material = new THREE.MeshLambertMaterial({color: 0x00FF00, wireframe: false, emissive : 0x008000});
	//this.material = new THREE.MeshLambertMaterial({color: 0xffa044, wireframe: false, emissive : 0x008000});
	this.geometry = new  THREE.PlaneGeometry(1,1,this.SEGMENTS,2);
	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.mesh.name = "StemSegment";
	this.mesh.frustumCulled = false;

	this.root = new THREE.Object3D();
	this.root.add( this.mesh );

	this.material_outline = new THREE.MeshBasicMaterial({color: 0x00000, wireframe: false, side: THREE.BackSide});
	this.geometry_outline = new  THREE.PlaneGeometry(1,1,this.SEGMENTS,2);
	this.mesh_outline = new THREE.Mesh( this.geometry_outline, this.material_outline );
	this.mesh_outline.name = "StemSegment Outline";
	this.mesh_outline.frustumCulled = false;

	this.root.add( this.mesh_outline );

	this.outline_stroke = .03;
	
	this.render_mode = false;

	this.Update();
}

StemSegment.prototype.Update = function() {

	for( var i = 0; i < this.mesh.geometry.vertices.length; i++ ) {

		var ri = (i%(this.SEGMENTS+1)) * Math.PI*2/this.SEGMENTS;

		var is_top = (i >= this.SEGMENTS+1);
		var width = (is_top ? this.w2 : this.w1)

		var z_pos = Math.sin(ri)*width + (is_top ? this.oz : 0);
		var x_pos = Math.cos(ri)*width + (is_top ? this.ox : 0);
		var y_pos = (is_top ? this.h : 0);

		this.mesh.geometry.vertices[i].x = x_pos;
		this.mesh.geometry.vertices[i].y = y_pos;
		this.mesh.geometry.vertices[i].z = z_pos;

		if( this.render_mode == "outline" ) {
			this.mesh_outline.geometry.vertices[i].x = x_pos + Math.cos(ri)*this.outline_stroke;
			this.mesh_outline.geometry.vertices[i].y = y_pos;
			this.mesh_outline.geometry.vertices[i].z = z_pos + Math.sin(ri)*this.outline_stroke;
			this.mesh_outline.visible = true;
		} else {
			this.mesh_outline.visible = false;
		}
		
	}

	this.mesh.geometry.verticesNeedUpdate = 1;
	this.mesh_outline.geometry.verticesNeedUpdate = 1;

	this.mesh.geometry.computeFaceNormals();
	this.mesh.geometry.computeVertexNormals();
	this.mesh.geometry.normalsNeedUpdate = 1;
}


Stem = function() {
	this.segments = [];
	this.leafs = [];

	this.render_mode = "outline";

	this.root = new THREE.Object3D();
	this.RandomizeGeneration();
	this.Reset();
}

Stem.prototype.RandomizeGeneration = function() {
	this.width = 1;
	this.height = 8;
	this.sections = 20;
	this.initialVelocityX = -.2;
	this.initialVelocityZ = .1;

	this.width = Math.random()*.7+.3;
	this.height = Math.random()*3+4;
	this.sections = 20;
	this.initialVelocityX = Math.random()*.4-.2;
	this.initialVelocityZ = Math.random()*.4-.2;
	this.gravity = Math.random()*.1;

	this.leaf_count = Math.floor(Math.random()*8+4);
	this.leaf_age_time = Math.random()*.5+.1;
	
	this.RandomizeLeafSpawns();
};

Stem.prototype.RandomizeLeafSpawns = function() {
	this.leaf_spawns = [];
	this.leaf_thetas = [];
	this.leaf_roll = [];
	for( var i = 0; i < this.leaf_count; i++ ) {
		this.leaf_spawns[i] = Math.random()*.8+.1;
		this.leaf_thetas[i] = Math.random()*Math.PI*2;
		this.leaf_roll[i] = -1*Math.random()*Math.PI/8;
	}
};

Stem.prototype.Reset = function() {

	// Remove old meshes from scene
	for( var i = 0; i < this.segments.length; i++ ) {
		
		this.root.remove(this.segments[i].root);
		this.segments[i].geometry.dispose();
	}
	for( var i = 0; i < this.leafs.length; i++ ) {
		
		this.root.remove(this.leafs[i].root);
		this.leafs[i].geometry.dispose();
	}

	// Create new Segments
	this.segments = [];
	for( var i = 0; i < this.sections; i++ ) {
		var stem_segment = new StemSegment();
		this.root.add( stem_segment.root );
		this.segments.push( stem_segment );
	}

	// Create new leaves
	this.leafs = [];
	for( var i = 0; i < this.leaf_count; i++ ) {
		var leaf  = new Leaf();
		this.root.add( leaf.root );
		this.leafs.push( leaf );
	}

	// Make all leaves use the same seed
	for( var i = 1; i < this.leaf_count; i++ ) {
		this.leafs[i].f1 = this.leafs[0].f1;
		this.leafs[i].f2 = this.leafs[0].f2;
		this.leafs[i].g1 = this.leafs[0].g1;
		this.leafs[i].g2 = this.leafs[0].g2;
	}
}

Stem.prototype.GetTip = function() {
	var lastSegmentMesh = this.segments[this.segments.length-1].mesh;
	var lastMeshVert = lastSegmentMesh.geometry.vertices[lastSegmentMesh.geometry.vertices.length-1];
	var vec = new THREE.Vector3();
	vec.add(lastSegmentMesh.position);
	vec.add(lastMeshVert);
	
	//vec.y += lastSegmentMesh.geometry.vertices[lastSegmentMesh.geometry.vertices.length-1].y;
	vec.x -= this.width*this.age/4;
	vec.y -= .02;
	return vec;
}

Stem.prototype.Update = function() {

	var widthDelta = this.width/this.segments.length*this.age*.75;
	var heightDelta = (this.height/this.segments.length)*this.age;
	var widthScale = this.width*this.age/4;

	var velocityX = this.initialVelocityX*this.age;
	var velocityZ = this.initialVelocityZ*this.age;
	var offsetX = 0;
	var offsetZ = 0;
	var gravityX = 0;
	var gravityZ = 0;
	var gravity = this.gravity*(this.age*this.age);
	var gravityl = 1;

	//document.querySelector("#debug").innerHTML = "";

	for( var i = 0; i < this.segments.length; i++ ) {
		
		this.segments[i].mesh.position.y = heightDelta * i;
		this.segments[i].mesh.position.x = offsetX;
		this.segments[i].mesh.position.z = offsetZ;

		this.segments[i].mesh_outline.position.y = heightDelta * i;
		this.segments[i].mesh_outline.position.x = offsetX;
		this.segments[i].mesh_outline.position.z = offsetZ;

		this.segments[i].w1 = (this.segments.length-i)*widthDelta + widthScale;
		this.segments[i].w2 = (this.segments.length-i-1)*widthDelta + widthScale;
		this.segments[i].h = heightDelta;
		this.segments[i].ox = velocityX;
		this.segments[i].oz = velocityZ;
		this.segments[i].render_mode = this.render_mode;
		this.segments[i].Update();

		offsetX += velocityX;
		offsetZ += velocityZ;

		gravityl = .1;//Math.sqrt(offsetX*offsetX + offsetZ*offsetZ);
		gravityX = offsetX / gravityl * gravity * -1;
		gravityZ = offsetZ / gravityl * gravity * -1;
						
		velocityX += gravityX;
		velocityZ += gravityZ;


		
		//document.querySelector("#debug").innerHTML += nf(offsetX) + " " + nf(offsetZ) + " : " + nf(velocityX) + " " + nf(velocityZ) + "<br>";
	}

	for( var i = 0; i < this.leaf_count; i++ ) {
		var leaf_age = (this.age-this.leaf_spawns[i]) / this.leaf_age_time;
		leaf_age = Math.min( Math.max(leaf_age, 0), 1 );
		this.leafs[i].age = leaf_age;

		var segment = Math.floor(this.leaf_spawns[i]*this.segments.length);
		
		this.leafs[i].mesh.position.y = heightDelta*segment;//this.leaf_spawns[i]*this.height*this.age;
		this.leafs[i].mesh.position.x = this.segments[segment].mesh.position.x;
		this.leafs[i].mesh.position.z = this.segments[segment].mesh.position.z;
		this.leafs[i].mesh.rotation.set( this.leaf_roll[i], this.leaf_thetas[i], 0 );
		this.leafs[i].mesh.translateX(this.segments[segment].w1);

		this.leafs[i].render_mode = this.render_mode;
		this.leafs[i].Update();
	}
}