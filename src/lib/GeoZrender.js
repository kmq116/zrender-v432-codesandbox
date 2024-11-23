import zrender from "zrender";
import * as turf from "@turf/turf";
import { CoordinateUtils } from "../utils/coordinateUtils";

export class GeoZrender {
  constructor(container, options = {}) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.zr = zrender.init(this.container);
    this.bounds = null;
    this.containerSize = {
      width: this.zr.getWidth(),
      height: this.zr.getHeight(),
    };

    // 默认配置项
    this.options = {
      padding: 0.1, // 边界填充比例
      ...options,
    };
  }

  /**
   * 初始化地理边界
   * @param {Array<Array<number>>} geoPoints - WGS84经纬度坐标点数组 [[lng, lat], ...]
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

    // 添加padding
    const rangeX = this.bounds.maxX - this.bounds.minX;
    const rangeY = this.bounds.maxY - this.bounds.minY;

    if (this.options.padding) {
      this.bounds.minX -= rangeX * this.options.padding;
      this.bounds.maxX += rangeX * this.options.padding;
      this.bounds.minY -= rangeY * this.options.padding;
      this.bounds.maxY += rangeY * this.options.padding;
    }

    return this;
  }

  /**
   * 将WGS84坐标转换为屏幕坐标
   * @param {number} lng - 经度
   * @param {number} lat - 纬度
   * @returns {Array<number>} [x, y] 屏幕坐标
   */
  wgs84ToScreen(lng, lat) {
    if (!this.bounds) {
      throw new Error("请先调用 initBounds 初始化地理边界");
    }
    const [mercatorX, mercatorY] = CoordinateUtils.wgs84ToMercator(lng, lat);
    return CoordinateUtils.mercatorToScreen(
      mercatorX,
      mercatorY,
      this.bounds,
      this.containerSize
    );
  }

  /**
   * 绘制多边形
   * @param {Array<Array<number>>} geoPoints - WGS84经纬度坐标点数组
   * @param {Object} style - zrender样式配置
   * @returns {zrender.Polygon} 多边形实例
   */
  drawPolygon(geoPoints, style = {}) {
    const screenPoints = geoPoints.map((point) =>
      this.wgs84ToScreen(point[0], point[1])
    );

    const polygon = new zrender.Polygon({
      shape: {
        points: screenPoints,
      },
      style: {
        fill: "rgba(220, 20, 60, 0.4)",
        stroke: "#DC143C",
        lineWidth: 2,
        ...style,
      },
      draggable: false,
    });

    this.zr.add(polygon);
    return polygon;
  }

  /**
   * 绘制点
   * @param {number} lng - 经度
   * @param {number} lat - 纬度
   * @param {Object} style - zrender样式配置
   * @returns {zrender.Circle} 点实例
   */
  drawPoint(lng, lat, style = {}) {
    const [x, y] = this.wgs84ToScreen(lng, lat);

    const point = new zrender.Circle({
      shape: {
        cx: x,
        cy: y,
        r: style.r || 5,
      },
      style: {
        fill: "#f00",
        ...style,
      },
    });

    this.zr.add(point);
    return point;
  }

  /**
   * 绘制线段
   * @param {Array<Array<number>>} geoPoints - WGS84经纬度坐标点数组 [[lng1,lat1], [lng2,lat2]]
   * @param {Object} style - zrender样式配置
   * @returns {zrender.Line} 线段实例
   */
  drawLine(geoPoints, style = {}) {
    const [x1, y1] = this.wgs84ToScreen(geoPoints[0][0], geoPoints[0][1]);
    const [x2, y2] = this.wgs84ToScreen(geoPoints[1][0], geoPoints[1][1]);

    const line = new zrender.Line({
      shape: {
        x1,
        y1,
        x2,
        y2,
      },
      style: {
        stroke: "#000",
        lineWidth: 2,
        ...style,
      },
    });

    this.zr.add(line);
    return line;
  }

  /**
   * 清空画布
   */
  clear() {
    this.zr.clear();
  }

  /**
   * 获取zrender实例
   */
  getZrender() {
    return this.zr;
  }
}
