// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CreativeEscrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    enum Status { None, Funded, Accepted, Submitted, Completed, Disputed, Refunded }

    struct Job {
        address buyer;
        address creator;
        uint256 amount;
        uint64 deadline;
        string metadataURI;
        string deliverableURI;
        Status status;
    }

    IERC20 public immutable usdc;
    address public treasury;
    uint16 public feeBps;
    uint256 public nextJobId = 1;
    mapping(uint256 => Job) public jobs;

    event JobCreated(uint256 indexed jobId, address indexed buyer, address indexed creator, uint256 amount, uint64 deadline, string metadataURI);
    event JobAccepted(uint256 indexed jobId);
    event WorkSubmitted(uint256 indexed jobId, string deliverableURI);
    event JobPaid(uint256 indexed jobId, uint256 creatorAmount, uint256 platformFee);
    event JobDisputed(uint256 indexed jobId, address indexed raisedBy);
    event JobRefunded(uint256 indexed jobId, uint256 amount);
    event TreasuryUpdated(address indexed treasury);
    event FeeUpdated(uint16 feeBps);

    constructor(address usdc_, address treasury_, uint16 feeBps_) {
        require(usdc_ != address(0) && treasury_ != address(0), "zero address");
        require(feeBps_ <= 1_000, "fee too high");
        usdc = IERC20(usdc_);
        treasury = treasury_;
        feeBps = feeBps_;
    }

    function createJob(address creator, uint256 amount, uint64 deadline, string calldata metadataURI) external nonReentrant returns (uint256 jobId) {
        require(creator != address(0), "invalid creator");
        require(amount > 0, "amount=0");
        require(deadline > block.timestamp, "bad deadline");

        jobId = nextJobId++;
        jobs[jobId] = Job(msg.sender, creator, amount, deadline, metadataURI, "", Status.Funded);
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        emit JobCreated(jobId, msg.sender, creator, amount, deadline, metadataURI);
    }

    function acceptJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(msg.sender == job.creator, "creator only");
        require(job.status == Status.Funded, "wrong status");
        require(block.timestamp <= job.deadline, "expired");
        job.status = Status.Accepted;
        emit JobAccepted(jobId);
    }

    function submitWork(uint256 jobId, string calldata deliverableURI) external {
        Job storage job = jobs[jobId];
        require(msg.sender == job.creator, "creator only");
        require(job.status == Status.Accepted, "wrong status");
        require(block.timestamp <= job.deadline, "expired");
        require(bytes(deliverableURI).length > 0, "empty deliverable");
        job.deliverableURI = deliverableURI;
        job.status = Status.Submitted;
        emit WorkSubmitted(jobId, deliverableURI);
    }

    function approveWork(uint256 jobId) external nonReentrant {
        Job storage job = jobs[jobId];
        require(msg.sender == job.buyer, "buyer only");
        require(job.status == Status.Submitted, "wrong status");

        job.status = Status.Completed;
        uint256 platformFee = (job.amount * feeBps) / 10_000;
        uint256 creatorAmount = job.amount - platformFee;
        usdc.safeTransfer(job.creator, creatorAmount);
        if (platformFee > 0) usdc.safeTransfer(treasury, platformFee);
        emit JobPaid(jobId, creatorAmount, platformFee);
    }

    function raiseDispute(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(msg.sender == job.buyer || msg.sender == job.creator, "party only");
        require(job.status == Status.Accepted || job.status == Status.Submitted, "wrong status");
        job.status = Status.Disputed;
        emit JobDisputed(jobId, msg.sender);
    }

    function refundExpired(uint256 jobId) external nonReentrant {
        Job storage job = jobs[jobId];
        require(msg.sender == job.buyer, "buyer only");
        require(block.timestamp > job.deadline, "not expired");
        require(job.status == Status.Funded || job.status == Status.Accepted, "wrong status");
        job.status = Status.Refunded;
        usdc.safeTransfer(job.buyer, job.amount);
        emit JobRefunded(jobId, job.amount);
    }

    function resolveDispute(uint256 jobId, bool payCreator) external onlyOwner nonReentrant {
        Job storage job = jobs[jobId];
        require(job.status == Status.Disputed, "not disputed");

        if (!payCreator) {
            job.status = Status.Refunded;
            usdc.safeTransfer(job.buyer, job.amount);
            emit JobRefunded(jobId, job.amount);
            return;
        }

        job.status = Status.Completed;
        uint256 platformFee = (job.amount * feeBps) / 10_000;
        uint256 creatorAmount = job.amount - platformFee;
        usdc.safeTransfer(job.creator, creatorAmount);
        if (platformFee > 0) usdc.safeTransfer(treasury, platformFee);
        emit JobPaid(jobId, creatorAmount, platformFee);
    }

    function setTreasury(address treasury_) external onlyOwner {
        require(treasury_ != address(0), "zero address");
        treasury = treasury_;
        emit TreasuryUpdated(treasury_);
    }

    function setFeeBps(uint16 feeBps_) external onlyOwner {
        require(feeBps_ <= 1_000, "fee too high");
        feeBps = feeBps_;
        emit FeeUpdated(feeBps_);
    }
}
