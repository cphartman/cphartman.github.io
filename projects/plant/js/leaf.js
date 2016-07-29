Leaf = function() {
	this.f1 = 1;
	this.f2 = 1;
	this.g1 = 1;
	this.g2 = 1;
	this.age = 0;
	this.SEGMENTS = 10;
	this.startTimestamp = 0;

	this.material = new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: false, side: THREE.DoubleSide});
	this.material_outline = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: false, side: THREE.BackSide});

	this.geometry = new  THREE.PlaneGeometry(1,1,this.SEGMENTS,2);
	this.geometry_outline = new THREE.PlaneGeometry(1,1,this.SEGMENTS,2);

	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.mesh.name = "Leaf";
	this.mesh.frustumCulled = false;

	this.mesh_outline = new THREE.Mesh( this.geometry_outline, this.material_outline );
	this.mesh_outline.name = "Leaf Outline";
	this.mesh_outline.frustumCulled = false;

	this.root = new THREE.Object3D();
	this.root.add( this.mesh );

	this.mesh.add( this.mesh_outline );

	this.RandomizeGeneration();
	this.Update();

	this.outline_stroke = .05;
	this.render_mode = false;
}

Leaf.prototype.RandomizeGeneration = function() {
	this.f1 = Math.random()*2;
	this.f2 = Math.random()*2;
	this.g1 = Math.random()*1;
	this.g2 = Math.random()*2;
}

Leaf.prototype.f = function(x) {
	return Math.abs(Math.sqrt( Math.pow(x,1+this.f1) ) - Math.pow(x,1+this.f2));
}

Leaf.prototype.Update = function() {

	for( var i = 0; i < this.mesh.geometry.vertices.length; i++ ) {

		var x_pos = (i%(this.SEGMENTS+1))/this.SEGMENTS;
		var y_pos = (i < this.SEGMENTS+1 ? 1 : -1);

		var v = this.f(x_pos);
		var y_grow_scale = Math.pow(this.age,1.5+this.g2);

		this.mesh.geometry.vertices[i].y = 0;
		this.mesh.geometry.vertices[i].x = x_pos* Math.pow(this.age,1+this.g1);
		this.mesh.geometry.vertices[i].z = v * y_pos * y_grow_scale;

		if( this.render_mode == "outline" ) {
			var y_outline_offset = (i < this.SEGMENTS+1 ? 1 : -1) * this.outline_stroke * y_grow_scale;
			this.mesh_outline.geometry.vertices[i].y = -.001;
			if( i == this.SEGMENTS+1 || i == this.SEGMENTS*2+1) {
				// Last vertex in the strip
				this.mesh_outline.geometry.vertices[i].z = 0;
				this.mesh_outline.geometry.vertices[i].x = this.mesh.geometry.vertices[i].x + this.outline_stroke;
			} else {
				this.mesh_outline.geometry.vertices[i].x = this.mesh.geometry.vertices[i].x;

				this.mesh_outline.geometry.vertices[i].z = this.mesh.geometry.vertices[i].z + y_outline_offset;
			}
			this.mesh_outline.visible = true;
		} else {
			this.mesh_outline.visible = false;
		}
	}

	this.mesh_outline.geometry.verticesNeedUpdate = 1;
	this.mesh.geometry.verticesNeedUpdate = 1;
}