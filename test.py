n = int(input())
nums = input()
class TreeNode:
    def __init__(self, val = 0, left = None, right = None):
        self.val = val
        self.left = left
        self.right = right
def constructTree(nums):
    if not nums:
        return None
    root = TreeNode(-1)
    Tree = []
    for i in range(len(nums)):
        if nums[i] != -1:
            node = TreeNode(nums[i])
        else:
            node = None
        Tree.append(node)
        if i == 0:
            root = node
    for i in range(len(Tree)):
        if Tree[i] and 2*i+1 < len(Tree):
            Tree[i].left = Tree[2*i+1]
            if 2*i+2 < len(Tree):
                Tree[i].right = Tree[2*i+2]
    return root
root = constructTree(nums)
def numberTree(root):
    if not root:
        return [None,1]
    left = numberTree(root.left)
    right = numberTree(root.right)
    res = 1
    if left[0] and right[0] and left[0] != right[0]:
        res = left[1] * right[1] * 2
    if left[0] and right[0] and left[0] == right[0]:
        res = left[1] * right[1]
    return [root.val,res]
res = numberTree(root)
print(res[1])