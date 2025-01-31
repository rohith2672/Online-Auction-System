function refreshTime() {
    const timeDisplay = document.getElementById("time");
    const dateString = new Date().toLocaleString();
    const formattedString = dateString.replace(", ", " - ");
    timeDisplay.textContent = formattedString;
  }
    setInterval(refreshTime, 100);
    function Signin(){
      window.location.href="UserLogin.html";
    }

    let countDownDate1=new Date('2022-12-20 12:45:00');
    let countDownDate2=new Date('2022-12-20 02:00:00');
    let countDownDate3=new Date('2022-12-20 05:00:00');
    let countDownDate4=new Date('2022-12-20 01:30:00');
           var myfunc = setInterval(function() {

var now = new Date().getTime();
var timeleft = countDownDate1 - now;
    
// Calculating the days, hours, minutes and seconds left
var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
    
// Result is output to the specific element
document.getElementById("days1").innerHTML = days + "d "
document.getElementById("hours1").innerHTML = hours + "h " 
document.getElementById("minutes1").innerHTML = minutes + "m " 
document.getElementById("seconds1").innerHTML = seconds + "s " 
    
// Display the message when countdown is over
if (timeleft < 0) {
    clearInterval(myfunc);
    document.getElementById("days1").innerHTML = ""
    document.getElementById("hours1").innerHTML = "" 
    document.getElementById("minutes1").innerHTML = ""
    document.getElementById("seconds1").innerHTML = ""
    document.getElementById("end").innerHTML = "TIME UP!!";
}
},500);
var myfunc = setInterval(function() {

  var now = new Date().getTime();
  var timeleft = countDownDate2 - now;
      
  // Calculating the days, hours, minutes and seconds left
  var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
      
  // Result is output to the specific element
  document.getElementById("days2").innerHTML = days + "d "
  document.getElementById("hours2").innerHTML = hours + "h " 
  document.getElementById("minutes2").innerHTML = minutes + "m " 
  document.getElementById("seconds2").innerHTML = seconds + "s " 
      
  // Display the message when countdown is over
  if (timeleft < 0) {
      clearInterval(myfunc);
      document.getElementById("days2").innerHTML = ""
      document.getElementById("hours2").innerHTML = "" 
      document.getElementById("minutes2").innerHTML = ""
      document.getElementById("seconds2").innerHTML = ""
      document.getElementById("end").innerHTML = "TIME UP!!";
  }
  },500);
  var myfunc = setInterval(function() {

    var now = new Date().getTime();
    var timeleft = countDownDate3 - now;
        
    // Calculating the days, hours, minutes and seconds left
    var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
        
    // Result is output to the specific element
    document.getElementById("days3").innerHTML = days + "d "
    document.getElementById("hours3").innerHTML = hours + "h " 
    document.getElementById("minutes3").innerHTML = minutes + "m " 
    document.getElementById("seconds3").innerHTML = seconds + "s " 
        
    // Display the message when countdown is over
    if (timeleft < 0) {
        clearInterval(myfunc);
        document.getElementById("days3").innerHTML = ""
        document.getElementById("hours3").innerHTML = "" 
        document.getElementById("minutes3").innerHTML = ""
        document.getElementById("seconds3").innerHTML = ""
        document.getElementById("end").innerHTML = "TIME UP!!";
    }
    },500);
    var myfunc = setInterval(function() {

      var now = new Date().getTime();
      var timeleft = countDownDate4 - now;
          
      // Calculating the days, hours, minutes and seconds left
      var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
      var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
          
      // Result is output to the specific element
      document.getElementById("days4").innerHTML = days + "d "
      document.getElementById("hours4").innerHTML = hours + "h " 
      document.getElementById("minutes4").innerHTML = minutes + "m " 
      document.getElementById("seconds4").innerHTML = seconds + "s " 
          
      // Display the message when countdown is over
      if (timeleft < 0) {
          clearInterval(myfunc);
          document.getElementById("days4").innerHTML = ""
          document.getElementById("hours4").innerHTML = "" 
          document.getElementById("minutes4").innerHTML = ""
          document.getElementById("seconds4").innerHTML = ""
          document.getElementById("end").innerHTML = "TIME UP!!";
      }
      },500);

    /* function to display signup form*/
    function SignUpForm(){
      document.getElementById("loginForm").style.display="none";
      document.getElementById("signup").style.display="block";
    }

    function LoginForm(){
      document.getElementById("loginForm").style.display="block";
      document.getElementById("signup").style.display="none";
      document.getElementById("signup2").style.display="none";
    }

    /* function to diplay featured bids*/
    function featuredBidsDisplay(){
      document.getElementById("featuredbids").style.display="grid";
      document.getElementById("CurrentBids").style.display="none";
      document.getElementById("BidDetails").style.display="none";
      document.getElementById("ACinfo").style.display="none";
      document.getElementById("BidDetails1").style.display="none";
    document.getElementById("BidDetails2").style.display="none";
    document.getElementById("BidDetails3").style.display="none";
    document.getElementById("BidDetails4").style.display="none";
    }
    
  function BidsDisplay(){
    document.getElementById("featuredbids").style.display="none";
    document.getElementById("CurrentBids").style.display="grid";
    document.getElementById("BidDetails").style.display="none";
    document.getElementById("ACinfo").style.display="none";
    document.getElementById("BidDetails1").style.display="none";
    document.getElementById("BidDetails2").style.display="none";
    document.getElementById("BidDetails3").style.display="none";
    document.getElementById("BidDetails4").style.display="none";
  }
  function Signout(){
   window.location.href="index.ejs";
}
  function FullDisplay1(){
    document.getElementById("featuredbids").style.display="none";
    document.getElementById("CurrentBids").style.display="none";
    document.getElementById("BidDetails1").style.display="grid";
    document.getElementById("ACinfo").style.display="none";
    document.getElementById("BidDetails1").style.display="grid";
    document.getElementById("BidDetails2").style.display="none";
    document.getElementById("BidDetails3").style.display="none";
    document.getElementById("BidDetails4").style.display="none";
  }
  function FullDisplay2(){
    document.getElementById("featuredbids").style.display="none";
    document.getElementById("CurrentBids").style.display="none";
    document.getElementById("BidDetails1").style.display="none";
    document.getElementById("BidDetails2").style.display="grid";
    document.getElementById("BidDetails3").style.display="none";
    document.getElementById("BidDetails4").style.display="none";
    document.getElementById("ACinfo").style.display="none";
  }
  function FullDisplay3(){
    document.getElementById("featuredbids").style.display="none";
    document.getElementById("CurrentBids").style.display="none";
    document.getElementById("BidDetails1").style.display="none";
    document.getElementById("BidDetails2").style.display="none";
    document.getElementById("BidDetails3").style.display="grid";
    document.getElementById("BidDetails4").style.display="none";
    document.getElementById("ACinfo").style.display="none";
  }
  function FullDisplay4(){
    document.getElementById("featuredbids").style.display="none";
    document.getElementById("CurrentBids").style.display="none";
    document.getElementById("BidDetails1").style.display="none";
    document.getElementById("BidDetails2").style.display="none";
    document.getElementById("BidDetails3").style.display="none";
    document.getElementById("BidDetails4").style.display="grid";
    document.getElementById("ACinfo").style.display="none";
  }
  function PlaceBid(){
    document.getElementById("Placebid").style.display="block";
    document.getElementsById("disableButton1").style.display="none";
  }
  function PlaceBid4(){
    document.getElementById("Placebid4").style.display="block";
  }
  function PlaceBid2(){
    document.getElementById("Placebid2").style.display="block";
  }
  function PlaceBid3(){
    document.getElementById("Placebid3").style.display="block";
  }

  function AcInfoDisplay(){
    document.getElementById("featuredbids").style.display="none";
    document.getElementById("CurrentBids").style.display="none";
    document.getElementById("BidDetails").style.display="none";
    document.getElementById("ACinfo").style.display="block";
    document.getElementById("BidDetails1").style.display="none";
    document.getElementById("BidDetails2").style.display="none";
    document.getElementById("BidDetails3").style.display="none";
    document.getElementById("BidDetails4").style.display="none";
  }
  function ScInfoDisplay(){
    document.getElementById("SellerAccountInfo").style.display="block";
    document.getElementById("bidAddMenu").style.display="none";
  }
  function sellerCurrentBidsDisplay(){
    document.getElementById("sellerCurrentBids").style.display="grid";
    document.getElementById("bidAddMenu").style.display="none";
    document.getElementById("SellerAccountInfo").style.display="none";
  }
  /*function to add a bid*/
  function AddingBid(){
    document.getElementById("SellerAccountInfo").style.display="none";
    document.getElementById("bidAddMenu").style.display="block";
    document.getElementById("sellerCurrentBids").style.display="none";
  }