import { ICommand } from './ICommand';
import { Point } from '../point';


export class RectangleCommand implements ICommand {

    constructor(private startPoint: Point, private endPoint: Point, private canvas: CanvasRenderingContext2D) { }
    
    execute() {
        this.canvas.beginPath();
        this.canvas.rect(this.startPoint.x, this.startPoint.y, this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y );
        this.canvas.stroke();
    }
    
}