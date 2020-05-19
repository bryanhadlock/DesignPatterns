import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { ShapeType } from '../models/shape-type';
import { Point } from '../models/point';
import { LineCommand } from '../commands/line.command';
import { EraseCommand } from '../commands/erase.command';
import { RectangleCommand } from '../commands/rectangle.command';
import { CircleCommand } from '../commands/circle.command';
import { FreeCommand } from '../commands/free.command';
import { DrawingInvoker } from '../commands/drawing.invoker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit{
  @ViewChild('canvas', {static: false}) public canvasElement: ElementRef;

  @Input() public width = 700;
  @Input() public height = 700;

  private shapeType: ShapeType = ShapeType.FreeLine;

  private drawing: DrawingInvoker;

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvasElement.nativeElement;
    const canvas = canvasEl.getContext("2d");

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    canvas.lineWidth = 3;
    canvas.lineCap = "round";
    canvas.strokeStyle = "#000";

    this.drawing = new DrawingInvoker(canvas, this.width, this.height);

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
    this.drawing.undo();
  }

  public redo(): void {
    this.drawing.redo();
  }

  private drawCircle(prevPos: Point, currentPos: Point) {
    const circleCommand = new CircleCommand(prevPos, currentPos);
    this.drawing.add(circleCommand);
  }

  private drawRectangle(prevPos: Point, currentPos: Point) {
      const rectangleCommand = new RectangleCommand(prevPos, currentPos);
      this.drawing.add(rectangleCommand);
  }

  private drawFree(points: Point[]) {
    const freeCommand = new FreeCommand(points);
    this.drawing.add(freeCommand);
  }

  private clearScreen() {
    const eraseCommand = new EraseCommand(new Point(0,0), new Point(this.width, this.height));
    this.drawing.add(eraseCommand);
  }

  private drawLine(prevPos: Point, currentPos: Point) {
    const drawLineCommand = new LineCommand(prevPos, currentPos);
    this.drawing.add(drawLineCommand);
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
}