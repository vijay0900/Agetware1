def combine_elements(list1, list2):
    combined = sorted(list1 + list2, key=lambda x: x['positions'][0])
    result = []

    def overlap(p1, p2):
        l1, r1 = p1
        l2, r2 = p2
        overlap_len = max(0, min(r1, r2) - max(l1, l2))
        len1 = r1 - l1
        len2 = r2 - l2
        return overlap_len > len1 / 2 or overlap_len > len2 / 2

    for item in combined:
        if not result:
            result.append(item)
        else:
            last = result[-1]
            if overlap(last['positions'], item['positions']):
                last['values'] += item['values']
                
            else:
                result.append(item)
    return result


list1 = [{"positions": [0, 5], "values": [1, 2]}]
list2 = [{"positions": [3, 8], "values": [3, 4]}]
print(combine_elements(list1, list2))
