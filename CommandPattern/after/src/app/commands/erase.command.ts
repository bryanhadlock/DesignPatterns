import { ICommand } from './icommand';
import { Point } from '../point';


export class EraseCommand implements ICommand {

    constructor(private startPoint: Point, private endPoint: Point) { }
    
    execute(canvas: CanvasRenderingContext2D) {
        canvas.clearRect(this.startPoint.x, this.startPoint.y,this.endPoint.x, this.endPoint.y);
    }
    
}