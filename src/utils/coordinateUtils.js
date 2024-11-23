import * as turf from "@turf/turf";

/**
 * 坐标转换工具类
 */
export class CoordinateUtils {
  /**
   * WGS84 经纬度转墨卡托投影坐标
   * @param {number} lng - 经度
   * @param {number} lat - 纬度
   * @returns {number[]} 墨卡托坐标 [x, y]
   */
  static wgs84ToMercator(lng, lat) {
    const point = turf.point([lng, lat]);
    const mercator = turf.toMercator(point);
    return mercator.geometry.coordinates;
  }

  /**
   * 墨卡托投影坐标转 WGS84
   * @param {number} x - 墨卡托 x 坐标
   * @param {number} y - 墨卡托 y 坐标
   * @returns {number[]} WGS84坐标 [lng, lat]
   */
  static mercatorToWgs84(x, y) {
    const point = turf.point([x, y]);
    const wgs84 = turf.toWgs84(point);
    return wgs84.geometry.coordinates;
  }

  /**
   * 墨卡托投影坐标转屏幕坐标
   * @param {number} mercatorX - 墨卡托 x 坐标
   * @param {number} mercatorY - 墨卡托 y 坐标
   * @param {Object} bounds - 边界范围
   * @param {Object} containerSize - 容器尺寸
   * @returns {number[]} 屏幕坐标 [x, y]
   */
  static mercatorToScreen(mercatorX, mercatorY, bounds, containerSize) {
    // 计算 x 和 y 方向的缩放比例
    const scaleX = containerSize.width / (bounds.maxX - bounds.minX);
    const scaleY = containerSize.height / (bounds.maxY - bounds.minY);

    // 使用较小的缩放比例来保持等比例
    const scale = Math.min(scaleX, scaleY);

    // x 轴从左边开始，y 轴从底部开始
    const x = (mercatorX - bounds.minX) * scale;
    const y = containerSize.height - (mercatorY - bounds.minY) * scale;

    return [x, y];
  }
}
