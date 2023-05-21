n = int(input())
nums = list(map(int,input().split()))
k = int(input())
leftEnds = list(map(int,input().split()))
rightEnds = list(map(int,input().split()))
operations = input()
opNums = list(map(int,input().split()))
def operation(num, opNum, op):
    if op == '=':
        return opNum
    if op == '|':
        return (num|opNum)
    if op == '&':
        return (num&opNum)
def getAnswers(nums,leftEnds,rightEnds,operations,opNums,k):
    res = nums[:]
    for i in range(k):
        leftEnd = leftEnds[i]
        rightEnd = rightEnds[i]
        for j in range(leftEnd-1,rightEnd):
            res[j] = operation(res[j],opNums[i],operations[i])
    return res
# nums = [5,4,7,4]
# leftEnds = [1,2,3,2]
# rightEnds = [4,3,4,2]
# operations = "=|&="
# opNums = [8,3,6,2]
res = getAnswers(nums,leftEnds,rightEnds,operations,opNums,4)
print(res)