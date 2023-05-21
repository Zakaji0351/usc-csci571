path = []
res = []
def backtracking(str, startIndex,k):
    if len(path) == k:
        res.append(path[:])
        return
    for i in range(startIndex,len(str)):
        if str[startIndex:i-startIndex+1]:
            path.append(str[startIndex:i-startIndex+1])
        else:
            continue
        backtracking(str,i+1,k)
        path.pop()
str = "ababbbb"
backtracking(str,0,3)
