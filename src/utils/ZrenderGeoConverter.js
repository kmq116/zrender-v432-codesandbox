import * as turf from "@turf/turf";

/**
 * Zrender地理坐标转换工具
 * 用于将WGS84地理坐标转换为Zrender屏幕坐标
 */
export class ZrenderGeoConverter {
  /**
   * @param {Object} container - DOM容器元素
   * @param {Array<Array<number>>} boundaryPoints - 边界点的经纬度坐标数组 [[lng, lat], ...]
   * @param {Object} options - 配置项
   * @param {number} options.padding - 边界填充比例，默认0
   */
  constructor(container, boundaryPoints, options = {}) {
    this.container = container;
    this.containerSize = {
      width: container.clientWidth,
      height: container.clientHeight,
    };

    // 初始化边界
    this.initBounds(boundaryPoints);

    // 配置项
    this.options = {
      padding: 0,
      ...options,
    };

    // 应用padding
    if (this.options.padding) {
      const rangeX = this.bounds.maxX - this.bounds.minX;
      const rangeY = this.bounds.maxY - this.bounds.minY;
      this.bounds.minX -= rangeX * this.options.padding;
      this.bounds.maxX += rangeX * this.options.padding;
      this.bounds.minY -= rangeY * this.options.padding;
      this.bounds.maxY += rangeY * this.options.padding;
    }
  }

  /**
   * 初始化边界范围
   * @private
   */
  initBounds(geoPoints) {
    // 转换为墨卡托投影
    const polygon = turf.polygon([geoPoints]);
    const mercatorPolygon = turf.toMercator(polygon);
    const mercatorPoints = mercatorPolygon.geometry.coordinates[0];

    // 计算边界
    this.bounds = {
      minX: Math.min(...mercatorPoints.map((p) => p[0])),
      maxX: Math.max(...mercatorPoints.map((p) => p[0])),
      minY: Math.min(...mercatorPoints.map((p) => p[1])),
      maxY: Math.max(...mercatorPoints.map((p) => p[1])),
    };
  }

  /**
   * 将WGS84经纬度坐标转换为Zrender屏幕坐标
   * @param {number} lng - 经度
   * @param {number} lat - 纬度
   * @returns {Array<number>} [x, y] 屏幕坐标
   */
  toZrenderCoord(lng, lat) {
    // 转换为墨卡托坐标
    const point = turf.point([lng, lat]);
    const mercator = turf.toMercator(point);
    const [mercatorX, mercatorY] = mercator.geometry.coordinates;

    // 计算缩放比例
    const scaleX =
      this.containerSize.width / (this.bounds.maxX - this.bounds.minX);
    const scaleY =
      this.containerSize.height / (this.bounds.maxY - this.bounds.minY);
    const scale = Math.min(scaleX, scaleY);

    // 转换为屏幕坐标，y轴从底部开始
    const x = (mercatorX - this.bounds.minX) * scale;
    const y =
      this.containerSize.height - (mercatorY - this.bounds.minY) * scale;

    return [x, y];
  }
}
