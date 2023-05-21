from collections import defaultdict
n = int(input())
arr = []
for _ in range(n):
    arr.append(list(map(int,input().split())))
def constructString(nums):
    list = []
    template = ['m','h','y']
    template1 = ['h','h','y','y','m','m']
    x = nums[0]
    y = nums[1]
    z = nums[2]
    if y%2 == 0 and z == y + 1:
        return -1
    if x != 0:
        for _ in range(x+2):
            list.append('m')
    if y != 0 and x != 0:
        for i in range(y):
            list.append(template1[i%len(template1)])
    if y != 0 and x == 0:
        for i in range(y+2):
            list.append(template1[i%len(template1)])
    if z != 0 and y != 0:
        if list[-1] == 'm':
            start = 1
        elif list[-1] == 'h':
            start = 2
        else:
            start = 0
        for j in range(z):
            list.append(template[(j+start)%len(template)])
    if z != 0 and x == 0:
        for j in range(z+2):
            list.append(template[j%len(template)])
    return ''.join(list)
for i in range(n):
    res = constructString(arr[i])
    print(res)


