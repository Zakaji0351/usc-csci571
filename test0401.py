def getMostVisited(sprints):
    # Write your code here
    from collections import defaultdict
    adict = defaultdict(int)
    for i in range(len(sprints) - 1):
        start = min(sprints[i], sprints[i + 1])
        end = max(sprints[i], sprints[i + 1])
        adict[start] += 1
        adict[end + 1] -= 1
    max_count = 0
    current_count = 0
    most_visited = 0
    for room in sorted(adict):
        current_count += adict[room]
        if current_count > max_count:
            max_count = current_count
            most_visited = room

    return most_visited
sprints = [1,6,3,8]
getMostVisited(sprints)