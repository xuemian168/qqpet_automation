package
{
   import flash.display.MovieClip;
   import flash.display.SimpleButton;
   import flash.events.MouseEvent;
   import flash.text.TextField;
   
   public dynamic class Panel extends MovieClip
   {
       
      
      public var BackBtn:SimpleButton;
      
      public var SureBtn:SimpleButton;
      
      public var CancelBtn:SimpleButton;
      
      public var Msg:TextField;
      
      public var QuitBtn:SimpleButton;
      
      public function Panel()
      {
         super();
      }
      
      public function panelSure(param1:MouseEvent) : *
      {
         this["parent"].sureFunction();
      }
      
      public function panelCancel(param1:MouseEvent) : *
      {
         this["parent"].cancelFunction();
      }
   }
}
