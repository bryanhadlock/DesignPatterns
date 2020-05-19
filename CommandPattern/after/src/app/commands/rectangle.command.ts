import { ICommand } from './icommand';
import { Point } from '../models/point';


export class RectangleCommand implements ICommand {

    constructor(private startPoint: Point, private endPoint: Point) { }
    
    execute(canvas: CanvasRenderingContext2D) {
        canvas.beginPath();
        canvas.rect(this.startPoint.x, this.startPoint.y, this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y );
        canvas.stroke();
    }
    
}