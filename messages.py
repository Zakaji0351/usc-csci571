res = {}
messages = []
subscription = {}


def Broadcast(clientID, MsgID):
    messages.append(MsgID)
    if clientID not in res:
        res[clientID] = [MsgID]
    else:
        res[clientID].append(MsgID)
    print(1)
    return


def Subscribe(id1, id2):
    if id1 not in subscription:
        if id2 != id1:
            subscription[id1] = [id2]
            print(0)
            return
        else:
            print(2)
            return
    else:
        if id2 in subscription[id1]:
            print(1)
            return
        else:
            if id2 != id1:
                subscription[id1].append(id2)
                print(0)
                return
            else:
                print(2)
                return


def UnSubscribe(id1, id2):
    if id1 == id2:
        print(2)
        return
    else:
        if id1 not in subscription:
            print(1)
            return
        else:
            if id2 in subscription[id1]:
                subscription[id1].remove(id2)
                print(0)
                return
            else:
                print(1)
                return


def GetMsg(clientID, N):
    Ms = []
    if clientID in res:
        for i in res[clientID]:
            Ms.append(i)
        if clientID in subscription:
            for ID in subscription[clientID]:
                if ID in res:
                    for j in res[ID]:
                        Ms.append(j)
    else:
        print(-1)
        return
    count = 0
    for k in range(len(messages) - 1, -1, -1):
        if messages[k] in Ms:
            print(messages[k], end=" ")
            count += 1
            if count >= N:
                break
        print()


def parse_line(line):
    parts = line.split()
    return [parts[0], int(parts[1]), int(parts[2])]


commands = []
for i in range(6):
    line = input()
    commands.append(parse_line(line))
for command in commands:
    if command[0] == "Broadcast":
        Broadcast(command[1], command[2])
    elif command[0] == "GetMsg":
        GetMsg(command[1], command[2])
    elif command[0] == "Subscribe":
        Subscribe(command[1], command[2])
    elif command[0] == "Unsubscribe":
        UnSubscribe(command[1], command[2])
