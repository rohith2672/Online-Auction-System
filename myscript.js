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
      document.getElementById("featuredbids").style.display="none";
      document.getElementById("CurrentBids").style.display="grid";
      document.getElementById("BidDetails").style.display="none";
      document.getElementById("ACinfo").style.display="none";
    }
    
  function BidsDisplay(){
    document.getElementById("featuredbids").style.display="grid";
    document.getElementById("CurrentBids").style.display="none";
    document.getElementById("BidDetails").style.display="none";
    document.getElementById("ACinfo").style.display="none";
  }
  function Signout(){
    window.location.href="index.html";
  }
  function FullDisplay(){
    document.getElementById("featuredbids").style.display="none";
    document.getElementById("CurrentBids").style.display="none";
    document.getElementById("BidDetails").style.display="grid";
    document.getElementById("ACinfo").style.display="none";
  }
  function PlaceBid(){
    document.getElementById("Placebid").style.display="block";
    document.getElementsById("disableButton1").style.display="none";
  }
  function showCredits(){
    document.getElementById("creditsAvailable").style.display="grid";
  }
  function AcInfoDisplay(){
    document.getElementById("featuredbids").style.display="none";
    document.getElementById("CurrentBids").style.display="none";
    document.getElementById("BidDetails").style.display="none";
    document.getElementById("ACinfo").style.display="grid";
  }
  function ScInfoDisplay(){
    document.getElementById("SellerAccountInfo").style.display="block";
    document.getElementById("bidAddMenu").style.display="none";
  }
  /*function to add a bid*/
  function AddingBid(){
    document.getElementById("SellerAccountInfo").style.display="none";
    document.getElementById("bidAddMenu").style.display="block";
  }