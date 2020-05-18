import { ICommand } from './ICommand';
import { Point } from '../point';


export class CircleCommand implements ICommand {

    constructor(private startPoint: Point, private endPoint: Point, private canvas: CanvasRenderingContext2D) { }
    
    execute() {
        this.canvas.beginPath();
        const radius = Math.sqrt( Math.pow(this.startPoint.x - this.endPoint.x, 2) + Math.pow(this.startPoint.y - this.endPoint.y, 2));
        this.canvas.arc(this.startPoint.x, this.startPoint.y, radius, 0, 2 * Math.PI);
        this.canvas.stroke();
    }
    
}