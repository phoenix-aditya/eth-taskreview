pragma solidity ^0.5.16;

contract reviews{
    struct taskreview{
        address employeeid; // the name of the employee task is assigned to
        string employeename; // the id of the employee
        string taskname; // the name desc of the task
        string taskid; // the id of the task in the review
        // string git_pr_id;
        bool[] boosted; // upto 5 employees can support the quality of task
    }
    uint256 public taskreviewid;
    mapping(uint256 => taskreview) public allreviews;

    struct boostit{
        address employeeid;
    }
    uint256 public taskboostedid;
    mapping(uint256 => boostit) public allboosts;

    event newtaskreviewevent(
        uint256 indexed taskreviewid
        );
        event newboostreviewevent(
            uint indexed taskreviewid,
            uint indexed taskboostedid
        );

    function newtaskreview(string memory employeename, string memory taskname, string memory taskid) public {
        taskreview memory newtaskreviewvar=taskreview(msg.sender,employeename,taskname,taskid,new bool[](5));
        allreviews[taskreviewid]= newtaskreviewvar;

        emit newtaskreviewevent(taskreviewid++);
    }

    function boosttaskreview(uint256 _taskreviewid) public payable{
        taskreview storage tt=allreviews[_taskreviewid];
        uint256 counter=0;
        for(uint256 i=0;i<5;i++){
            if(tt.boosted[i]==true){
                counter++;
            }
        }
        if(counter==5){
            revert("max boost limit reached");
        }
        _sendFunds(tt.employeeid, 1);
        _createboost(_taskreviewid);
    }

    function _sendFunds(address reciever, uint256 val) internal{
        address(uint256(reciever)).transfer(val);
    }
    function _createboost(uint256 _taskreviewid) internal {
        allboosts[taskboostedid]=boostit(msg.sender);
        taskreview storage tt=allreviews[_taskreviewid];
        for(uint256 i=0;i<5;i++){
            if(tt.boosted[i]==false){
                tt.boosted[i]=true;
                break;
            }
        }
        emit newboostreviewevent(_taskreviewid, taskboostedid++);
    }
}

