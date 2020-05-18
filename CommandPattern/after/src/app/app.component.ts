import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { ShapeType } from './shape-type';
import { Point } from './point';
import { ICommand } from './commands/ICommand';
import { LineCommand } from './commands/line.command';
import { EraseCommand } from './commands/erase.command';
import { RectangleCommand } from './commands/rectangle.command';
import { CircleCommand } from './commands/circle.command';
import { FreeCommand } from './commands/free.command';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  @ViewChild('canvas', {static: false}) public canvas: ElementRef;

  @Input() public width = 700;
  @Input() public height = 700;

  private shapeType: ShapeType = ShapeType.FreeLine;

  private cx: CanvasRenderingContext2D;

  private commands: ICommand[] = [];

  private undoCommands: ICommand[] = [];

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext("2d");

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = "round";
    this.cx.strokeStyle = "#000";

    this.captureEvents(canvasEl);
  }

  public square(): void {
    this.shapeType = ShapeType.Square;
  }

  public circle(): void {
    this.shapeType = ShapeType.Circle;
  }

  public line(): void {
    this.shapeType = ShapeType.StraightLine;
  }

  public free(): void {
    this.shapeType = ShapeType.FreeLine;
  }

  public clear(): void {
    this.clearScreen();
  }

  public undo(): void {
    if (this.commands.length > 0) {
      let poppedCommand = this.commands.pop();
      this.undoCommands.push(poppedCommand);
      this.cx.clearRect(0, 0,this.width, this.height);
      this.executeCommands();
    }
  }

  public redo(): void {
    if (this.undoCommands.length > 0) {
      let poppedCommand = this.undoCommands.pop();
      this.commands.push(poppedCommand);
      this.cx.clearRect(0, 0,this.width, this.height);
      this.executeCommands();
    }
  }
  


  private captureEvents(canvasEl: HTMLCanvasElement) {
    let startPosition:Point = null;
    let points: Point[] = [];
    canvasEl.addEventListener("mouseup", e => {
      const rect = canvasEl.getBoundingClientRect();
      const currentPos:Point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      if (this.shapeType == ShapeType.StraightLine) {
        this.drawLine(startPosition, currentPos);
      }
      else if (this.shapeType == ShapeType.Circle) {
        this.drawCircle(startPosition, currentPos);
      }
      else if (this.shapeType == ShapeType.Square) {
        this.drawRectangle(startPosition, currentPos);
      }
      else if (this.shapeType == ShapeType.FreeLine) {
        points.push(currentPos);
        this.drawFree(points);
        points = [];
      }
    });

   

    canvasEl.addEventListener("mousedown", e => {
      const rect = canvasEl.getBoundingClientRect();
      startPosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      if (this.shapeType == ShapeType.FreeLine) {
        points.push(startPosition);
      }
    });

    fromEvent(canvasEl, "mousedown")
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, "mousemove")
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(canvasEl, "mouseup")),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, "mouseleave")),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {

        if (this.shapeType == ShapeType.FreeLine) {
          const rect = canvasEl.getBoundingClientRect();
          const position = {
            x: res[0].clientX - rect.left,
            y: res[0].clientY - rect.top
          };
          points.push(position);
        }
      });
  }

  private drawCircle(prevPos: Point, currentPos: Point) {
    const circleCommand = new CircleCommand(prevPos, currentPos, this.cx);
    this.undoCommands.length = 0;
    this.commands.push(circleCommand);
    this.executeCommands();
  }

  private drawRectangle(prevPos: Point, currentPos: Point) {
      const rectangleCommand = new RectangleCommand(prevPos, currentPos, this.cx);
      this.undoCommands.length = 0;
      this.commands.push(rectangleCommand);
      this.executeCommands();
  }

  private drawFree(points: Point[]) {
    const freeCommand = new FreeCommand(points, this.cx);
    this.undoCommands.length = 0;
    this.commands.push(freeCommand);
    this.executeCommands();
  }

  private clearScreen() {
    const eraseCommand = new EraseCommand(new Point(0,0), new Point(this.width, this.height), this.cx);
    this.undoCommands.length = 0;
    this.commands.push(eraseCommand);
    this.executeCommands();
  }

  private drawLine(prevPos: Point, currentPos: Point) {
    const drawLineCommand = new LineCommand(prevPos, currentPos, this.cx);
    this.undoCommands.length = 0;
    this.commands.push(drawLineCommand);
    this.executeCommands();
  }

  private executeCommands(): void {
    for (const command of this.commands){
      command.execute();
    }
  }
}