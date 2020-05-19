import { ICommand } from './icommand';
import { Point } from '../models/point';


export class LineCommand implements ICommand {

    constructor(private startPoint: Point, private endPoint: Point) { }
    
    execute(canvas: CanvasRenderingContext2D) {
        canvas.beginPath();
        canvas.moveTo(this.startPoint.x, this.startPoint.y);
        canvas.lineTo(this.endPoint.x, this.endPoint.y);
        canvas.stroke();
    }
}