package
{
   import flash.display.MovieClip;
   import flash.display.SimpleButton;
   import flash.events.MouseEvent;
   import flash.text.TextField;
   
   public dynamic class DHJM extends MovieClip
   {
       
      
      public var fc_mc:MovieClip;
      
      public var _btn1:SimpleButton;
      
      public var _btn2:SimpleButton;
      
      public var _btn3:SimpleButton;
      
      public var btn1:SimpleButton;
      
      public var bs_txt:TextField;
      
      public var _btn4:SimpleButton;
      
      public var btn2:SimpleButton;
      
      public var _btn5:SimpleButton;
      
      public var btn3:SimpleButton;
      
      public var fh_btn:SimpleButton;
      
      public var _btn6:SimpleButton;
      
      public var btn4:SimpleButton;
      
      public var btn5:SimpleButton;
      
      public var btn6:SimpleButton;
      
      public var jf_txt:TextField;
      
      public var _playGameNow:int;
      
      public function DHJM()
      {
         super();
      }
      
      public function dh1(param1:MouseEvent) : void
      {
         parent["level"] = 1;
         this["parent"].sendXmlGame9();
      }
      
      public function dh2(param1:MouseEvent) : void
      {
         parent["level"] = 2;
         this["parent"].sendXmlGame9();
      }
      
      public function dh3(param1:MouseEvent) : void
      {
         parent["level"] = 3;
         this["parent"].sendXmlGame9();
      }
      
      public function dh4(param1:MouseEvent) : void
      {
         parent["level"] = 4;
         this["parent"].sendXmlGame9();
      }
      
      public function dh5(param1:MouseEvent) : void
      {
         parent["level"] = 5;
         this["parent"].sendXmlGame9();
      }
      
      public function dh6(param1:MouseEvent) : void
      {
         parent["level"] = 6;
         this["parent"].sendXmlGame9();
      }
      
      public function fh(param1:MouseEvent) : *
      {
         this["parent"].s10();
      }
      
      public function fc1(param1:MouseEvent) : *
      {
         fc_mc.gotoAndStop(1);
      }
      
      public function fc2(param1:MouseEvent) : *
      {
         fc_mc.gotoAndStop(2);
      }
      
      public function fc3(param1:MouseEvent) : *
      {
         fc_mc.gotoAndStop(3);
      }
      
      public function fc4(param1:MouseEvent) : *
      {
         fc_mc.gotoAndStop(4);
      }
      
      public function fc5(param1:MouseEvent) : *
      {
         fc_mc.gotoAndStop(5);
      }
      
      public function fc6(param1:MouseEvent) : *
      {
         fc_mc.gotoAndStop(8);
      }
      
      public function fc7(param1:MouseEvent) : *
      {
         fc_mc.gotoAndStop(9);
      }
   }
}
