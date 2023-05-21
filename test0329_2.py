n = int(input())
def getIt(n):
    res = 1
    for i in range(1,n+1):
        res = res * i
    return res

def getMin(n):
    res = abs(n)
    x = 3
    nums = [1,1]
    while getIt(x) < n:
        y = 1
        while y < n:
            if y == 2:
                y += 1
                continue
            if abs(getIt(x)*y-y-n) < res:
                nums = [x,y]
                res = abs(getIt(x)*y-y-n)
            if res == 0:
                return [x,y]
            y += 1
        x += 1
    return nums
res = getMin(n)
for i in res:
    print(i,end=" ")
