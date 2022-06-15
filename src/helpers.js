
export function findFurthestOpenSpace(index, arr, lendpoint) {
    // iterates backward through array starting at starting index and looks for 
    // furthest empty space such that the path to that space is empty
    let ptr = index - 1;
    let indexVal = arr[index];

    while (lendpoint < ptr) {
        if (arr[ptr] == indexVal) return {index: ptr, didMerge: true};
        if (arr[ptr] !== '') break;
        ptr -= 1;
    }
    return {index: ptr + 1, didMerge: false};
}
