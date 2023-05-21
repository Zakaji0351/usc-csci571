nums1 = list(map(int,input().split()))
n = nums1[0]
k = nums1[1]
nums = list(map(int,input().split()))
s = input()
def minCost(n,k,nums,s):
    dp = [0] * n
    dp[0] = nums[0]
    for i in range(1,n):
        if s[i] == s[i-1]:
            dp[i] = dp[i-1] + nums[i]
        else:
            if i > 1:
                dp[i] = min(k+dp[i-2],dp[i-1]+nums[i])
            else:
                dp[i] = min(k,dp[i-1]+nums[i])
    return dp[-1]
res = minCost(n,k,nums,s)
print(res)