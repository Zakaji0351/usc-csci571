nums = list(map(int,input().split()))
n = nums[0]
k = nums[1]
def isValid(nums,k):
    maxNum = -float('inf')
    res = 0
    for i in nums:
        maxNum = max(i,maxNum)
        if i == maxNum:
            res += 1
        if res > k:
            return False
    if res == k:
        return True
    return False
path = []
res = []
def backtracking(n,k):
    if len(path) == n:
        if isValid(path,k):
            res.append(path[:])
        return
    for i in range(1,n+1):
        if i in path:
            continue
        path.append(i)
        if res:
            return
        else:
            backtracking(n,k)
        path.pop()
backtracking(n,k)
print(res[0])

