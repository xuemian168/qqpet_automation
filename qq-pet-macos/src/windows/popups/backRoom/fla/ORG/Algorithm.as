package ORG
{
   public class Algorithm
   {
       
      
      public function Algorithm()
      {
         super();
      }
      
      public static function encrypt(param1:String, param2:String, param3:String) : Object
      {
         var _loc4_:Object = new Object();
         var _loc5_:int = int(param2);
         var _loc6_:int = (137 * Math.pow(_loc5_,3) + 617 * Math.pow(_loc5_,2) + 997) % 61;
         var _loc7_:Array = new Array();
         var _loc8_:uint = 0;
         while(_loc8_ < 5)
         {
            if(param1.length > _loc8_)
            {
               _loc7_.push(param1.charCodeAt(_loc8_));
            }
            else
            {
               _loc7_.unshift(48);
            }
            _loc8_++;
         }
         var _loc9_:Array = new Array();
         var _loc10_:String = param3.substr(param3.length - 5,5);
         _loc8_ = 0;
         while(_loc8_ < 5)
         {
            _loc9_.push(_loc10_.charCodeAt(_loc8_));
            _loc8_++;
         }
         var _loc11_:Array = new Array();
         _loc8_ = 0;
         while(_loc8_ < 5)
         {
            _loc11_.push(_loc7_[_loc8_]);
            _loc11_.push(_loc9_[_loc8_]);
            _loc8_++;
         }
         var _loc12_:Array = new Array();
         _loc8_ = 0;
         while(_loc8_ < 5)
         {
            _loc12_.push(changeString(_loc11_[_loc8_] + _loc11_[_loc11_.length - _loc8_ - 1]));
            _loc12_.push(changeString(_loc11_[_loc8_] - _loc11_[_loc11_.length - _loc8_ - 1] + 100));
            _loc8_++;
         }
         _loc4_._FLAG = _loc6_;
         _loc4_._SCORE = _loc12_.join("");
         return _loc4_;
      }
      
      private static function changeString(param1:int) : String
      {
         var _loc2_:String = param1.toString();
         var _loc3_:uint = 0;
         while(_loc3_ < 3 - _loc2_.length)
         {
            _loc2_ = "0" + _loc2_;
            _loc3_++;
         }
         return _loc2_;
      }
   }
}
