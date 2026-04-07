package
{
   import flash.display.MovieClip;
   import flash.display.SimpleButton;
   import flash.events.MouseEvent;
   
   public dynamic class XGJM extends MovieClip
   {
       
      
      public var btn1:MovieClip;
      
      public var btn10:MovieClip;
      
      public var btn2:MovieClip;
      
      public var fh_btn:SimpleButton;
      
      public var btn3:MovieClip;
      
      public var btn4:MovieClip;
      
      public var btn5:MovieClip;
      
      public var btn6:MovieClip;
      
      public var btn7:MovieClip;
      
      public var btn8:MovieClip;
      
      public var btn9:MovieClip;
      
      public var _playGameNow:int;
      
      public function XGJM()
      {
         super();
      }
      
      public function dh1(param1:MouseEvent) : void
      {
         parent["gk"] = 1;
         parent["gk1"] = 1;
         parent["kkk"] = 1;
         this["parent"].sendXmlGame1();
      }
      
      public function dh2(param1:MouseEvent) : void
      {
         parent["gk"] = 2;
         parent["gk1"] = 2;
         parent["kkk"] = 1;
         this["parent"].sendXmlGame1();
      }
      
      public function dh3(param1:MouseEvent) : void
      {
         parent["gk"] = 3;
         parent["gk1"] = 3;
         parent["kkk"] = 1;
         this["parent"].sendXmlGame1();
      }
      
      public function dh4(param1:MouseEvent) : void
      {
         parent["gk"] = 4;
         parent["gk1"] = 4;
         parent["kkk"] = 1;
         this["parent"].sendXmlGame1();
      }
      
      public function dh5(param1:MouseEvent) : void
      {
         parent["gk"] = 5;
         parent["gk1"] = 5;
         parent["kkk"] = 1;
         this["parent"].sendXmlGame1();
      }
      
      public function dh6(param1:MouseEvent) : void
      {
         parent["gk"] = 6;
         parent["gk1"] = 6;
         parent["kkk"] = 1;
         this["parent"].sendXmlGame1();
      }
      
      public function dh7(param1:MouseEvent) : void
      {
         parent["gk"] = 7;
         parent["gk1"] = 7;
         parent["kkk"] = 1;
         this["parent"].sendXmlGame1();
      }
      
      public function dh8(param1:MouseEvent) : void
      {
         parent["gk"] = 8;
         parent["gk1"] = 8;
         parent["kkk"] = 1;
         this["parent"].sendXmlGame1();
      }
      
      public function dh9(param1:MouseEvent) : void
      {
         parent["gk"] = 9;
         parent["gk1"] = 9;
         parent["kkk"] = 1;
         this["parent"].sendXmlGame1();
      }
      
      public function dh10(param1:MouseEvent) : void
      {
         parent["gk"] = 10;
         parent["gk1"] = 10;
         parent["kkk"] = 1;
         this["parent"].sendXmlGame1();
      }
      
      public function fh(param1:MouseEvent) : *
      {
         this["parent"].c7();
      }
      
      public function playingQuit2() : *
      {
         this["parent"]._gameLoader.playingQuit2();
      }
   }
}
