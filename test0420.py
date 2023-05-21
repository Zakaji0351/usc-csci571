o = {
    "foo" : "123",
    "foo1" : "123",
    "bar" : {
        "far" : "345",
        "subFoo" : {
            "subBar" : 'subBar'
        }
    }
}
res = []
path = []
def getPath(o):
    for key, value in o.items():
        if type(value) == str:
            path.append(key)
            res.append('.'.join(path[:]))
            path.pop()
        else:
            path.append(key)
            getPath(o[key])
            path.pop()
getPath(o)