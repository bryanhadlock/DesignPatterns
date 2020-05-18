import { ICommand } from './ICommand';
import { Point } from '../point';


export class FreeCommand implements ICommand {

    constructor(private points: Point[], private canvas: CanvasRenderingContext2D) { }
    
    execute() {
        let previousPoint: Point;
        for (const point of this.points) {
          if (previousPoint) {
            this.drawLine(previousPoint, point);
          }
          previousPoint = point;
        }
    }

    drawLine(startPoint: Point, endPoint: Point) {
        this.canvas.beginPath();
        this.canvas.moveTo(startPoint.x, startPoint.y);
        this.canvas.lineTo(endPoint.x, endPoint.y);
        this.canvas.stroke();
    }
    
}