import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { ShapeType } from '../models/shape-type';
import { Point } from '../models/point';
import { Drawing } from '../drawing/drawing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit{
  @ViewChild('canvas', {static: false}) public canvasElement: ElementRef;

  @Input() public width = 700;
  @Input() public height = 700;

  private shapeType: ShapeType = ShapeType.FreeLine;

  private drawing: Drawing;

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvasElement.nativeElement;
    const canvas = canvasEl.getContext("2d");

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    canvas.lineWidth = 3;
    canvas.lineCap = "round";
    canvas.strokeStyle = "#000";

    this.drawing = new Drawing(canvas);

    this.captureEvents(canvasEl);
  }

  public rectangle(): void {
    this.shapeType = ShapeType.Rectangle;
  }

  public circle(): void {
    this.shapeType = ShapeType.Circle;
  }

  public free(): void {
    this.shapeType = ShapeType.FreeLine;
  }

  public clear(): void {
    this.clearScreen();
  }
  
  public undo(): void {
    // TODO : Create Undo
  }

  public redo(): void {
    // TODO : Create Redo
  }

  private drawRectangle(prevPos: Point, currentPos: Point) {
      this.drawing.drawRectangle(prevPos, currentPos);
  }

  private drawFree(points: Point[]) {
    this.drawing.drawFreeForm(points);
  }

  private clearScreen() {
    this.drawing.erase(new Point(0, 0), new Point(this.width, this.height));
  }

  private drawCircle(prevPos: Point, currentPos: Point) {
    // TODO : Create Draw Circle
  }

  // Ugly code this doesn't have anything to do with the pattern right now so I'm not gonna clean it up
  private captureEvents(canvasEl: HTMLCanvasElement) {
    let startPosition:Point = null;
    let points: Point[] = [];

    canvasEl.addEventListener("mouseup", e => {
      const rect = canvasEl.getBoundingClientRect();
      const currentPos:Point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      if (this.shapeType == ShapeType.Circle) {
        this.drawCircle(startPosition, currentPos);
      }
      else if (this.shapeType == ShapeType.Rectangle) {
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