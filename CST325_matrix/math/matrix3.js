//CST 325 Adam Houser, Jason Pettit

/*
 * An object representing a 3x3 matrix
 */

var Matrix3 = function () {

	if (!(this instanceof Matrix3)) {
		alert("Matrix3 constructor must be called with the new operator");
	}

	// Stores a matrix in a flat array - left to right, top to bottom.
	// This format will be similar to what we'll eventually need to provide the WebGL API
	this.elements = new Float32Array(9);

	// todo #1 - DONE
	// "this.elements" should be initialized with values equal to the identity matrix
	for (var i = 0; i < this.elements.length; i++){
		this.elements[i] = (i % 3 == Math.floor(i / 3)) ? 1 : 0;
	}

	// -------------------------------------------------------------------------
	this.clone = function () {
		// todo #2 - DONE
		// create a new Matrix3 instance that is an exact copy of 'this' one and return it
		var newMatrix = new Matrix3();

		for (var i = 0; i < 9; i++){
			newMatrix.elements[i] = this.elements[i];
		}

		return newMatrix /* should be a new Matrix instance*/;
	};

	// -------------------------------------------------------------------------
	this.copy = function (other) {
		// todo #3 - DONE
		// copy all of the elements of other into the elements of 'this' matrix
		for (var i = 0; i < 9; i++){
			this.elements[i] = other.elements[i];
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.set = function (e11, e12, e13, e21, e22, e23, e31, e32, e33) {
		// todo #4 - DONE
		// Use the 9 elements passed in as arguments e-row#col# as the values to set on 'this' matrix.
		// Order is left to right, top to bottom.
		var e = this.elements;

		e[0] = e11; 	e[1] = e12; 	e[2] = e13;
		e[3] = e21;		e[4] = e22; 	e[5] = e23;
		e[6] = e31;		e[7] = e32; 	e[8] = e33;

		return this;
	};

	// -------------------------------------------------------------------------
	this.getElement = function (row, col) {
		// todo #5 - DONE
		// use the row and col to get the proper index into the 1d element array and return it
		return this.elements[row*3 + col];
	};

	// -------------------------------------------------------------------------
	this.setIdentity = function () {
		// todo #6 - DONE
		// reset every element in 'this' matrix to make it the identity matrix
		this.set(
			1,0,0,
			0,1,0,
			0,0,1
		);

		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationX = function (angle) {
		// ignore for now, you will implement this in matrix4
		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationY = function (angle) {
		// ignore for now, you will implement this in matrix4
		return this;
	};


	// -------------------------------------------------------------------------
	this.setRotationZ = function (angle) {
		// ignore for now, you will implement this in matrix4
		return this;
	};

	// -------------------------------------------------------------------------
	this.multiplyScalar = function (s) {
		for (var i = 0; i < 9; ++i) {
			this.elements[i] = this.elements[i] * s;
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.multiplyVector = function (v) {
		// todo #7 - DONE
		// set the result vector values to be the result of multiplying the argument
		// v by 'this' matrix
		var te = this.elements;
		var result = new Vector3(
			te[0] * v.x + te[1] * v.y + te[2] * v.z,
			te[3] * v.x + te[4] * v.y + te[5] * v.z,
			te[6] * v.x + te[7] * v.y + te[8] * v.z,
		);
		return result;
	};

	// -------------------------------------------------------------------------
	this.multiplyRightSide = function (otherMatrixOnRight) {
		// todo #8 - DONE
		// multiply 'this' matrix (on the left) by otherMatrixOnRight (on the right)
		// the results should be applied to the elements on 'this' matrix
		var te = this.elements;
		var oe = otherMatrixOnRight.elements;

		var m11 = te[0] * oe[0] + te[1] * oe[3] + te[2] * oe[6];
		var m12 = te[0] * oe[1] + te[1] * oe[4] + te[2] * oe[7];
		var m13 = te[0] * oe[2] + te[1] * oe[5] + te[2] * oe[8];

		var m21 = te[3] * oe[0] + te[4] * oe[3] + te[5] * oe[6];
		var m22 = te[3] * oe[1] + te[4] * oe[4] + te[5] * oe[7];
		var m23 = te[3] * oe[2] + te[4] * oe[5] + te[5] * oe[8];

		var m31 = te[6] * oe[0] + te[7] * oe[3] + te[8] * oe[6];
		var m32 = te[6] * oe[1] + te[7] * oe[4] + te[8] * oe[7];
		var m33 = te[6] * oe[2] + te[7] * oe[5] + te[8] * oe[8];

		this.set(m11, m12, m13, m21, m22, m23, m31, m32, m33);

		return this;
	};

	// -------------------------------------------------------------------------
	this.determinant = function () {
		// todo #9 - DONE
		// compute and return the determinant for 'this' matrix
		var e = this.elements;

		var m11 = e[0];   var m12 = e[1];   var m13 = e[2];
		var m21 = e[3];   var m22 = e[4];   var m23 = e[5];
		var m31 = e[6];   var m32 = e[7];   var m33 = e[8];

		var det = (m11*m22*m33) + (m12*m23*m31) + (m13 * m21 * m32)
					- (m13 * m22 * m31) - (m12 * m21 * m33) - (m11 * m23 * m32);

		return det;
	};

	// -------------------------------------------------------------------------
	this.transpose = function () {
		// todo #10 - DONE
		// modify 'this' matrix so that it becomes its transpose
		var te = this.elements;
		var tmp;

		// 0 1 2  --> 0n* 3y* 6y*  n= no change in position
		// 3 4 5  --> 1y* 4n* 7y*  y= change in position
		// 6 7 8  --> 2y* 5y* 8n*  *= implemented

		tmp = te[1]; te[1] = te[3]; te[3] = tmp;
		tmp = te[2]; te[2] = te[6]; te[6] = tmp;
		tmp = te[7]; te[7] = te[5]; te[5] = tmp;

		return this;
	};

	// -------------------------------------------------------------------------
	this.inverse = function () {
		var FLOAT32_EPSILON = 1.1920928955078125e-7;
		var det = this.determinant();
		if(Math.abs(det) <= FLOAT32_EPSILON) {
			return setIdentity();
		} else {
			var e = this.elements;

			// laid out for clarity, not performance
			var m11 = e[0];   var m12 = e[1];   var m13 = e[2];
			var m21 = e[3];   var m22 = e[4];   var m23 = e[5];
			var m31 = e[6];   var m32 = e[7];   var m33 = e[8];

			var minor11 = m22 * m33 - m23 * m32;
			var minor12 = m21 * m33 - m23 * m31;
			var minor13 = m21 * m32 - m22 * m31;
			var minor21 = m12 * m33 - m13 * m32;
			var minor22 = m11 * m33 - m13 * m31;
			var minor23 = m11 * m32 - m12 * m31;
			var minor31 = m12 * m23 - m13 * m22;
			var minor32 = m11 * m33 - m13 * m31;
			var minor33 = m11 * m22 - m12 * m21;

			return this.set(
				minor11, -minor21, minor31,
				-minor12, minor22, -minor32,
				minor13, -minor23, minor33
			).multiplyScalar(1/det);
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.log = function () {
		var e = this.elements;
		console.log('[ ' +
			'\n ' + e[0] + ', ' + e[1] + ', ' + e[2] +
			'\n ' + e[4] + ', ' + e[5] + ', ' + e[6] +
			'\n ' + e[8] + ', ' + e[9] + ', ' + e[10] +
			'\n ' + e[12] + ', ' + e[13] + ', ' + e[14] +
			'\n]'
		);

		return this;
	};
};
