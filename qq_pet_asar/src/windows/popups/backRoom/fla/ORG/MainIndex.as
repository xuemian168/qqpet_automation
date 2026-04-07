package ORG
{
   import flash.display.Loader;
   import flash.display.MovieClip;
   import flash.events.Event;
   import flash.events.IOErrorEvent;
   import flash.events.ProgressEvent;
   import flash.events.TimerEvent;
   import flash.external.ExternalInterface;
   import flash.net.URLLoader;
   import flash.net.URLRequest;
   import flash.system.fscommand;
   import flash.utils.Timer;
   
   public class MainIndex extends MovieClip
   {
       
      
      private var _onLine:uint = 1;
      
      private var _urlRequest:URLRequest;
      
      private var _urlLoader:URLLoader;
      
      private var _loader:Loader;
      
      private var _loading:GameLoader;
      
      public var _gameLoader:MovieClip;
      
      private var blackFunction:Function;
      
      private var _urlString:String = "http://act.pet.qq.com/cgi-bin/duobaoqibin?cmd=";
      
      private var _panel;
      
      public var _xml:XML;
      
      public var sureFunction:Function;
      
      public var cancelFunction:Function;
      
      private var _myTime:Timer;
      
      private var _myObject:Object;
      
      private var _continu:Boolean = false;
      
      public var _playingQuit:uint = 0;
      
      public var gk:int;
      
      public var score:int;
      
      public var count:int;
      
      public var win:int = 0;
      
      public var uin:String;
      
      public var flag:String;
      
      public var jifen:String;
      
      public var baoshi:int;
      
      private var xg_mc:XGJM;
      
      private var dh_mc:DHJM;
      
      private var num:int = 0;
      
      public var level:int;
      
      public var kkk:int = 0;
      
      public var gk1:int;
      
      public var ggg:int = 0;
      
      public var key:uint = 0;
      
      public var key1:uint = 0;
      
      public var shu:int;
      
      public function MainIndex()
      {
         super();
         intro();
      }
      
      private function intro() : void
      {
         if(_onLine == 0)
         {
            _urlRequest = new URLRequest("qq_mstx.swf");
         }
         else
         {
            _urlRequest = new URLRequest("qq_mstx.swf");
         }
         _loader = new Loader();
         _loader.load(_urlRequest);
         _loading = new GameLoader();
         addChild(_loading);
         _loader.contentLoaderInfo.addEventListener(Event.COMPLETE,loaderComplete);
         _loader.contentLoaderInfo.addEventListener(ProgressEvent.PROGRESS,loaderProgress);
         _loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR,loaderError);
      }
      
      private function loaderComplete(param1:Event) : void
      {
         _gameLoader = param1.target.content as MovieClip;
         removeChild(_loading);
         _loading = null;
         addChildAt(_gameLoader,0);
         _loader.contentLoaderInfo.removeEventListener(Event.COMPLETE,loaderComplete);
         _loader.contentLoaderInfo.removeEventListener(ProgressEvent.PROGRESS,loaderProgress);
         _loader.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR,loaderError);
         CreatPanel();
      }
      
      private function loaderProgress(param1:ProgressEvent) : void
      {
         var _loc2_:* = Math.floor(param1.currentTarget.bytesLoaded / param1.currentTarget.bytesTotal * 100);
         _loading.bar.gotoAndStop(_loc2_);
      }
      
      private function loaderError(param1:IOErrorEvent) : *
      {
      }
      
      public function exit_Game() : void
      {
         fscommand("quit");
         if(ExternalInterface.available)
         {
            ExternalInterface.call("closeFrame");
         }
      }
      
      private function loadXML(param1:String, param2:Function) : *
      {
         _xml = new XML();
         _xml.ignoreWhitespace = false;
         _urlRequest = new URLRequest(param1);
         _urlLoader = new URLLoader(_urlRequest);
         blackFunction = param2;
         _urlLoader.addEventListener(Event.COMPLETE,xmlComplete);
      }
      
      private function xmlComplete(param1:Event) : *
      {
         _xml = XML(_urlLoader.data);
         _urlLoader.removeEventListener(Event.COMPLETE,xmlComplete);
         blackFunction();
      }
      
      private function CreatPanel() : *
      {
         _panel = new Panel();
         addChild(_panel);
      }
      
      private function funMyTime(param1:TimerEvent) : *
      {
         _xml = <root><msg>来玩的朋友太多了，我们待会再来吧。</msg></root>;
         _panel.gotoAndStop("SureFrame");
         sureFunction = c1;
      }
      
      public function sendXmlGame1() : *
      {
         var _loc1_:String = null;
         _panel.gotoAndStop("WaitFrame");
         _myTime = new Timer(10000,1);
         _myTime.addEventListener(TimerEvent.TIMER,funMyTime);
         _myTime.start();
         if(_onLine == 0)
         {
            _loc1_ = "cmd1.xml";
         }
         else
         {
            _loc1_ = "cmd1.xml";
         }
         loadXML(_loc1_,getXmlGame1);
         trace(_urlString + "1&id=qq_mstx&gate=" + gk + "&localtime=" + String(Math.random()));
      }
      
      private function getXmlGame1() : *
      {
         _myTime.removeEventListener(TimerEvent.TIMER,funMyTime);
         _gameLoader._qqSex = _xml.sex;
         _gameLoader._qqLevel = _xml.level;
         gk = _xml.gate;
         switch(Number(_xml.result))
         {
            case 0:
               if(gk == 1 || kkk == 1)
               {
                  if(gk == 1)
                  {
                     gk1 = 1;
                  }
                  _panel.gotoAndStop("SureBackFrame");
                  sureFunction = s8;
                  cancelFunction = c1;
                  num = 1;
               }
               else if(gk > 1)
               {
                  if(gk == 1)
                  {
                     gk1 = 1;
                  }
                  _panel.gotoAndStop(1);
                  num = 0;
                  s1();
               }
               break;
            case -1:
               _panel.gotoAndStop("SureFrame");
               sureFunction = c1;
               break;
            case 100:
               _panel.gotoAndStop("NQBFrame");
               sureFunction = c1;
               break;
            case 1:
               _panel.gotoAndStop("queFrame");
               gk1 = gk;
               sureFunction = s8;
         }
      }
      
      private function s1() : *
      {
         _panel.gotoAndStop(1);
         xg_mc = new XGJM();
         addChild(xg_mc);
         addChild(_panel);
      }
      
      private function s8() : *
      {
         sendXmlGame2();
         trace("sendxml2");
      }
      
      public function c1() : *
      {
         _panel.gotoAndStop(1);
         trace(_gameLoader.currentFrame);
         if(_gameLoader.currentFrame != 1)
         {
            _gameLoader.gotoAndStop(1);
         }
         if(_gameLoader.rws != null)
         {
            _gameLoader.removeChild(_gameLoader.rws);
            trace(444);
         }
      }
      
      public function c2() : *
      {
         _panel.gotoAndStop(1);
      }
      
      public function sendXmlGame2() : *
      {
         var _loc1_:String = null;
         _panel.gotoAndStop("WaitFrame");
         _myTime = new Timer(10000,1);
         _myTime.addEventListener(TimerEvent.TIMER,funMyTime);
         _myTime.start();
         if(_onLine == 0)
         {
            _loc1_ = "cmd2.xml";
         }
         else
         {
            _loc1_ = "cmd2.xml";
         }
         loadXML(_loc1_,getXmlGame2);
         trace(_urlString + "2&id=qq_mstx&gate=" + gk1 + "&localtime=" + String(Math.random()));
      }
      
      private function getXmlGame2() : *
      {
         _myTime.removeEventListener(TimerEvent.TIMER,funMyTime);
         uin = _xml.uin;
         gk = _xml.gate;
         flag = _xml.flag;
         switch(Number(_xml.result))
         {
            case 0:
               if(kkk == 1)
               {
                  kkk = 0;
                  removeChild(xg_mc);
               }
               _panel.gotoAndStop(1);
               stage.focus = stage;
               _gameLoader._playGameNow = 1;
               _gameLoader.num = 1;
               _gameLoader.jf1 = _xml.score;
               _gameLoader.gotoAndStop("L" + gk);
               break;
            case -1:
               _panel.gotoAndStop("SureFrame");
               sureFunction = c1;
               break;
            case 100:
               _panel.gotoAndStop("NQBFrame");
               sureFunction = c1;
               break;
            case 1:
               _panel.gotoAndStop("queFrame");
               sureFunction = c4;
         }
      }
      
      public function sendXmlGame3() : *
      {
         var _loc2_:String = null;
         _panel.gotoAndStop("WaitFrame");
         _myTime = new Timer(10000,1);
         _myTime.addEventListener(TimerEvent.TIMER,funMyTime);
         _myTime.start();
         var _loc1_:String = String(_gameLoader.jf1);
         if(Number(_loc1_) > 99999)
         {
            _loc1_ = "99999";
         }
         _myObject = Algorithm.encrypt(_loc1_,flag,uin);
         if(_onLine == 0)
         {
            _loc2_ = "cmd3.xml";
         }
         else
         {
            _loc2_ = "cmd3.xml";
         }
         loadXML(_loc2_,getXmlGame3);
         trace(_urlString + "3&id=qq_mstx&gate=" + _gameLoader.gk + "&info=" + _myObject._SCORE + "&score=" + _myObject._FLAG + "&localtime=" + String(Math.random()));
      }
      
      private function getXmlGame3() : *
      {
         _myTime.removeEventListener(TimerEvent.TIMER,funMyTime);
         uin = _xml.uin;
         gk = _xml.gate;
         flag = _xml.flag;
         switch(Number(_xml.result))
         {
            case 0:
               _gameLoader.jf1 = _xml.score;
               if(win == 0)
               {
                  _gameLoader.jf1 = _xml.score;
                  _panel.gotoAndStop("10");
                  sureFunction = s6;
                  cancelFunction = c4;
               }
               else
               {
                  win = 0;
                  _gameLoader.jf1 = _xml.score;
                  _panel.gotoAndStop("queFrame");
                  sureFunction = c1;
               }
               break;
            case -1:
               _panel.gotoAndStop("SureFrame");
               sureFunction = c1;
               break;
            case 100:
               _panel.gotoAndStop("NQBFrame");
               sureFunction = c1;
               break;
            case 1:
               _panel.gotoAndStop("queFrame");
               sureFunction = c4;
         }
      }
      
      public function sendXmlGame4() : *
      {
         var _loc2_:String = null;
         _panel.gotoAndStop("WaitFrame");
         _myTime = new Timer(10000,1);
         _myTime.addEventListener(TimerEvent.TIMER,funMyTime);
         _myTime.start();
         var _loc1_:String = String(_gameLoader.jf1);
         if(Number(_loc1_) > 99999)
         {
            _loc1_ = "99999";
         }
         _myObject = Algorithm.encrypt(_loc1_,flag,uin);
         if(_onLine == 0)
         {
            _loc2_ = "cmd4.xml";
         }
         else
         {
            _loc2_ = "cmd4.xml";
         }
         loadXML(_loc2_,getXmlGame4);
         trace(_urlString + "4&id=qq_mstx&gate=" + _gameLoader.gk + "&info=" + _myObject._SCORE + "&score=" + _myObject._FLAG + "&localtime=" + String(Math.random()));
      }
      
      private function getXmlGame4() : *
      {
         _myTime.removeEventListener(TimerEvent.TIMER,funMyTime);
         gk = _xml.gate;
         switch(Number(_xml.result))
         {
            case 0:
               _panel.gotoAndStop(1);
               _gameLoader.gotoAndStop("over2");
               break;
            case -1:
               _panel.gotoAndStop("SureFrame");
               sureFunction = c1;
               break;
            case 100:
               _panel.gotoAndStop("NQBFrame");
               sureFunction = c1;
               break;
            case 1:
               _panel.gotoAndStop("queFrame");
               sureFunction = c4;
         }
      }
      
      public function sendXmlGame5() : *
      {
         var _loc1_:String = null;
         _panel.gotoAndStop("WaitFrame");
         _myTime = new Timer(10000,1);
         _myTime.addEventListener(TimerEvent.TIMER,funMyTime);
         _myTime.start();
         if(_onLine == 0)
         {
            _loc1_ = "cmd5.xml";
         }
         else
         {
            _loc1_ = "cmd5.xml";
         }
         loadXML(_loc1_,getXmlGame5);
         trace(_urlString + "5&id=qq_mstx&gate=" + _gameLoader.gk + "&localtime=" + String(Math.random()));
      }
      
      private function getXmlGame5() : *
      {
         _myTime.removeEventListener(TimerEvent.TIMER,funMyTime);
         uin = _xml.uin;
         gk = _xml.gate;
         flag = _xml.flag;
         count = _xml.count;
         switch(Number(_xml.result))
         {
            case 0:
               _panel.gotoAndStop(1);
               stage.focus = stage;
               _gameLoader._playGameNow = 1;
               _gameLoader.num = 1;
               _gameLoader.jf1 = _xml.score;
               _gameLoader.gotoAndStop("L" + gk);
               _gameLoader.smz = 1;
               break;
            case -1:
               _panel.gotoAndStop("SureFrame");
               sureFunction = c1;
               break;
            case -2:
               _panel.gotoAndStop("SureBackFrame");
               sureFunction = s5;
               cancelFunction = c1;
               break;
            case 100:
               _panel.gotoAndStop("NQBFrame");
               sureFunction = c1;
               break;
            case 1:
               _panel.gotoAndStop("queFrame");
               sureFunction = c4;
         }
      }
      
      public function sendXmlGame6() : *
      {
         var _loc2_:String = null;
         _panel.gotoAndStop("WaitFrame");
         _myTime = new Timer(10000,1);
         _myTime.addEventListener(TimerEvent.TIMER,funMyTime);
         _myTime.start();
         var _loc1_:String = String(_gameLoader.jf1);
         if(Number(_loc1_) > 99999)
         {
            _loc1_ = "99999";
         }
         if(_playingQuit == 0)
         {
            _myObject = Algorithm.encrypt(_loc1_,flag,uin);
         }
         else
         {
            _myObject = Algorithm.encrypt("0",flag,uin);
         }
         if(_onLine == 0)
         {
            _loc2_ = "cmd6.xml";
         }
         else
         {
            _loc2_ = "cmd6.xml";
         }
         loadXML(_loc2_,getXmlGame6);
         trace(_urlString + "6&id=qq_mstx&gate=" + _gameLoader.gk + "&info=" + _myObject._SCORE + "&score=" + _myObject._FLAG + "&localtime=" + String(Math.random()));
      }
      
      private function getXmlGame6() : *
      {
         _myTime.removeEventListener(TimerEvent.TIMER,funMyTime);
         uin = _xml.uin;
         gk = _xml.gate;
         flag = _xml.flag;
         switch(Number(_xml.result))
         {
            case 0:
               if(_playingQuit == 0)
               {
                  _panel.gotoAndStop("SureQuitFrame");
                  gk = _xml.gate;
                  sureFunction = s3;
                  cancelFunction = c3;
               }
               else if(_playingQuit == 1)
               {
                  _panel.gotoAndStop(1);
                  _playingQuit = 0;
                  trace("44444444444");
                  c3();
               }
               break;
            case -1:
               _panel.gotoAndStop("SureFrame");
               sureFunction = c1;
               break;
            case 100:
               _panel.gotoAndStop("NQBFrame");
               sureFunction = c1;
               break;
            case 1:
               _panel.gotoAndStop("queFrame");
               sureFunction = c4;
         }
      }
      
      public function sendXmlGame7() : *
      {
         var _loc1_:String = null;
         _panel.gotoAndStop("WaitFrame");
         _myTime = new Timer(10000,1);
         _myTime.addEventListener(TimerEvent.TIMER,funMyTime);
         _myTime.start();
         if(_onLine == 0)
         {
            _loc1_ = "cmd7.xml";
         }
         else
         {
            _loc1_ = "cmd7.xml";
         }
         loadXML(_loc1_,getXmlGame7);
         trace(_urlString + "7&id=qq_mstx&gate=" + _gameLoader.gk + "&count=" + count + "&localtime=" + String(Math.random()));
      }
      
      private function getXmlGame7() : *
      {
         _myTime.removeEventListener(TimerEvent.TIMER,funMyTime);
         count = _xml.count;
         uin = _xml.uin;
         gk = _xml.gate;
         flag = _xml.flag;
         switch(Number(_xml.result))
         {
            case 0:
               _panel.gotoAndStop(1);
               stage.focus = stage;
               _gameLoader._playGameNow = 1;
               gk = _xml.gate;
               _gameLoader.num = 1;
               _gameLoader.jf1 = _xml.score;
               _gameLoader.gotoAndStop("L" + gk);
               _gameLoader.smz = 1;
               break;
            case -1:
               _panel.gotoAndStop("SureFrame");
               sureFunction = c1;
               break;
            case 100:
               _panel.gotoAndStop("NQBFrame");
               sureFunction = c1;
               break;
            case 1:
               _panel.gotoAndStop("queFrame");
               sureFunction = c4;
         }
      }
      
      public function sendXmlGame8() : *
      {
         var _loc1_:String = null;
         _panel.gotoAndStop("WaitFrame");
         _myTime = new Timer(10000,1);
         _myTime.addEventListener(TimerEvent.TIMER,funMyTime);
         _myTime.start();
         if(_onLine == 0)
         {
            _loc1_ = "cmd8.xml";
         }
         else
         {
            _loc1_ = "cmd8.xml";
         }
         loadXML(_loc1_,getXmlGame8);
         trace(_urlString + "8&id=qq_mstx&gate=" + _gameLoader.gk + "&localtime=" + String(Math.random()));
      }
      
      private function getXmlGame8() : *
      {
         _myTime.removeEventListener(TimerEvent.TIMER,funMyTime);
         uin = _xml.uin;
         flag = _xml.flag;
         switch(Number(_xml.result))
         {
            case 0:
               _panel.gotoAndStop(11);
               cancelFunction = c4;
               break;
            case -1:
               _panel.gotoAndStop("SureFrame");
               sureFunction = c1;
               break;
            case 100:
               _panel.gotoAndStop("NQBFrame");
               sureFunction = c9;
               break;
            case 1:
               _panel.gotoAndStop("queFrame");
               sureFunction = c4;
         }
      }
      
      public function sendXmlGame12() : *
      {
         var _loc1_:String = null;
         _panel.gotoAndStop("WaitFrame");
         _myTime = new Timer(10000,1);
         _myTime.addEventListener(TimerEvent.TIMER,funMyTime);
         _myTime.start();
         if(_onLine == 0)
         {
            _loc1_ = "cmd9.xml";
         }
         else
         {
            _loc1_ = "cmd9.xml";
         }
         loadXML(_loc1_,getXmlGame12);
         trace(_urlString + "9&id=qq_mstx&level=" + 10 + "&localtime=" + String(Math.random()));
      }
      
      private function getXmlGame12() : *
      {
         _myTime.removeEventListener(TimerEvent.TIMER,funMyTime);
         baoshi = _xml.count;
         _gameLoader._qqSex = _xml.sex;
         _gameLoader._qqLevel = _xml.level;
         switch(Number(_xml.result))
         {
            case 0:
               if(key1 == 1)
               {
                  trace(baoshi);
                  if(baoshi == -5)
                  {
                     baoshi = 0;
                  }
                  _gameLoader._page.loveRock(baoshi);
                  _gameLoader._page.openPresent();
                  _panel.gotoAndStop(1);
               }
               else
               {
                  _panel.gotoAndStop("queFrame");
                  sureFunction = s10;
               }
               break;
            case -1:
               _panel.gotoAndStop("SureFrame");
               sureFunction = c1;
               break;
            case 100:
               _panel.gotoAndStop("NQBFrame");
               sureFunction = c1;
               break;
            case 1:
               _panel.gotoAndStop("queFrame");
               sureFunction = c4;
         }
      }
      
      public function sendXmlGame9() : *
      {
         var _loc1_:String = null;
         _panel.gotoAndStop("WaitFrame");
         _myTime = new Timer(10000,1);
         _myTime.addEventListener(TimerEvent.TIMER,funMyTime);
         _myTime.start();
         if(_onLine == 0)
         {
            _loc1_ = "cmd9.xml";
         }
         else
         {
            _loc1_ = "cmd9.xml";
         }
         loadXML(_loc1_,getXmlGame9);
         trace(_urlString + "9&id=qq_mstx&level=" + level + "&localtime=" + String(Math.random()));
      }
      
      private function getXmlGame9() : *
      {
         _myTime.removeEventListener(TimerEvent.TIMER,funMyTime);
         baoshi = _xml.baoshi;
         _gameLoader._qqSex = _xml.sex;
         _gameLoader._qqLevel = _xml.level;
         switch(Number(_xml.result))
         {
            case 0:
               if(key1 == 1)
               {
                  _gameLoader._page.loveRock(baoshi);
                  _gameLoader._page.openPresent();
                  _panel.gotoAndStop(1);
               }
               else
               {
                  _panel.gotoAndStop("queFrame");
                  sureFunction = s10;
               }
               break;
            case -1:
               _panel.gotoAndStop("SureFrame");
               sureFunction = c1;
               break;
            case 100:
               _panel.gotoAndStop("NQBFrame");
               sureFunction = c1;
               break;
            case 1:
               _panel.gotoAndStop("queFrame");
               sureFunction = c4;
         }
      }
      
      public function sendXmlGame10() : *
      {
         var _loc1_:String = null;
         _panel.gotoAndStop("WaitFrame");
         _myTime = new Timer(10000,1);
         _myTime.addEventListener(TimerEvent.TIMER,funMyTime);
         _myTime.start();
         if(_onLine == 0)
         {
            _loc1_ = "cmd10.xml";
         }
         else
         {
            _loc1_ = "cmd10.xml";
         }
         loadXML(_loc1_,getXmlGame10);
         trace(_urlString + "10&id=qq_mstx&gate=" + _gameLoader.gk + "&localtime=" + String(Math.random()));
      }
      
      private function getXmlGame10() : *
      {
         _myTime.removeEventListener(TimerEvent.TIMER,funMyTime);
         uin = _xml.uin;
         gk = _xml.gate;
         flag = _xml.flag;
         switch(Number(_xml.result))
         {
            case 0:
               _panel.gotoAndStop(1);
               stage.focus = stage;
               _gameLoader.start_game();
               break;
            case -1:
               _panel.gotoAndStop("SureFrame");
               sureFunction = c1;
               break;
            case 100:
               _panel.gotoAndStop("NQBFrame");
               sureFunction = c1;
               break;
            case 1:
               _panel.gotoAndStop("queFrame");
               sureFunction = c4;
         }
      }
      
      public function sendXmlGame11() : *
      {
         var _loc1_:String = null;
         _panel.gotoAndStop("WaitFrame");
         _myTime = new Timer(10000,1);
         _myTime.addEventListener(TimerEvent.TIMER,funMyTime);
         _myTime.start();
         if(_onLine == 0)
         {
            _loc1_ = "cmd11.xml";
         }
         else
         {
            _loc1_ = "cmd11.xml";
         }
         loadXML(_loc1_,getXmlGame11);
         trace(_urlString + "11&id=qq_mstx&localtime=" + String(Math.random()));
      }
      
      private function getXmlGame11() : *
      {
         _myTime.removeEventListener(TimerEvent.TIMER,funMyTime);
         _gameLoader._qqSex = _xml.sex;
         _gameLoader._qqLevel = _xml.level;
         jifen = _xml.jifen;
         baoshi = _xml.baoshi;
         switch(Number(_xml.result))
         {
            case 0:
               jifen = _xml.jifen;
               baoshi = _xml.baoshi;
               _panel.gotoAndStop(1);
               if(key == 1)
               {
                  key = 0;
                  key1 = 1;
                  _gameLoader.createPlayingpage();
                  _gameLoader._page.loveRock(baoshi);
               }
               else
               {
                  key1 = 0;
                  dh_mc = new DHJM();
                  addChild(dh_mc);
                  addChild(_panel);
               }
               break;
            case -1:
               _panel.gotoAndStop("SureFrame");
               sureFunction = c1;
               break;
            case 100:
               _panel.gotoAndStop("NQBFrame");
               sureFunction = c1;
               break;
            case 1:
               _panel.gotoAndStop("queFrame");
               sureFunction = c4;
         }
      }
      
      private function s3() : *
      {
         sendXmlGame1();
      }
      
      private function s4() : *
      {
         sendXmlGame5();
      }
      
      private function s5() : *
      {
         sendXmlGame7();
      }
      
      private function s6() : *
      {
         _panel.gotoAndStop("SureBackFrame");
         ggg = 1;
         sureFunction = s11;
         cancelFunction = c8;
      }
      
      private function s7() : *
      {
         sendXmlGame6();
      }
      
      private function c4() : *
      {
         _panel.gotoAndStop(1);
         stage.focus = stage;
         _gameLoader._playGameNow = 1;
         _gameLoader.num = 1;
         trace("&&&&&&&&&" + _xml.score);
         _gameLoader.gotoAndStop("L" + gk);
         if(_gameLoader.rws != null)
         {
            _gameLoader.removeChild(_gameLoader.rws);
         }
      }
      
      public function c3() : *
      {
         if(ExternalInterface.available)
         {
            ExternalInterface.call("closeFrame");
         }
      }
      
      public function c5() : *
      {
         if(_gameLoader.guanka == 1 && _gameLoader.si == 0)
         {
            _gameLoader.Start_Game1();
         }
         else if(_gameLoader.guanka == 2 && _gameLoader.si == 0)
         {
            _gameLoader.Start_Game2();
         }
         else if(_gameLoader.guanka == 3 && _gameLoader.si == 0)
         {
            _gameLoader.Start_Game3();
         }
         else if(_gameLoader.guanka == 4 && _gameLoader.si == 0)
         {
            _gameLoader.Start_Game4();
         }
         else if(_gameLoader.guanka == 5 && _gameLoader.si == 0)
         {
            _gameLoader.Start_Game5();
         }
         else if(_gameLoader.guanka == 6 && _gameLoader.si == 0)
         {
            _gameLoader.Start_Game6();
         }
         else if(_gameLoader.guanka == 7 && _gameLoader.si == 0)
         {
            _gameLoader.Start_Game7();
         }
         else if(_gameLoader.guanka == 8 && _gameLoader.si == 0)
         {
            _gameLoader.Start_Game8();
         }
         else if(_gameLoader.guanka == 9 && _gameLoader.si == 0)
         {
            _gameLoader.Start_Game9();
         }
         else if(_gameLoader.guanka == 10 && _gameLoader.si == 0)
         {
            _gameLoader.Start_Game10();
         }
         else if(_gameLoader.si == 1)
         {
            _gameLoader.jg_mc.over_mc.play();
         }
         else if(_gameLoader.si == 3)
         {
            _gameLoader.win_mc.stop();
         }
      }
      
      private function c6() : *
      {
         _panel.gotoAndStop(1);
         removeChild(xg_mc);
         stage.focus = stage;
         _gameLoader._playGameNow = 1;
         _gameLoader.jf1 = _xml.score;
         _gameLoader.num = 1;
         _gameLoader.gotoAndStop("L" + gk);
      }
      
      public function c7() : *
      {
         _panel.gotoAndStop(1);
         removeChild(xg_mc);
         kkk = 0;
         _gameLoader.gotoAndStop(1);
         if(_gameLoader.currentFrame != 1)
         {
            _gameLoader.gotoAndStop(1);
            if(_gameLoader.rws != null)
            {
               _gameLoader.removeChild(_gameLoader.rws);
            }
         }
      }
      
      public function s10() : *
      {
         _panel.gotoAndStop(1);
         if(dh_mc)
         {
            removeChild(dh_mc);
         }
      }
      
      public function s11() : *
      {
         ggg = 0;
         sendXmlGame8();
      }
      
      public function c8() : *
      {
         ggg = 0;
         _panel.gotoAndStop("10");
         sureFunction = s6;
         cancelFunction = c4;
      }
      
      public function c9() : *
      {
         _panel.gotoAndStop(11);
         cancelFunction = c4;
      }
      
      public function loveStones3() : *
      {
         if(baoshi >= 5)
         {
            sendXmlGame12();
         }
         else
         {
            _xml = <root><msg>Q宠宝贝，你的爱情石数量不足5个，需要支付3Q币（优先扣除宠物券）即可获得神秘奖励哦，您确认支付吗？</msg></root>;
            _panel.gotoAndStop("SureBackFrame");
            sureFunction = sureXML3;
            cancelFunction = c2;
         }
      }
      
      private function sureXML3() : *
      {
         trace("确定用Q币抽奖！！");
         sendXmlGame12();
      }
      
      public function loveStones4() : *
      {
         _panel.gotoAndStop("queFrame");
         _gameLoader._page.createEvent();
         sureFunction = c2;
      }
   }
}
