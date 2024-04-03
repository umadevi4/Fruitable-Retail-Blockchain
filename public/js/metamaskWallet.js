let account = null;
 //   connect the contract with window
 const ABI = [
    {
      inputs: [],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "getAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "_to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
];
const contractAddress = "0xfee7B89Ff03378C91641A03D5c4060440a54b394";


function setCookie(name, value){
    const d = new Date();
    d.setTime(d.getTime() + (2*24*60*60*1000)); // 2 days
    let expires = "expires="+ d.toUTCString();
    document.cookie = name+"="+value+";"+expires+";path=/";
    return;
}

function getCookie(name){
    let cname = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i=0; i<ca.length; i++){
        let c = ca[i];
        while(c.charAt(0) == ' '){
            c = c.substring(1);
        }
        if(c.indexOf(cname) == 0){
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

const deleteCookie = async (name) =>{
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return;
}



const checkLogin = async () => { 
    let userStatus = false;
    await ethereum.request({method: "eth_requestAccounts"}).catch((err) => {
        if(err.code === -32002)
        {
            $('.loginDub').show();
            $('#bannerBuyNow').hide();
        }
    });
}

const getAccount = async () => {
    const accounts = await ethereum.request({method: "eth_requestAccounts"});
    return accounts[0];
}

const logout = async () => {  
    if (window.ethereum) {
        // Request Metamask to clear accounts
        await window.ethereum.request({ 
            method: 'wallet_revokePermissions', 
            params: [
                {
                    eth_accounts: {},
                },
            ], 
        }).then((response) => {
            deleteCookie("loggedIn");
        }).catch((error) => {
            console.error(error);
        });
    }
}

const connectMetamask = async () => {

      
    if (window.ethereum !== undefined) {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        account = accounts[0];
        document.getElementById("userArea").innerHTML = `User Account: ${account}`;
    }else{
      ethereum.request({ method: 'eth_requestAccounts' });
    }
  }

  const connectContract = async () => {
    window.web3 = new Web3(window.ethereum);
    window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
    document.getElementById("contractArea").innerHTML = "Connected to Contract"; // calling the elementID above
  }

  const getContractAccount = async () => {
    const data = await window.contract.methods.getAddress().call();
    document.getElementById("contractAccount").innerHTML = `Contract Account: ${data}`;
  }

  const getBalance = async () => { // const getBalance is the HTML function & .contract.getBalance is the smart contract function
    
    window.web3 = new Web3(window.ethereum);
    window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
    
    const data = await window.contract.methods.getBalance().call();
    const ETHBalance = window.web3.utils.fromWei(data, "ether");
    $('#contractBalanceInput').val(`Contract Balance: ${ETHBalance} ETH`);
  }

  const deposit = async (account) => {
    
    const amount = $("#amount").val();
    if(amount!==''){
        window.web3 = new Web3(window.ethereum);
        window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
        const amountInWei = window.web3.utils.toWei(amount, "ether");
        $('#spinner').addClass('show');

      try {
        await window.contract.methods.deposit().send({ from: account, value: amountInWei }).then((response) => {
            alert('Contract has been added with funds successfully!');
            location.reload();
        });
        
      } catch (error) {

        alert('Failed to add fund the contract!');
        location.reload();
      }

    }else{
        alert('Please enter the ETH amount to deposit!');
    }
    
  }

  const withDraw = async (amount, address, account) => {
    window.web3 = new Web3(window.ethereum);
    window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
    // Convert Ether amount to Wei
    const amountInWei = window.web3.utils.toWei(amount.toString(), "ether");
    $('#spinner').addClass('show');

    // Withdraw the amount from the contract
    try {
      const result= await window.contract.methods
      .withdraw(address, amountInWei)
      .send({ from: account })
      .then((response) => {
        alert("Success");
        location.reload();
      });
      
    } catch (error) {
      alert("failed");
      location.reload();
    }
    

  };

  const depositEtherToContract = async (price, account) => {
    //   connect the contract with window
    window.web3 = new Web3(window.ethereum);
    window.contract = await new window.web3.eth.Contract(ABI, contractAddress);
    const priceWei = window.web3.utils.toWei(String(price), 'ether');
    // deposit the amount in to the contract
    $('#spinner').addClass('show');
    try {
      await window.contract.methods
      .deposit()
      .send({ from: account, value: priceWei })
      .then((response) => {
        alert("Success");
        deleteCookie("cart");
        location.reload();
      });
      
    } catch (error) {
      alert("Failed");
      location.reload();
    }
   
  };


$(document).ready(function(){
    // ethereum account changed event listener
    if(typeof window.ethereum !== "undefined")
    {
        window.ethereum.on("accountsChanged", function(accounts){
            setCookie("loggedIn", "true");
            location.reload();
        });

        //  check if user is logged in
        if(getCookie("loggedIn") == "true")
        {
            getAccount().then((account) => {
                $('#loginbtn').hide();
                $('.loginTab').hide();
            });
        }
    }

    if (typeof window.ethereum == "undefined") {
        $('#loginbtn').hide();
        deleteCookie("loggedIn");
        $('#installMetamaskBtn').show();
    }

    $('#loginbtn').click(function(){
        checkLogin();
    });

    $('#logout').click(function(){
        logout();
    });

    // methods
    $('#myMetamaskAccount').click(function(e){
        e.preventDefault();
        getAccount().then((myAccount) => {
            $('#myMetamaskAccountInput').val(`Metamask Address Account: ${myAccount}`);
        });
        

    })

    $('#myContractAddress').click(function(e){
        e.preventDefault();
        $('#myContractAddressInput').val(`Deployed Address: ${contractAddress}`);
    });

    $('#contractBalance').click(function(e){
        e.preventDefault();
        getBalance();
    });

    $('#deposit').click(function(e){
        e.preventDefault();
        getAccount().then((myAccount) => {
            deposit(myAccount);
        });
    });

    $('#withdraw').click(function(e){
        e.preventDefault();
        getAccount().then((myAccount) => {
            var address= $('#accountAddress').val();
            var eth= $('#withDrawAmount').val();
            if(eth == "" || address == ""){
                alert("Please enter the amount");
            }
            withDraw(eth, address, myAccount);
        });
    });

    $(".final-price-button").on("click", function () {
        // get the price
        var price = $(this).attr("data-price");
        getAccount().then((myAccount) => {
            depositEtherToContract(price, myAccount);
        });
      });
});