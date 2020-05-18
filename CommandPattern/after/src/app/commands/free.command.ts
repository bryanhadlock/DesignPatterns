import { ICommand } from './icommand';
import { Point } from '../point';


export class FreeCommand implements ICommand {

    constructor(private points: Point[]) { }
    
    execute(canvas: CanvasRenderingContext2D) {
        let previousPoint: Point;
        for (const point of this.points) {
          if (previousPoint) {
            this.drawLine(previousPoint, point, canvas);
          }
          previousPoint = point;
        }
    }

    drawLine(startPoint: Point, endPoint: Point, canvas: CanvasRenderingContext2D) {
        canvas.beginPath();
        canvas.moveTo(startPoint.x, startPoint.y);
        canvas.lineTo(endPoint.x, endPoint.y);
        canvas.stroke();
    }
    
}