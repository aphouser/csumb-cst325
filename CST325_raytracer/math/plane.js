
var Plane = function(normal, validPoint, color, reflectivity) {
	this.normal = normal.normalized();
	this.validPoint = validPoint;
	this.color = color || new Vector3(1, 1, 1);
	this.reflectivity = (reflectivity != undefined) ? reflectivity: 0;

	this.raycast = function(ray) {
		var numerator = this.normal.dot(this.validPoint) - (this.normal.dot(ray.origin));
		var denominator = this.normal.dot(ray.direction);

		var alpha = numerator / denominator;

		if (alpha > 0 && this.normal.dot(ray.direction) < 0) {
			var hitPoint = ray.origin.clone().add(ray.direction.clone().multiplyScalar(alpha));
			return {
				hit: true,
				point: hitPoint,
				normal: this.normal,
				distance: hitPoint.clone().subtract(ray.origin).length()
			};
		} else {
			return { hit: false }
		}
	}
}