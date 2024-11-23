/**
 * 几何计算工具类
 */
export class GeometryUtils {
  /**
   * 计算两条线段之间的夹角
   * @param {number} x1 - 第一条线段起点x
   * @param {number} y1 - 第一条线段起点y
   * @param {number} x2 - 第一条线段终点x
   * @param {number} y2 - 第一条线段终点y
   * @param {number} x3 - 第二条线段起点x
   * @param {number} y3 - 第二条线段起点y
   * @param {number} x4 - 第二条线段终点x
   * @param {number} y4 - 第二条线段终点y
   * @returns {number} 夹角(弧度)
   */
  static calculateAngleBetweenLines(x1, y1, x2, y2, x3, y3, x4, y4) {
    const vector1 = {
      x: x2 - x1,
      y: y2 - y1,
    };

    const vector2 = {
      x: x4 - x3,
      y: y4 - y3,
    };

    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
    const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
    const cosTheta = dotProduct / (magnitude1 * magnitude2);
    let angle = Math.acos(cosTheta);

    const crossProduct = vector1.y * vector2.x - vector1.x * vector2.y;
    if (crossProduct < 0) {
      angle = 2 * Math.PI - angle;
    }

    return angle;
  }
}
