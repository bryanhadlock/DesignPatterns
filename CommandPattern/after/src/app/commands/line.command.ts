import { ICommand } from './ICommand';
import { Point } from '../point';


export class LineCommand implements ICommand {

    constructor(private startPoint: Point, private endPoint: Point, private canvas: CanvasRenderingContext2D) { }
    
    execute() {
        this.canvas.beginPath();
        this.canvas.moveTo(this.startPoint.x, this.startPoint.y);
        this.canvas.lineTo(this.endPoint.x, this.endPoint.y);
        this.canvas.stroke();
    }
}