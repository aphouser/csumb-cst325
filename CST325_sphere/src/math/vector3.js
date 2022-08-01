/* CST325_vector Students: Adam Houser, Jason Pettit

/*
 * An "object" representing a 3d vector to make operations simple and concise.
 *
 * Similar to how we work with plain numbers, we will work with vectors as
 * an entity unto itself.  Note the syntax below: var Vector3 = function...
 * This is different than you might be used to in most programming languages.
 * Here, the function is meant to be instantiated rather than called and the
 * instantiation process IS similar to other object oriented languages => new Vector3()
 */

var Vector3 = function(x, y, z) {
  this.x = x; this.y = y; this.z = z;

  // Sanity check to prevent accidentally using this as a normal function call
  if (!(this instanceof Vector3)) {
    console.error("Vector3 constructor must be called with the new operator");
  }
  // todo - make sure to set a default value in case x, y, or z is not passed in
  if (x == null) this.x = 0;
  if (y == null) this.y = 0;
  if (z == null) this.z = 0;

  this.set = function(x, y, z) {
    // todo set 'this' object's values to those from x, y, and z
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  }

  this.clone = function() {
    return new Vector3(this.x, this.y, this.z);
  };

  this.copy = function(other) {
    // copy the values from other into 'this'
    if (other.x != null) this.x = other.x;
    if (other.y != null) this.y = other.y;
    if (other.z != null) this.z = other.z;

    return this;
  }

  this.add = function(v) {
    // todo - add v to 'this' vector
    // This SHOULD change the values of this.x, this.y, and this.z
    this.x = this.x + v.x;
    this.y = this.y + v.y;
    this.z = this.z + v.z;

    return this;
  };

  this.subtract = function(v) {
    // todo - subtract v from 'this' vector
    // This SHOULD change the values of this.x, this.y, and this.z
    this.x = this.x - v.x;
    this.y = this.y - v.y;
    this.z = this.z - v.z;

    return this;
  };

  this.negate = function() {
    // multiply 'this' vector by -1
    // This SHOULD change the values of this.x, this.y, and this.z
    this.x = this.x * -1;
    this.y = this.y * -1;
    this.z = this.z * -1;

    return this;
  };

  this.multiplyScalar = function(scalar) {
    // multiply 'this' vector by "scalar"
    // This SHOULD change the values of this.x, this.y, and this.z
    this.x = this.x * scalar;
    this.y = this.y * scalar;
    this.z = this.z * scalar;

    return this;
  };

  this.length = function() {
    // todo - return the magnitude (A.K.A. length) of 'this' vector
    // This should NOT change the values of this.x, this.y, and this.z
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y,2) + Math.pow(this.z, 2));
  };

  this.normalized = function() {
    // todo - return a new vector instance that is a normalized clone of 'this' vector
    // This should NOT change the values of this.x, this.y, and this.z
    var tempVector = this.clone();
    var magnitude = this.length();

    tempVector.x = (tempVector.x / magnitude);
    tempVector.y = (tempVector.y / magnitude);
    tempVector.z = (tempVector.z / magnitude);

    return tempVector; // Should return a new vector that is not this
  };

  this.normalize = function() {
    // todo - Change the components of this vector so that its magnitude will equal 1.
    // This SHOULD change the values of this.x, this.y, and this.z
    var magnitude = this.length();

    this.x = (this.x / magnitude);
    this.y = (this.y / magnitude);
    this.z = (this.z / magnitude);

    return this;
  };

  this.dot = function(other) {
    // todo - return the dot product betweent this vector and "other"
    // This should NOT change the values of this.x, this.y, and this.z

    return ((this.x * other.x) + (this.y * other.y) + (this.z * other.z));
  };

  // The functions below must be completed in order to receive an "A"

  this.test_createFromToVector = function(fromPoint, toPoint) {
    // todo - return the vector that goes from "fromPoint" to "toPoint"
    //        NOTE - "fromPoint" and "toPoint" should not be altered
    var tempVector = this.clone();

    tempVector.x = toPoint.x - fromPoint.x;
    tempVector.y = toPoint.y - fromPoint.y;
    tempVector.z = toPoint.z - fromPoint.z;

    return tempVector;
  };

  this.lengthSqr = function() {
    // todo - return the squared magnitude of this vector ||v||^2
    // This should NOT change the values of this.x, this.y, and this.z
    return Math.pow(this.length(), 2);
  };
};
