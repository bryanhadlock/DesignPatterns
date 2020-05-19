import { ICommand } from './icommand';
import { Point } from '../models/point';


export class CircleCommand implements ICommand {

    constructor(private startPoint: Point, private endPoint: Point) { }
    
    execute(canvas: CanvasRenderingContext2D) {
        canvas.beginPath();
        const radius = Math.sqrt( Math.pow(this.startPoint.x - this.endPoint.x, 2) + Math.pow(this.startPoint.y - this.endPoint.y, 2));
        canvas.arc(this.startPoint.x, this.startPoint.y, radius, 0, 2 * Math.PI);
        canvas.stroke();
    }  
}