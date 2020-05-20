import { Point } from '../models/point';

export class Drawing {

    constructor(private canvas: CanvasRenderingContext2D) { }

    drawRectangle(startPoint: Point, endPoint: Point): void  {
        this.canvas.beginPath();
        this.canvas.rect(startPoint.x, startPoint.y, endPoint.x - startPoint.x, endPoint.y - startPoint.y );
        this.canvas.stroke();
    }

    drawFreeForm(points: Point[]): void {
        let previousPoint: Point;
        for (const point of points) {
          if (previousPoint) {
            this.drawLine(previousPoint, point);
          }
          previousPoint = point;
        }
    }

    private drawLine(startPoint: Point, endPoint: Point): void {
        this.canvas.beginPath();
        this.canvas.moveTo(startPoint.x, startPoint.y);
        this.canvas.lineTo(endPoint.x, endPoint.y);
        this.canvas.stroke();
    }

    erase(startPoint: Point, endPoint: Point): void {
        this.canvas.clearRect(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }
}