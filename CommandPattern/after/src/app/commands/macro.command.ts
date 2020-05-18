import { ICommand } from './icommand';


export class MacroCommand {

    private commands: ICommand[] = [];

    private undoCommands: ICommand[] = [];

    constructor(private canvas: CanvasRenderingContext2D, private width:number, private height:number) { }

    public add(command: ICommand) {
        this.undoCommands.length = 0;
        this.commands.push(command);
        this.executeCommands();
    }

    public undo(): void {
        if (this.commands.length > 0) {
          let poppedCommand = this.commands.pop();
          this.undoCommands.push(poppedCommand);
          this.canvas.clearRect(0, 0,this.width, this.height);
          this.executeCommands();
        }
    }
    
    public redo(): void {
        if (this.undoCommands.length > 0) {
          let poppedCommand = this.undoCommands.pop();
          this.commands.push(poppedCommand);
          this.canvas.clearRect(0, 0,this.width, this.height);
          this.executeCommands();
        }
      } 


    public executeCommands(): void {
        for (const command of this.commands){
          command.execute(this.canvas);
        }
    }
}