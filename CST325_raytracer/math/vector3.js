/*
 * An object representing a 3d vector to make operations simple and concise.
 */

var Vector3 = function(x, y, z) {
	this.x = x; this.y = y; this.z = z;

  if (!(this instanceof Vector3)) {
    console.error("Vector3 constructor must be called with the new operator");
  }

  if (x === undefined) this.x = 0;
  if (y === undefined) this.y = 0;
  if (z === undefined) this.z = 0;

	if (this.x == undefined) {
		this.x = this.y = this.z = 0;
	}

	this.set = function(x, y, z) {
		this.x = x; this.y = y; this.z = z;
		return this;
	}

	this.clone = function() {
		return new Vector3(this.x, this.y, this.z);
	};

	this.copy = function(other) {
		this.x = other.x; this.y = other.y; this.z = other.z;
		return this;
	}

	this.add = function(v) {
		this.x += v.x; this.y += v.y; this.z += v.z;
		return this;
	};

	this.subtract = function(v) {
		this.x -= v.x; this.y -= v.y; this.z -= v.z;
		return this;
	};

	this.negate = function() {
		this.x = -this.x; this.y = -this.y; this.z = -this.z;
		return this;
	};

	this.multiplyScalar = function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	};

	this.length = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	};

	this.lengthSqr = function() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	this.normalized = function() {
		return new Vector3(this.x, this.y, this.z).multiplyScalar(1 / this.length());
	};

	this.normalize = function() {
		this.multiplyScalar(1 / this.length());
		return this;
	};

	this.dot = function(other) {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	};
};
