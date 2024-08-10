// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface for 1inch Aggregation Router
interface IAggregationRouterV4 {
    function swap(
        address caller,
        IAggregationExecutor executor,
        SwapDescription calldata desc,
        bytes calldata permit,
        bytes calldata data
    ) external payable returns (uint returnAmount, uint gasLeft);

    struct SwapDescription {
        address srcToken;
        address dstToken;
        address payable dstReceiver;
        uint amount;
        uint minReturnAmount;
        uint flags;
        bytes permit;
    }
}

// Interface for the aggregation executor
interface IAggregationExecutor {
    function callBytes(bytes calldata data) external;
}

// ERC20 Token Interface
interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract OneInchSniperBot {
    address public owner;
    IAggregationRouterV4 public aggregatorRouter;
    IERC20 public token;

    event TokensApproved(address indexed token, address indexed spender, uint256 amount);
    event TokensSwapped(address indexed fromToken, address indexed toToken, uint256 amountIn, uint256 amountOutMin, uint256 timestamp);
    event TokensWithdrawn(address indexed token, uint256 amount);
    event EtherWithdrawn(uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, "Transaction expired");
        _;
    }

    constructor(address _aggregatorRouter, address _token) {
        owner = msg.sender;
        aggregatorRouter = IAggregationRouterV4(_aggregatorRouter);
        token = IERC20(_token);
    }

    function approveRouter(uint256 amount) external onlyOwner {
        require(token.approve(address(aggregatorRouter), amount), "Approval failed");
        emit TokensApproved(address(token), address(aggregatorRouter), amount);
    }

    function snipe(
        address srcToken, 
        address dstToken, 
        uint amountIn, 
        uint minReturnAmount, 
        bytes calldata data,
        uint deadline
    ) external onlyOwner ensure(deadline) {
        require(token.transferFrom(msg.sender, address(this), amountIn), "Transfer failed");

        IAggregationRouterV4.SwapDescription memory desc = IAggregationRouterV4.SwapDescription({
            srcToken: srcToken,
            dstToken: dstToken,
            dstReceiver: payable(msg.sender),
            amount: amountIn,
            minReturnAmount: minReturnAmount,
            flags: 0,
            permit: ""
        });

        aggregatorRouter.swap(
            address(this),
            IAggregationExecutor(address(0)), // No executor needed for simple swaps
            desc,
            "",
            data
        );
        emit TokensSwapped(srcToken, dstToken, amountIn, minReturnAmount, block.timestamp);
    }

    function getBalance(address _token) external view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    function withdrawTokens(address _token, uint256 _amount) external onlyOwner {
        require(IERC20(_token).transfer(owner, _amount), "Transfer failed");
        emit TokensWithdrawn(_token, _amount);
    }

    function withdrawEther() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
        emit EtherWithdrawn(balance);
    }

    receive() external payable {}
}
