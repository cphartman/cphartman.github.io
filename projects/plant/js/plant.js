Plant = function() {
	this.stem = new Stem();
	this.head = new Head();
	this.age = 1;
	this.mouthSpeed = 1;
	this.root = new THREE.Object3D();

	//this.initial_mouthTheta_target = 1;
}

Plant.prototype.Behave = function() {
	this.stem.initialVelocityX += Math.sin(Date.now()/1000)*.0016;
	this.stem.initialVelocityZ -= Math.cos(Date.now()/2570)*.0016;
	this.stem.gravity += Math.cos(Date.now()/2000)*.0001;

	this.stem.initialVelocityX = Math.max(Math.min(this.stem.initialVelocityX,.2),-.2);
	this.stem.initialVelocityZ = Math.max(Math.min(this.stem.initialVelocityZ,.2),-.2);
	this.stem.gravity = Math.max(Math.min(this.stem.gravity,.1),0);

	this.head.mouthTheta_target += Math.sin(Date.now()/this.mouthSpeed)*Math.PI*.01;
	
	this.head.mouthTheta_target = Math.max(Math.min(this.head.mouthTheta_target, Math.PI*4/6),0);
}

Plant.prototype.RandomizeGeneration = function() {
	this.stem.RandomizeGeneration();
	this.head.RandomizeGeneration();

	this.initial_mouthTheta_target = this.head.mouthTheta_target;
	this.mouthSpeed = 50+Math.random()*200;
}

Plant.prototype.Reset = function() {
	this.root.remove( this.stem.root );
	this.root.remove( this.head.root );

	this.stem.Reset();
	this.head.Reset();

	this.root.add( this.stem.root );
	this.root.add( this.head.root );
}

Plant.prototype.Update = function() {
	this.stem.age = this.age;
	this.head.age = this.age;
	this.stem.Update();

	var tip = this.stem.GetTip();
	this.head.root.position.set(tip.x, tip.y, tip.z);
	this.head.Update();
}