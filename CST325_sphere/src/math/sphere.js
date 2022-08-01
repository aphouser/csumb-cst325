// CST325_sphere Students: Adam Houser, Jason Pettit

/*
 * An object type representing an implicit sphere.
 *
 * @param center A Vector3 object representing the position of the center of the sphere
 * @param radius A Number representing the radius of the sphere.
 */

var Sphere = function(center, radius) {
  if (!(this instanceof Sphere)) {
    console.error("Sphere constructor must be called with the new operator");
  }

  if (!(center instanceof Vector3)) {
    console.error("The sphere center must be a Vector3");
  }

  if ((typeof(radius) != 'number')) {
    console.error("The radius must be a Number");
  }

  this.center = center;
  this.radius = radius;

  // todo - make sure center and radius are replaced with default values if and only if they
  // are invalid or undefined (i.e. center should be of type Vector3 & radius should be a Number)
  // - the default center should be the zero vector
  // - the default radius should be 1
  if (center == null) this.center = new Vector3(0, 0, 0);
  if (radius == null) this.radius = 1;

  this.raycast = function(ray) {
    // todo determine whether the ray intersects this sphere and where

    // Recommended steps
    // ------------------
    // 0. (optional) watch the video showing the complete implementation of plane.js
    //    You may find it useful to see a different piece of geometry coded.
    // 1. review slides/book math
    // 2. create the vector(s) needed to solve for the coefficients in the
    //    quadratic equation
    // 3. calculate the discriminant
    // 4. use the discriminant to determine if further computation is necessary
    // 5. return the following object literal "result" based on the following cases:
    //    case 1: no VALID intersections
    //      var result = { hit: false, point: null }
    //    case 2: 1 or more intersections
    //      var result = {
    //        hit: true,
    //        point: 'a Vector3 containing the closest VALID intersection',
    //        normal: 'a vector3 containing a unit length normal at the intersection point',
    //        distance: 'a scalar containing the intersection distance from the ray origin'
    //      }

    // 2. create the vector(s) needed to solve for the coefficients in the
    //    quadratic equation
    // need to find where psphere = pray or ||psphere - c|| = r and pray = o + ad
    // solve for alpha = alpha^2 d dot d + 2alpha d dot (o-c) + (o-c) dot (o-c) - r^2

    // ray direction = d from above
    var rd = ray.direction;
    // vector from ray origin to sphere origin = (o-c) above
    var rs = ray.origin.clone().subtract(this.center);

    // 3. calculate the discriminant
    // discriminant = b^2-4ac

    // a = d dot d
    var a = rd.dot(rd);
    // b = 2d dot (o-c)
    var b = 2 * rd.dot(rs);
    // c = (o-c) dot (o-c)
    var c = rs.dot(rs) - Math.pow(this.radius,2);

    var discriminant = Math.pow(b, 2) - 4 * a * c;

    // 4. use the discriminant to determine if further computation is necessary
    // if the discriminant is negative, no intersection
    if (discriminant < 0) {
      var result = {hit: false, point: null};
      return result;
    }

    // alpha from quadratic solution shows intersection point.  using - only to show first intersection point
    // origin in sphere covered below
    var alpha = (-b - Math.sqrt(discriminant)) / (2 * a);

    // create an intersect vector using o + alpha d
    var intersectVector = ray.origin.add(ray.direction.multiplyScalar(alpha));

    if (alpha < 0) {
      // if alpha is negative the intersection is behind, so ray.origin is inside the sphere
      var result = {hit: false, point: null};
      return result;
    } else {
      // should be a good value
      var result = {
        hit: true,
        point: intersectVector,
        normal: intersectVector.clone().subtract(this.center).normalized(),
        distance: alpha
      };
      return result;
    }
  }
};