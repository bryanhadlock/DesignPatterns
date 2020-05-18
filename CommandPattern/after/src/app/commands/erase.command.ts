import { ICommand } from './ICommand';
import { Point } from '../point';


export class EraseCommand implements ICommand {

    constructor(private startPoint: Point, private endPoint: Point, private canvas: CanvasRenderingContext2D) { }
    
    execute() {
        this.canvas.clearRect(this.startPoint.x, this.startPoint.y,this.endPoint.x, this.endPoint.y);
    }
    
}