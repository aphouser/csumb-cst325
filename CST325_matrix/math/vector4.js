/*
 * An object representing a 4d vector to make operations simple and concise.
 */

var Vector4 = function(x, y, z, w) {
	this.x = x; this.y = y; this.z = z; this.w = w;

	if (!(this instanceof Vector4)) {
		alert("Vector4 constructor must be called with the new operator");
	}

	if (this.x == undefined) {
		this.x = this.y = this.z = 0; this.w = 0;
	}

	this.set = function(x, y, z, w) {
		this.x = x; this.y = y; this.z = z; this.w = w;
		return this;
	}

	this.clone = function() {
		return new Vector4(this.x, this.y, this.z, this.w);
	};

	this.copy = function(other) {
		this.x = other.x; this.y = other.y; this.z = other.z; this.w = other.w;
		return this;
	}

	this.add = function(v) {
		this.x += v.x; this.y += v.y; this.z += v.z; this.w += v.w;
		return this;
	};

	this.subtract = function(v) {
		this.x -= v.x; this.y -= v.y; this.z -= v.z; this.w -= v.w;
		return this;
	};

	this.negate = function() {
		this.x = -this.x; this.y = -this.y; this.z = -this.z; this.w = -this.w;
		return this;
	};

	this.multiplyScalar = function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
		return this;
	};

	this.length = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	};

	this.lengthSqr = function() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}

	this.normalized = function() {
		return new Vector4(this.x, this.y, this.z, this.w).multiplyScalar(1 / this.length());
	};

	this.normalize = function() {
		this.multiplyScalar(1 / this.length());
		return this;
	};

	this.dot = function(other) {
		return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
	};
};
