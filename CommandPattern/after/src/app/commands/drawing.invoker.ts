import { ICommand } from './icommand';


export class DrawingInvoker {

    commands: ICommand[] = [];

    undoneCommands: ICommand[] = [];

    constructor(private canvas: CanvasRenderingContext2D, private width:number, private height:number) { }

    public draw(command: ICommand) {
        this.undoneCommands.length = 0;
        command.execute(this.canvas);
        this.commands.push(command);
    }

    public undo(): void {
        if (this.commands.length > 0) {
          let poppedCommand = this.commands.pop();
          this.undoneCommands.push(poppedCommand);
          this.canvas.clearRect(0, 0,this.width, this.height);
          this.execute();
        }
    }
    
    public redo(): void {
        if (this.undoneCommands.length > 0) {
          let poppedCommand = this.undoneCommands.pop();
          this.commands.push(poppedCommand);
          this.canvas.clearRect(0, 0,this.width, this.height);
          this.execute();
        }
      } 


    public execute(): void {
        for (const command of this.commands){
          command.execute(this.canvas);
        }
    }
}